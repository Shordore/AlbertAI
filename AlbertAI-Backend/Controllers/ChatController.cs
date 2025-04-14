using Microsoft.AspNetCore.Mvc;
using AlbertAI.Services;
using System.Threading.Tasks;
using System;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AIService _aiService;

        public ChatController(AIService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            if (string.IsNullOrEmpty(request.Message))
            {
                return BadRequest("Message cannot be empty");
            }

            try
            {
                var response = await _aiService.GetChatResponse(request.Message, request.ConversationHistory ?? new List<ChatMessage>());
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in SendMessage: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while processing your request." });
            }
        }

        public class ChatRequest
        {
            public string Message { get; set; }
            public List<ChatMessage> ConversationHistory { get; set; } = new List<ChatMessage>();
        }
    }
} 