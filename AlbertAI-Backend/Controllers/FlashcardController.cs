using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlbertAI.Data;
using AlbertAI.Models;
using AlbertAI.Services;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AlbertAI.Controllers
{
    [Route("api/flashcards")]
    [ApiController]
    public class FlashcardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AIService _aiService;

        public FlashcardController(AppDbContext context, AIService aiService)
        {
            _context = context;
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flashcard>>> GetAllFlashcards()
        {
            return await _context.Flashcards.ToListAsync();
        }

        // GET: api/flashcard/bycode?classCode=ABC12345
        [HttpGet("bycode")]
        public async Task<IActionResult> GetFlashcardsByClassCode([FromQuery] string classCode)
        {
            if (string.IsNullOrWhiteSpace(classCode))
            {
                return BadRequest("Parameter 'classCode' is required.");
            }

            // Join Flashcards with ClassCodes based on the Flashcard's ClassCodeId and the ClassCode's Id.
            var flashcards = await _context.Flashcards
                .Join(_context.ClassCodes,
                    flashcard => flashcard.ClassCodeId,
                    classEntity => classEntity.Id,
                    (flashcard, classEntity) => new { Flashcard = flashcard, ClassCode = classEntity })
                .Where(x => x.ClassCode.Code.ToLower() == classCode.ToLower())
                .Select(x => x.Flashcard)
                .ToListAsync();

            if (flashcards == null || flashcards.Count == 0)
            {
                return NotFound($"No flashcards found for class code: {classCode}");
            }

            return Ok(flashcards);
        }

        [HttpGet("class/{classCodeId}")]
        public async Task<ActionResult<IEnumerable<Flashcard>>> GetFlashcardsByClass(int classCodeId)
        {
            var flashcards = await _context.Flashcards
                .Where(f => f.ClassCodeId == classCodeId)
                .ToListAsync();

            if (!flashcards.Any())
            {
                return NotFound(new { message = "No flashcards found for this class." });
            }

            return Ok(flashcards);
        }

        [HttpPost]
        public async Task<ActionResult<Flashcard>> CreateFlashcard([FromBody] Flashcard flashcard)
        {
            if (!_context.ClassCodes.Any(c => c.Id == flashcard.ClassCodeId))
            {
                return BadRequest(new { message = "Invalid ClassCodeId. Class does not exist." });
            }

            _context.Flashcards.Add(flashcard);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllFlashcards), new { id = flashcard.Id }, flashcard);
        }

        // New endpoint for generating flashcards using AI
        [HttpPost("generate")]
        public async Task<ActionResult<IEnumerable<object>>> GenerateFlashcards([FromBody] FlashcardGenerationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Topic))
            {
                return BadRequest(new { message = "Topic cannot be empty." });
            }

            try
            {
                // Enhanced prompt for the LLM to generate subject-specific flashcards
                string prompt = $@"Generate 5 educational flashcards specifically about {request.Topic}.
Each flashcard should contain accurate, subject-specific information about {request.Topic} only.
Don't mix in other subjects or topics.
Format your response as a JSON array of objects with 'question' and 'answer' properties.
The flashcards should test knowledge that would be covered in a typical class about {request.Topic}.
Use precise terminology appropriate for the subject.

Example response format:
[
  {{
    ""question"": ""First question about {request.Topic}?"",
    ""answer"": ""The answer to first question""
  }},
  ...
]";

                // Get response from AI service
                string aiResponse = await _aiService.GetChatResponse(prompt, new List<ChatMessage>());

                Console.WriteLine($"AI Response: {aiResponse}"); // Debug logging

                // Parse the AI response as JSON
                try
                {
                    // Try to extract the JSON part from the response
                    string jsonContent = aiResponse;

                    // Sometimes the AI might include markdown code blocks or other text
                    if (aiResponse.Contains("```json"))
                    {
                        int startIndex = aiResponse.IndexOf("```json") + 7;
                        int endIndex = aiResponse.IndexOf("```", startIndex);
                        if (endIndex > startIndex)
                        {
                            jsonContent = aiResponse.Substring(startIndex, endIndex - startIndex);
                        }
                    }
                    else if (aiResponse.Contains("```"))
                    {
                        int startIndex = aiResponse.IndexOf("```") + 3;
                        int endIndex = aiResponse.IndexOf("```", startIndex);
                        if (endIndex > startIndex)
                        {
                            jsonContent = aiResponse.Substring(startIndex, endIndex - startIndex);
                        }
                    }

                    jsonContent = jsonContent.Trim();
                    Console.WriteLine($"Extracted JSON: {jsonContent}"); // Debug logging

                    // If parsing fails, use the mock response directly
                    if (string.IsNullOrWhiteSpace(jsonContent) || !jsonContent.StartsWith("["))
                    {
                        // Subject-specific fallback flashcards
                        var fallbackFlashcards = GetFallbackFlashcards(request.Topic);
                        return Ok(fallbackFlashcards);
                    }

                    // Parse the JSON content
                    var flashcards = JsonSerializer.Deserialize<List<object>>(jsonContent);
                    return Ok(flashcards);
                }
                catch (JsonException ex)
                {
                    Console.Error.WriteLine($"JSON parsing error: {ex.Message}");

                    // Return subject-specific fallback flashcards
                    var fallbackFlashcards = GetFallbackFlashcards(request.Topic);
                    return Ok(fallbackFlashcards);
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error generating flashcards: {ex.Message}");
                return StatusCode(500, new { message = $"Error generating flashcards: {ex.Message}" });
            }
        }

        // Helper method to provide subject-specific fallback flashcards
        private List<object> GetFallbackFlashcards(string topic)
        {
            topic = topic.ToLower().Trim();

            // World War 2 / WW2 flashcards
            if (topic.Contains("world war 2") || topic.Contains("worldwar2") || topic.Contains("ww2") || topic.Contains("world war ii"))
            {
                return new List<object>
                {
                    new { question = "In what year did World War 2 begin?", answer = "1939" },
                    new { question = "Who was the leader of Nazi Germany during World War 2?", answer = "Adolf Hitler" },
                    new { question = "What event marked the beginning of World War 2 in Europe?", answer = "Germany's invasion of Poland" },
                    new { question = "What was the code name for the Allied invasion of Normandy?", answer = "Operation Overlord (D-Day)" },
                    new { question = "In what year did World War 2 end?", answer = "1945" }
                };
            }
            // Biology flashcards
            else if (topic.Contains("biology") || topic.Contains("bio") || topic.Contains("life science"))
            {
                return new List<object>
                {
                    new { question = "What is the powerhouse of the cell?", answer = "Mitochondria" },
                    new { question = "What is the process by which plants make their food using sunlight?", answer = "Photosynthesis" },
                    new { question = "What is the basic unit of life?", answer = "Cell" },
                    new { question = "What is the genetic material in cells?", answer = "DNA (Deoxyribonucleic acid)" },
                    new { question = "What is the process of cell division called?", answer = "Mitosis" }
                };
            }
            // Chemistry flashcards
            else if (topic.Contains("chemistry") || topic.Contains("chem"))
            {
                return new List<object>
                {
                    new { question = "What is the chemical symbol for gold?", answer = "Au" },
                    new { question = "What is the formula for water?", answer = "H2O" },
                    new { question = "What is the pH of a neutral solution?", answer = "7" },
                    new { question = "What type of bond forms when electrons are shared between atoms?", answer = "Covalent bond" },
                    new { question = "What is the process of separating mixtures based on differences in boiling points?", answer = "Distillation" }
                };
            }
            // History flashcards (general)
            else if (topic.Contains("history"))
            {
                return new List<object>
                {
                    new { question = "In what year did World War II end?", answer = "1945" },
                    new { question = "Who was the first President of the United States?", answer = "George Washington" },
                    new { question = "What ancient civilization built the pyramids at Giza?", answer = "Ancient Egyptians" },
                    new { question = "What was the name of the period of artistic and cultural change in Europe from the 14th to 17th centuries?", answer = "The Renaissance" },
                    new { question = "Who wrote the Declaration of Independence?", answer = "Thomas Jefferson" }
                };
            }
            // General knowledge (default)
            else
            {
                return new List<object>
                {
                    new { question = $"What is {topic}?", answer = $"{topic} is a field of study or concept that encompasses various aspects and principles." },
                    new { question = $"Who is an important figure in {topic}?", answer = $"There are several key figures in {topic}, each contributing to the field in different ways." },
                    new { question = $"What is a fundamental principle of {topic}?", answer = $"One of the fundamental principles of {topic} involves understanding its core concepts and applications." },
                    new { question = $"How is {topic} applied in real life?", answer = $"{topic} has numerous practical applications in everyday scenarios and professional settings." },
                    new { question = $"What is a common misconception about {topic}?", answer = $"A common misconception about {topic} is that it is too complex or not relevant to daily life." }
                };
            }
        }

        // GET: api/Flashcard/exam/{examId}
        [HttpGet("exam/{examId}")]
        public async Task<ActionResult<IEnumerable<Flashcard>>> GetByExamId(int examId)
        {
            // Verify exam exists
            var examExists = await _context.Exams.AnyAsync(e => e.Id == examId);
            if (!examExists)
            {
                return NotFound($"Exam with ID {examId} not found.");
            }

            var flashcards = await _context.Flashcards
                .Where(f => f.ExamId == examId)
                .Include(f => f.Class)
                .ToListAsync();

            return Ok(flashcards);
        }

        // GET: api/flashcards/count?classCode=ABC12345
        [HttpGet("count")]
        public async Task<IActionResult> GetFlashcardsCount([FromQuery] string classCode)
        {
            if (string.IsNullOrWhiteSpace(classCode))
            {
                return BadRequest("Parameter 'classCode' is required.");
            }

            // Get class code ID
            var classCodeEntity = await _context.ClassCodes
                .FirstOrDefaultAsync(c => c.Code.ToLower() == classCode.ToLower());
            
            if (classCodeEntity == null)
            {
                return NotFound($"Class code not found: {classCode}");
            }

            // Count flashcards for this class
            var count = await _context.Flashcards
                .Where(f => f.ClassCodeId == classCodeEntity.Id)
                .CountAsync();

            return Ok(new { count });
        }

        // GET: api/flashcards/examcount/{examId}
        [HttpGet("examcount/{examId}")]
        public async Task<IActionResult> GetFlashcardsCountByExam(int examId)
        {
            // Verify exam exists
            var examExists = await _context.Exams.AnyAsync(e => e.Id == examId);
            if (!examExists)
            {
                return NotFound($"Exam with ID {examId} not found.");
            }

            // Count flashcards for this exam
            var count = await _context.Flashcards
                .Where(f => f.ExamId == examId)
                .CountAsync();

            return Ok(new { count });
        }
    }

    public class FlashcardGenerationRequest
    {
        public string Topic { get; set; }
    }
}