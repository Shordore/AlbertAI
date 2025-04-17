using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlbertAI.Data;
using AlbertAI.Models;
using AlbertAI.Models.DTO;
using Microsoft.AspNetCore.Authorization;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExamController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Exam
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Exam>> CreateExam([FromBody] CreateExamRequest request)
        {
            // Verify that the class exists
            var classExists = await _context.ClassCodes.AnyAsync(c => c.Id == request.ClassId);
            if (!classExists)
            {
                return NotFound($"Class with ID {request.ClassId} not found.");
            }

            // Create new exam
            var exam = new Exam
            {
                ClassId = request.ClassId,
                Title = request.Title,
                Date = request.Date
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }

        // GET: api/Exam/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Exam>> GetExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Class)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }

        // GET: api/Exam/byclassname?className=Biology 101
        [HttpGet("byclassname")]
        public async Task<IActionResult> GetExamsByClassName([FromQuery] string className)
        {
            if (string.IsNullOrWhiteSpace(className))
            {
                return BadRequest("Parameter 'className' is required.");
            }

            // First, get the class code for the given class name
            var classCode = await _context.ClassCodes
                .FirstOrDefaultAsync(c => c.ClassName.ToLower() == className.ToLower());

            if (classCode == null)
            {
                return NotFound($"No class found with name: {className}");
            }

            // Then, get all exams for this class
            var exams = await _context.Exams
                .Where(e => e.ClassId == classCode.Id)
                .Select(e => new { e.Title, e.Id })
                .ToListAsync();

            if (!exams.Any())
            {
                return NotFound($"No exams found for class: {className}");
            }

            return Ok(exams);
        }
    }
} 