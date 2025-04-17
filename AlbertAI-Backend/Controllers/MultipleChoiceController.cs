using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using albertai.models;
using AlbertAI.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MultipleChoice>>> GetAllQuestions()
        {
            return await _context.MultipleChoices.ToListAsync();
        }

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

        [HttpGet("bycode")]
        public async Task<IActionResult> GetQuestionsByClassCode([FromQuery] string classCode)
        {
            if (string.IsNullOrWhiteSpace(classCode))
            {
                return BadRequest("Parameter 'classCode' is required.");
            }

            var questions = await _context.MultipleChoices
                .Join(_context.ClassCodes,
                      mc => mc.ClassCodeId,
                      cc => cc.Id,
                      (mc, cc) => new { MultipleChoice = mc, ClassCode = cc })
                .Where(x => x.ClassCode.Code.ToLower() == classCode.ToLower())
                .Select(x => x.MultipleChoice)
                .ToListAsync();

            if (!questions.Any())
            {
                return NotFound(new { message = "No questions found for this class code." });
            }

            return Ok(questions);
        }

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

        [HttpGet("exam/{examId}")]
        public async Task<ActionResult<IEnumerable<MultipleChoice>>> GetByExamId(int examId)
        {
            var examExists = await _context.Exams.AnyAsync(e => e.Id == examId);
            if (!examExists)
            {
                return NotFound($"Exam with ID {examId} not found.");
            }

            var questions = await _context.MultipleChoices
                .Where(q => q.ExamId == examId)
                .Include(q => q.Class)
                .ToListAsync();

            return Ok(questions);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetMultipleChoiceCount([FromQuery] string classCode)
        {
            if (string.IsNullOrWhiteSpace(classCode))
            {
                return BadRequest("Parameter 'classCode' is required.");
            }

            var classCodeEntity = await _context.ClassCodes
                .FirstOrDefaultAsync(c => c.Code.ToLower() == classCode.ToLower());
            
            if (classCodeEntity == null)
            {
                return NotFound($"Class code not found: {classCode}");
            }

            var count = await _context.MultipleChoices
                .Where(mc => mc.ClassCodeId == classCodeEntity.Id)
                .CountAsync();

            return Ok(new { count });
        }

        [HttpGet("examcount/{examId}")]
        public async Task<IActionResult> GetMultipleChoiceCountByExam(int examId)
        {
            var examExists = await _context.Exams.AnyAsync(e => e.Id == examId);
            if (!examExists)
            {
                return NotFound($"Exam with ID {examId} not found.");
            }

            var count = await _context.MultipleChoices
                .Where(mc => mc.ExamId == examId)
                .CountAsync();

            return Ok(new { count });
        }
    }
}