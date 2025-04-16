using Microsoft.AspNetCore.Mvc;
using AlbertAI.Models;
using AlbertAI.Data;
using Microsoft.EntityFrameworkCore;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrueFalseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrueFalseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrueFalse>>> GetTrueFalseQuestions()
        {
            return await _context.TrueFalses.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TrueFalse>> GetTrueFalseQuestion(int id)
        {
            var question = await _context.TrueFalses.FindAsync(id);
            if (question == null)
                return NotFound();
            return question;
        }

        [HttpPost]
        public async Task<ActionResult<TrueFalse>> CreateTrueFalseQuestion(TrueFalse question)
        {
            _context.TrueFalses.Add(question);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTrueFalseQuestion), new { id = question.Id }, question);
        }

        [HttpGet("random")]
        public async Task<ActionResult<TrueFalse>> GetRandomQuestion()
        {
            var count = await _context.TrueFalses.CountAsync();
            if (count == 0)
                return NotFound("No questions available");

            var random = new Random();
            var index = random.Next(0, count);
            return await _context.TrueFalses
                .Skip(index)
                .FirstOrDefaultAsync();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrueFalseQuestion(int id)
        {
            var question = await _context.TrueFalses.FindAsync(id);
            if (question == null)
                return NotFound();

            _context.TrueFalses.Remove(question);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpGet("bycode")]
        public async Task<IActionResult> GetQuestionsByClassCode([FromQuery] string classCode)
        {
            if (string.IsNullOrWhiteSpace(classCode))
            {
                return BadRequest("Parameter 'classCode' is required.");
            }

            var questions = await _context.TrueFalses
                .Join(_context.ClassCodes,
                      tf => tf.ClassCodeId,
                      cc => cc.Id,
                      (tf, cc) => new { TrueFalse = tf, ClassCode = cc })
                .Where(x => x.ClassCode.Code.ToLower() == classCode.ToLower())
                .Select(x => x.TrueFalse)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound(new { message = "No questions found for this class code." });
            }

            return Ok(questions);
        }

        [HttpPost("{id}/review")]
        public async Task<IActionResult> ReviewTrueFalseQuestion(int id, [FromBody] bool wasCorrect)
        {
            var question = await _context.TrueFalses.FindAsync(id);
            if (question == null)
                return NotFound();

            // Add review logic here

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

