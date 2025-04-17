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
    }
} 