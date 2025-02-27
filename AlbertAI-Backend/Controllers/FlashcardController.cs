using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AlbertAI.Models;
using AlbertAI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlashcardController : ControllerBase
    {
        private readonly AppDbContext _context;  // Note: Changed from ApplicationDbContext to AppDbContext

        public FlashcardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flashcard>>> GetFlashcards()
        {
            return await _context.Flashcards.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Flashcard>> GetFlashcard(int id)
        {
            var flashcard = await _context.Flashcards.FindAsync(id);
            if (flashcard == null)
                return NotFound();
            return flashcard;
        }

        [HttpPost]
        public async Task<ActionResult<Flashcard>> CreateFlashcard(Flashcard flashcard)
        {
            flashcard.CreatedAt = DateTime.UtcNow;
            flashcard.TimesReviewed = 0;
            flashcard.SuccessRate = 0;
            _context.Flashcards.Add(flashcard);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFlashcard), new { id = flashcard.Id }, flashcard);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlashcard(int id, Flashcard flashcard)
        {
            if (id != flashcard.Id)
                return BadRequest();

            _context.Entry(flashcard).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlashcard(int id)
        {
            var flashcard = await _context.Flashcards.FindAsync(id);
            if (flashcard == null)
                return NotFound();

            _context.Flashcards.Remove(flashcard);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("random")]
        public async Task<ActionResult<Flashcard>> GetRandomFlashcard()
        {
            var count = await _context.Flashcards.CountAsync();
            if (count == 0)
                return NotFound("No flashcards available");
                
            var random = new Random();
            var skipCount = random.Next(0, count);
            
            return await _context.Flashcards
                .Skip(skipCount)
                .FirstOrDefaultAsync();
        }

        [HttpPost("{id}/review")]
        public async Task<IActionResult> ReviewFlashcard(int id, [FromBody] bool wasCorrect)
        {
            var flashcard = await _context.Flashcards.FindAsync(id);
            if (flashcard == null)
                return NotFound();

            flashcard.LastReviewed = DateTime.UtcNow;
            flashcard.TimesReviewed++;
            flashcard.SuccessRate = ((flashcard.SuccessRate * (flashcard.TimesReviewed - 1)) + (wasCorrect ? 1 : 0)) / flashcard.TimesReviewed;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}


// NOTE: This is an in-memory version of the FlashcardController, used for testing.
//      Swap this out with the EF Core version once the database is ready.

// using System;
// using System.Collections.Generic;
// using System.Linq;
// using Microsoft.AspNetCore.Mvc;
// using AlbertAI.Models;


// namespace AlbertAI.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class FlashcardController : ControllerBase
//     {
//         // In-memory storage
//         private static readonly List<Flashcard> _flashcards = new List<Flashcard>();
//         private static int _nextId = 1;


//         [HttpGet]
//         public ActionResult<IEnumerable<Flashcard>> GetFlashcards()
//         {
//             return Ok(_flashcards);
//         }


//         [HttpGet("{id}")]
//         public ActionResult<Flashcard> GetFlashcard(int id)
//         {
//             var flashcard = _flashcards.FirstOrDefault(f => f.Id == id);
//             if (flashcard == null)
//                 return NotFound();
//             return flashcard;
//         }


//         [HttpPost]
//         public ActionResult<Flashcard> CreateFlashcard(Flashcard flashcard)
//         {
//             flashcard.Id = _nextId++;
//             _flashcards.Add(flashcard);
//             return CreatedAtAction(nameof(GetFlashcard), new { id = flashcard.Id }, flashcard);
//         }


//         [HttpGet("random")]
//         public ActionResult<Flashcard> GetRandomFlashcard()
//         {
//             if (!_flashcards.Any())
//                 return NotFound("No flashcards available");
               
//             var random = new Random();
//             var index = random.Next(0, _flashcards.Count);
//             return _flashcards[index];
//         }


//         [HttpDelete("{id}")]
//         public ActionResult DeleteFlashcard(int id)
//         {
//             var flashcard = _flashcards.FirstOrDefault(f => f.Id == id);
//             if (flashcard == null)
//                 return NotFound();


//             _flashcards.Remove(flashcard);
//             return NoContent();
//         }
//     }
// }



