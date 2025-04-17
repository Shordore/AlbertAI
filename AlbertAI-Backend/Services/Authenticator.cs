using AlbertAI.Data;
using AlbertAI.Models;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AlbertAI.Services
{
    public class Authenticator
    {
        private readonly AppDbContext _context;

        // Inject the database context via constructor
        public Authenticator(AppDbContext context)
        {
            _context = context;
        }

        // Register a new user and save to the database
        public async Task<bool> RegisterAsync(string email, string password, string name)
        {
            // Check if the Email already exists in the database
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                return false; // Email already exists
            }

            // Hash the password
            var hashedPassword = HashPassword(password);

            // Create a new user object
            var newUser = new User
            {
                Email = email,
                PasswordHash = hashedPassword,
                Name = name,
            };

            // Add the user to the database context and save changes
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return true;
        }


        // Hash password using SHA256 (same as before)
        public string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(bytes).Replace("-", "").ToLower();
            }
        }
        public async Task<string> AuthenticateAsync(string Email, string password)
        {
            // Check if the Email exists in the database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == Email);

            // If user is not found or password doesn't match, return null
            if (user == null || !VerifyPassword(password, user.PasswordHash))
                return null;

            // Generate JWT token after successful authentication
            return GenerateToken(Email);
        }

        // Authenticate a professor by email and password
        public async Task<string> AuthenticateProfessorAsync(string email, string password)
        {
            var prof = await _context.Professors
                            .FirstOrDefaultAsync(p => p.Email == email);
            if (prof == null || !VerifyPassword(password, prof.PasswordHash))
                return null;
            return GenerateToken(email);
        }

        private string GenerateToken(string Email)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("ySvy7VglFD8SKLg1wgH28e9CcoQbyH6nDHdCK6JrCgs=");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, Email) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Verify if the password matches the stored password hash
        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }

    }
}