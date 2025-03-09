using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using albertai.models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlbertAI.Data;

namespace AlbertAI.Controllers
{
    [Route("api/multiplechoice")]
    [ApiController]
    public class MultipleChoiceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MultipleChoiceController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Retrieve all multiple choice questions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MultipleChoice>>> GetAllQuestions()
        {
            return await _context.MultipleChoices.ToListAsync();
        }

        // ✅ GET: Retrieve multiple choice questions by ClassCodeId
        [HttpGet("class/{classCodeId}")]
        public async Task<ActionResult<IEnumerable<MultipleChoice>>> GetQuestionsByClass(int classCodeId)
        {
            var questions = await _context.MultipleChoices
                .Where(q => q.ClassCodeId == classCodeId)
                .ToListAsync();

            if (!questions.Any())
            {
                return NotFound(new { message = "No questions found for this class." });
            }

            return Ok(questions);
        }

        // ✅ POST: Add a new multiple choice question
        [HttpPost]
        public async Task<ActionResult<MultipleChoice>> CreateQuestion([FromBody] MultipleChoice question)
        {
            if (!_context.ClassCodes.Any(c => c.Id == question.ClassCodeId))
            {
                return BadRequest(new { message = "Invalid ClassCodeId. Class does not exist." });
            }

            _context.MultipleChoices.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllQuestions), new { id = question.Id }, question);
        }
    }
}