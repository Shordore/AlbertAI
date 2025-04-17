using System.Threading.Tasks;
using AlbertAI.Data;
using AlbertAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlbertAI.Models.DTO;
using AlbertAI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AlbertAI.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class ProfessorController : ControllerBase
    {
        private readonly Authenticator _authenticator;
        private readonly AppDbContext _context;

        public ProfessorController(Authenticator authenticator, AppDbContext context)
        {
            _authenticator = authenticator;
            _context = context;
        }

        // POST: api/professor/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterProfessorRequest dto)
        {
            if (await _context.Professors.AnyAsync(p => p.Email == dto.Email))
                return BadRequest("Email is already in use.");

            var passwordHash = _authenticator.HashPassword(dto.Password);

            var prof = new Professor
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = passwordHash
            };

            _context.Professors.Add(prof);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Professor registered." });
        }

        // POST: api/professor/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginProfessorRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Use the professor-specific authentication
            var token = await _authenticator.AuthenticateProfessorAsync(dto.Email, dto.Password);
            if (token == null)
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(new { Token = token });
        }

        // GET: api/professor/me
        [HttpGet("me"), Authorize]
        public async Task<ActionResult<ProfessorResponse>> GetCurrentProfessor()
        {
            // Extract the Email claim of the authenticated professor
            var email = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(email))
                return Unauthorized(new { message = "User not authenticated." });

            // Query the Professors table by email
            var prof = await _context.Professors
                .FirstOrDefaultAsync(p => p.Email == email);

            if (prof == null)
                return NotFound(new { message = "Professor not found." });

            // Build the response DTO
            var response = new ProfessorResponse
            {
                Id = prof.Id,
                Name = prof.Name,
                Email = prof.Email
            };

            return Ok(response);
        }

        // PUT: api/professor/me
        [HttpPut("me"), Authorize]
        public async Task<ActionResult<ProfessorResponse>> UpdateCurrentProfessor([FromBody] UpdateProfessorRequest dto)
        {
            var emailClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(emailClaim))
                return Unauthorized(new { message = "User not authenticated." });

            var prof = await _context.Professors
                .FirstOrDefaultAsync(p => p.Email == emailClaim);

            if (prof == null)
                return NotFound(new { message = "Professor not found." });

            if (!string.IsNullOrWhiteSpace(dto.Name))
                prof.Name = dto.Name;
            if (!string.IsNullOrWhiteSpace(dto.Email))
                prof.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.Password))
                prof.PasswordHash = _authenticator.HashPassword(dto.Password);

            await _context.SaveChangesAsync();

            var response = new ProfessorResponse
            {
                Id = prof.Id,
                Name = prof.Name,
                Email = prof.Email
            };

            return Ok(response);
        }
    }
}
