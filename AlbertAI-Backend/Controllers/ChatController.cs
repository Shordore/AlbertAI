using Microsoft.AspNetCore.Mvc;
using AlbertAI.Services;

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

            var response = await _aiService.GetChatResponse(request.Message, request.ConversationHistory);
            return Ok(new { response });
        }

        public class ChatRequest
        {
            public string Message { get; set; }
            public List<ChatMessage> ConversationHistory { get; set; }
        }
    }
} 