// Controllers/AccountController.cs

using System.Security.Claims;
using AlbertAI.Data;
using AlbertAI.Models.DTO;
using AlbertAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly Authenticator _authenticator;
        private readonly AppDbContext _context;

        // Constructor injecting Authenticator and AppDbContext services
        public AccountController(Authenticator authenticator, AppDbContext context)
        {
            _authenticator = authenticator;
            _context = context;
        }

        // POST: api/Account/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check if the incoming request model is valid
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Attempt to register the user using the Authenticator service
            var result = await _authenticator.RegisterAsync(request.UFID, request.Password, request.Name);
            if (!result)
                return BadRequest(new { message = "UFID already exists. Please choose a different UFID." });

            // Return a success message upon successful registration
            return Ok(new { message = "User registered successfully." });
        }

        // POST: api/Account/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Validate the incoming request model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Attempt to authenticate the user and retrieve a token
            var token = await _authenticator.AuthenticateAsync(request.UFID, request.Password);
            if (token == null)
                return Unauthorized(new { message = "Invalid UFID or password." });

            // Return the authentication token upon successful login
            return Ok(new { Token = token });
        }

        // GET: api/Account/me
        [HttpGet("me")]
        public async Task<ActionResult<UserResponse>> GetCurrentUser()
        {
            // Extract the UFID of the authenticated user from the claims
            var ufid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ufid == null)
                return Unauthorized(new { message = "User not authenticated." });


            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UFID == ufid);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Map the user entity to a UserResponse DTO
            var response = new UserResponse
            {
                Id = user.Id,
                UFID = user.UFID,
                Name = user.Name,

            };

            // Return the user profile information
            return Ok(response);
        }

        // PUT: api/Account/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            // Validate the incoming request model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Extract the UFID of the authenticated user from the claims
            var ufid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ufid == null)
                return Unauthorized(new { message = "User not authenticated." });


            var user = await _context.Users

                .FirstOrDefaultAsync(u => u.UFID == ufid);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Update user properties with the new values from the request
            user.Name = request.Name;

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return a NoContent response to indicate successful update
            return NoContent();
        }
    }
}
