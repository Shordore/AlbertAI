using System.Threading.Tasks;
using AlbertAI.Data;              // For AppDbContext
using AlbertAI.Models;            // For your ClassCode model
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlbertAI.Models.DTO;

namespace AlbertAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClassesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/classes
        [HttpPost]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Code) || string.IsNullOrWhiteSpace(request.ClassName))
            {
                return BadRequest("Code and ClassName are required.");
            }

            // Check if professor exists
            var professor = await _context.Professors.FindAsync(request.ProfessorId);
            if (professor == null)
            {
                return BadRequest("Invalid ProfessorId. Professor not found.");
            }

            // Check if class code already exists
            var existingClass = await _context.ClassCodes
                .FirstOrDefaultAsync(c => c.Code.ToLower() == request.Code.ToLower());
            if (existingClass != null)
            {
                return BadRequest("A class with this code already exists.");
            }

            // Create new class
            var newClass = new ClassCode
            {
                Code = request.Code,
                ClassName = request.ClassName,
                ProfessorId = request.ProfessorId
            };

            _context.ClassCodes.Add(newClass);
            await _context.SaveChangesAsync();

            // Return the ID of the newly created class
            return Ok(new { id = newClass.Id });
        }

        // GET: api/classes/name?classCode=ABC12345
        [HttpGet("name")]
        public async Task<IActionResult> GetClassName([FromQuery] string classCode)
        {
            if (string.IsNullOrWhiteSpace(classCode))
            {
                return BadRequest("Parameter 'classCode' is required.");
            }

            var classEntity = await _context.ClassCodes
                .FirstOrDefaultAsync(c => c.Code.ToLower() == classCode.ToLower());

            if (classEntity == null)
            {
                return NotFound($"No class found with code: {classCode}");
            }

            return Ok(new { className = classEntity.ClassName });
        }

        // GET: api/classes/code?className=Computer%20Science%20101
        [HttpGet("code")]
        public async Task<IActionResult> GetClassCode([FromQuery] string className)
        {
            if (string.IsNullOrWhiteSpace(className))
            {
                return BadRequest("Parameter 'className' is required.");
            }

            // Use a case-insensitive search to find the class by name.
            var classCodeEntity = await _context.ClassCodes
                .FirstOrDefaultAsync(c => c.ClassName.ToLower() == className.ToLower());

            if (classCodeEntity == null)
            {
                return NotFound($"No class found with name: {className}");
            }

            // Return the classCodeId in a JSON response.
            return Ok(new { classCodeId = classCodeEntity.Code });
        }
    }
}