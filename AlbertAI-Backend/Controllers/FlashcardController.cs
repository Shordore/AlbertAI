using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using albertai.models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlbertAI.Data;
using AlbertAI.Models;

namespace AlbertAI.Controllers
{
    [Route("api/flashcards")]
    [ApiController]
    public class FlashcardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FlashcardController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: Retrieve all flashcards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flashcard>>> GetAllFlashcards()
        {
            return await _context.Flashcards.ToListAsync();
        }

        // ✅ GET: Retrieve flashcards by ClassCodeId
        [HttpGet("class/{classCodeId}")]
        public async Task<ActionResult<IEnumerable<Flashcard>>> GetFlashcardsByClass(int classCodeId)
        {
            var flashcards = await _context.Flashcards
                .Where(f => f.ClassCodeId == classCodeId)
                .ToListAsync();

            if (!flashcards.Any())
            {
                return NotFound(new { message = "No flashcards found for this class." });
            }

            return Ok(flashcards);
        }

        // ✅ POST: Add a new flashcard
        [HttpPost]
        public async Task<ActionResult<Flashcard>> CreateFlashcard([FromBody] Flashcard flashcard)
        {
            if (!_context.ClassCodes.Any(c => c.Id == flashcard.ClassCodeId))
            {
                return BadRequest(new { message = "Invalid ClassCodeId. Class does not exist." });
            }

            _context.Flashcards.Add(flashcard);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllFlashcards), new { id = flashcard.Id }, flashcard);
        }
    }
}