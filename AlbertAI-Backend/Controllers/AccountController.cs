// Controllers/AccountController.cs

using System.Security.Claims;
using AlbertAI.Data;
using AlbertAI.Models;
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


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Validate request
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Ensure a class code is provided
            if (string.IsNullOrWhiteSpace(request.classCode))
                return BadRequest(new { message = "A valid course code is required to register." });

            // Check if the class code exists in the database
            var classEntry = await _context.ClassCodes.FirstOrDefaultAsync(c => c.Code == request.classCode);
            if (classEntry == null)
                return BadRequest(new { message = "Invalid course code. Please enter a valid code to register." });

            // Check if the UFID already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UFID == request.UFID);
            if (existingUser != null)
                return BadRequest(new { message = "UFID already exists. Please choose a different UFID." });

            // Hash the password
            var passwordHash = _authenticator.HashPassword(request.Password);

            // Create new user
            var newUser = new User
            {
                UFID = request.UFID,
                PasswordHash = passwordHash,
                Name = request.Name,
                UserClasses = new List<UserClass>() // Initialize user class list
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync(); // Save user first to generate an ID

            // Ensure the user has an ID before adding classes
            var userFromDb = await _context.Users.FirstOrDefaultAsync(u => u.UFID == request.UFID);
            if (userFromDb == null)
                return BadRequest(new { message = "User registration failed unexpectedly." });

            // Add user to class
            var userClass = new UserClass
            {
                UserId = userFromDb.Id, // Ensure user ID is set
                ClassName = classEntry.ClassName
            };

            _context.UserClasses.Add(userClass);
            await _context.SaveChangesAsync(); // Ensure class association is saved

            return Ok(new { message = "User registered successfully and enrolled in " + classEntry.ClassName });
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


        [HttpGet("me")]
        public async Task<ActionResult<UserResponse>> GetCurrentUser()
        {
            // Extract the UFID of the authenticated user
            var ufid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ufid == null)
                return Unauthorized(new { message = "User not authenticated." });

            // Include UserClasses in the query
            var user = await _context.Users
                .Include(u => u.UserClasses) // Ensure classes are loaded
                .FirstOrDefaultAsync(u => u.UFID == ufid);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Convert UserClass list to class names
            var response = new UserResponse
            {
                Id = user.Id,
                UFID = user.UFID,
                Name = user.Name,
                Classes = user.UserClasses.Select(uc => uc.ClassName).ToList()
            };

            return Ok(response);
        }

        // PUT: api/Account/me
        // PUT: api/Account/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            // Validate the request model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Extract the UFID of the authenticated user
            var ufid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (ufid == null)
                return Unauthorized(new { message = "User not authenticated." });

            // Find the user in the database
            var user = await _context.Users
                .Include(u => u.UserClasses) // Include existing user classes
                .FirstOrDefaultAsync(u => u.UFID == ufid);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Update user properties with the new values from the request
            user.Name = request.Name;

            // Check if the user provided a course code
            if (!string.IsNullOrWhiteSpace(request.classCode))
            {
                // Look up the class associated with the course code
                var classEntry = await _context.ClassCodes.FirstOrDefaultAsync(c => c.Code == request.classCode);
                if (classEntry == null)
                {
                    return BadRequest(new { message = "Invalid course code." });
                }

                // Check if the user is already enrolled in this class
                if (user.UserClasses.Any(uc => uc.ClassName == classEntry.ClassName))
                {
                    return BadRequest(new { message = "You are already enrolled in this class." });
                }

                // Add the class to the user’s profile
                user.UserClasses.Add(new UserClass { ClassName = classEntry.ClassName, UserId = user.Id });
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return NoContent(); // Indicate success with no response body
        }
    }
}
