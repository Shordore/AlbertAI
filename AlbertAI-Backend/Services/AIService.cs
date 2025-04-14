using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace AlbertAI.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiEndpoint;

        public AIService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["AzureOpenAI:ApiKey"];
            _apiEndpoint = configuration["AzureOpenAI:Endpoint"] ?? "https://api.openai.com/v1/chat/completions";
            
            // If no API key is provided, use a mock response for testing
            if (string.IsNullOrEmpty(_apiKey))
            {
                Console.WriteLine("WARNING: No API key provided for AIService. Using mock responses.");
            }
        }

        public async Task<string> GetChatResponse(string userMessage, List<ChatMessage> conversationHistory)
        {
            // If no API key, return mock response
            if (string.IsNullOrEmpty(_apiKey))
            {
                return await GetMockResponse(userMessage);
            }

            try
            {
                // Prepare messages including conversation history
                var messages = new List<object>
                {
                    new { role = "system", content = "You are AlbertAI, a helpful study assistant specialized in generating accurate educational content. Provide clear, concise, and accurate responses focused on the specific subject being requested." }
                };
                
                // Add conversation history
                if (conversationHistory != null && conversationHistory.Any())
                {
                    foreach (var msg in conversationHistory)
                    {
                        messages.Add(new { role = msg.Role.ToLower(), content = msg.Content });
                    }
                }
                
                // Add the current user message
                messages.Add(new { role = "user", content = userMessage });
                
                var requestBody = new
                {
                    model = "gpt-4o",
                    messages = messages.ToArray(),
                    temperature = 0.7,
                    max_tokens = 1000
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("api-key", _apiKey);

                var response = await _httpClient.PostAsync(_apiEndpoint, content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var responseData = JsonSerializer.Deserialize<JsonElement>(responseContent);

                return responseData.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? 
                        "I apologize, but I couldn't generate a response. Please try again.";
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in GetChatResponse: {ex.Message}");
                return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
            }
        }

        private async Task<string> GetMockResponse(string userMessage)
        {
            await Task.Delay(500); // Simulate API delay
            
            if (userMessage.Contains("flashcard") || userMessage.Contains("Generate"))
            {
                // Extract topic from message like "Generate 5 flashcards about {topic}"
                string topic = "general knowledge";
                if (userMessage.Contains("about"))
                {
                    int index = userMessage.IndexOf("about") + 6;
                    topic = userMessage.Substring(index).Trim('.').Trim();
                }
                
                // Return mock flashcards as JSON
                return @"[
                    {
                        ""question"": ""What is the capital of France?"",
                        ""answer"": ""Paris""
                    },
                    {
                        ""question"": ""What is the largest organ in the human body?"",
                        ""answer"": ""Skin""
                    },
                    {
                        ""question"": ""What is the chemical symbol for gold?"",
                        ""answer"": ""Au""
                    },
                    {
                        ""question"": ""Who wrote Romeo and Juliet?"",
                        ""answer"": ""William Shakespeare""
                    },
                    {
                        ""question"": ""What is the formula for water?"",
                        ""answer"": ""H2O""
                    }
                ]";
            }
            
            return "I'm sorry, I don't have a specific answer for that question. This is a mock response since no API key was provided.";
        }
    }

    public class ChatMessage
    {
        public string Role { get; set; }
        public string Content { get; set; }
    }
} 