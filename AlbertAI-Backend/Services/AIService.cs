using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

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
            _apiEndpoint = "https://models.inference.ai.azure.com/v1/chat/completions";
        }

        public async Task<string> GetChatResponse(string userMessage, List<ChatMessage> conversationHistory)
        {
            try
            {
                var requestBody = new
                {
                    model = "gpt-4o",
                    messages = new[]
                    {
                        new { role = "system", content = "You are AlbertAI, a helpful study assistant. Provide clear, concise, and accurate responses." },
                        new { role = "user", content = userMessage }
                    },
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
    }

    public class ChatMessage
    {
        public string Role { get; set; }
        public string Content { get; set; }
    }
} 