using System.Threading.Tasks;
using AlbertAI.Data;
using AlbertAI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AlbertAI.Models.DTO;
using AlbertAI.Services;
using Microsoft.AspNetCore.Authorization;

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
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            // extract professorId from JWT claims
            var profId = int.Parse(User.FindFirst("id").Value);
            var prof = await _context.Professors.FindAsync(profId);
            if (prof == null) return NotFound();

            return Ok(new
            {
                id = prof.Id,
                name = prof.Name,
                email = prof.Email
                // any other fields
            });
        }

        // PUT: api/professor/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfessorRequest dto)
        {
            var profId = int.Parse(User.FindFirst("id").Value);
            var prof = await _context.Professors.FindAsync(profId);
            if (prof == null) return NotFound();

            prof.Name = dto.Name ?? prof.Name;
            // etc…
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}