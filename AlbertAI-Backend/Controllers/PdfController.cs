using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using UglyToad.PdfPig;
using System.Text;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenerateAIQuestionsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _azureApiKey;
        private readonly string _azureEndpoint;

        public GenerateAIQuestionsController()
        {
            _httpClient = new HttpClient();
            _azureApiKey = "6voYXKDGzVwTUMDVM4GXLB1mFpZwxNS6dfa2EWokZlorrYDCByGbJQQJ99BDACHYHv6XJ3w3AAAAACOGeKgb";
            _azureEndpoint = "https://sean-m9j7qnes-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadPdfs([FromForm] List<IFormFile> files, [FromHeader] string classCode)
        {
            if (string.IsNullOrEmpty(classCode))
                return BadRequest("Class code is required in the header.");

            if (files == null || files.Count == 0)
                return BadRequest("No files were uploaded.");

            var combinedText = new StringBuilder();

            foreach (var file in files)
            {
                if (file.ContentType != "application/pdf")
                    return BadRequest($"File {file.FileName} is not a PDF.");

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    
                    using (var pdfDocument = PdfDocument.Open(memoryStream.ToArray()))
                    {
                        foreach (var page in pdfDocument.GetPages())
                        {
                            combinedText.AppendLine(page.Text);
                        }
                        combinedText.AppendLine("\n--- End of PDF ---\n");
                    }
                }
            }

            string pdfContent = combinedText.ToString();
            
            // Limit content length if it's too large
            int maxContentLength = 2000;
            if (pdfContent.Length > maxContentLength)
            {
                pdfContent = pdfContent.Substring(0, maxContentLength);
            }

            try
            {
                // Generate different types of questions
                var multipleChoiceQuestions = await GenerateMultipleChoiceQuestionsAsync(pdfContent, classCode);
                var trueFalseQuestions = await GenerateTrueFalseQuestionsAsync(pdfContent, classCode);
                var flashcards = await GenerateFlashcardsAsync(pdfContent, classCode);
                
                // Save files (if server has write access)
                try
                {
                    string basePath = Path.Combine(Directory.GetCurrentDirectory(), "GeneratedQuestions");
                    Directory.CreateDirectory(basePath);
                    
                    await System.IO.File.WriteAllTextAsync(
                        Path.Combine(basePath, "multiple_choice_questions.json"), 
                        multipleChoiceQuestions);
                        
                    await System.IO.File.WriteAllTextAsync(
                        Path.Combine(basePath, "true_false_questions.json"), 
                        trueFalseQuestions);
                        
                    await System.IO.File.WriteAllTextAsync(
                        Path.Combine(basePath, "flashcards.json"), 
                        flashcards);
                }
                catch (Exception ex)
                {
                    // Just log the error, don't fail the whole request
                    Console.WriteLine($"Error saving question files: {ex.Message}");
                }

                // Create combined result
                var result = new
                {
                    multipleChoice = JsonDocument.Parse(multipleChoiceQuestions).RootElement,
                    trueFalse = JsonDocument.Parse(trueFalseQuestions).RootElement,
                    flashcards = JsonDocument.Parse(flashcards).RootElement
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Azure OpenAI API call failed: {ex.Message}");
            }
        }

        private async Task<string> GenerateMultipleChoiceQuestionsAsync(string pdfContent, string classCode)
        {
            string prompt = $@"Based on the following content:
---
{pdfContent}
---
Generate EXACTLY 50 multiple choice questions. They should be questions about {classCode} topics. Each question must be a JSON object with:
- question: string
- options: array of 4 strings
- answer: string (must match one of the options)

Return ONLY a valid JSON array of these objects, with no additional text.

Example format:
[
    {{
        ""question"": ""What is the capital of France?"",
        ""options"": [""London"", ""Berlin"", ""Paris"", ""Madrid""],
        ""answer"": ""Paris""
    }}
]";

            return await CallAzureOpenAIAsync(prompt);
        }

        private async Task<string> GenerateTrueFalseQuestionsAsync(string pdfContent, string classCode)
        {
            string prompt = $@"Based on the following content:
---
{pdfContent}
---
Generate EXACTLY 50 true/false questions about {classCode} topics. Each question must be a JSON object with:
- statement: string
- answer: boolean (true or false)

Return ONLY a valid JSON array of these objects, with no additional text.

Example format:
[
    {{
        ""statement"": ""The Earth is flat"",
        ""answer"": false
    }}
]";

            return await CallAzureOpenAIAsync(prompt);
        }

        private async Task<string> GenerateFlashcardsAsync(string pdfContent, string classCode)
        {
            string prompt = $@"Based on the following content:
---
{pdfContent}
---
Create EXACTLY 50 flashcards about {classCode} topics. Each flashcard must be a JSON object with:
- front: string (question or prompt)
- back: string (answer or explanation)

Return ONLY a valid JSON array of these objects, with no additional text.

Example format:
[
    {{
        ""front"": ""What is photosynthesis?"",
        ""back"": ""The process by which plants convert sunlight into energy""
    }}
]";

            return await CallAzureOpenAIAsync(prompt);
        }

        private async Task<string> CallAzureOpenAIAsync(string prompt)
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("api-key", _azureApiKey);

            var requestBody = new
            {
                messages = new[]
                {
                    new { role = "system", content = "You are a helpful assistant that generates educational questions in JSON format. You must return ONLY valid JSON arrays, with no additional text or explanation." },
                    new { role = "user", content = prompt }
                },
                temperature = 0.7,
                max_tokens = 4096
            };

            string jsonRequestBody = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonRequestBody, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_azureEndpoint, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Azure OpenAI API error: {errorContent}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var jsonDoc = JsonDocument.Parse(responseString);
            var root = jsonDoc.RootElement;

            var choices = root.GetProperty("choices");
            if (choices.GetArrayLength() > 0)
            {
                var message = choices[0].GetProperty("message");
                return message.GetProperty("content").GetString() ?? string.Empty;
            }
            return string.Empty;
        }
    }
}