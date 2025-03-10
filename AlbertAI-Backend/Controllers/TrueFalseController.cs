using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using AlbertAI.Models;
using AlbertAI.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrueFalseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrueFalseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrueFalse>>> GetTrueFalseQuestions()
        {
            return await _context.TrueFalses.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TrueFalse>> GetTrueFalseQuestion(int id)
        {
            var question = await _context.TrueFalses.FindAsync(id);
            if (question == null)
                return NotFound();
            return question;
        }

        [HttpPost]
        public async Task<ActionResult<TrueFalse>> CreateTrueFalseQuestion(TrueFalse question)
        {
            _context.TrueFalses.Add(question);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTrueFalseQuestion), new { id = question.Id }, question);
        }

        [HttpGet("random")]
        public async Task<ActionResult<TrueFalse>> GetRandomQuestion()
        {
            var count = await _context.TrueFalses.CountAsync();
            if (count == 0)
                return NotFound("No questions available");
                
            var random = new Random();
            var index = random.Next(0, count);
            return await _context.TrueFalses
                .Skip(index)
                .FirstOrDefaultAsync();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrueFalseQuestion(int id)
        {
            var question = await _context.TrueFalses.FindAsync(id);
            if (question == null)
                return NotFound();

            _context.TrueFalses.Remove(question);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/review")]
        public async Task<IActionResult> ReviewTrueFalseQuestion(int id, [FromBody] bool wasCorrect)
        {
            var question = await _context.TrueFalses.FindAsync(id);
            if (question == null)
                return NotFound();

            // Add review logic here

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
    */

//     // Uncomment the in-memory version
//     [ApiController]
//     [Route("api/[controller]")]
//     public class TrueFalseController : ControllerBase
//     {
//         // In-memory storage
//         private static readonly List<TrueFalse> _questions = new List<TrueFalse>();
//         private static int _nextId = 1;

//         [HttpGet]
//         public ActionResult<IEnumerable<TrueFalse>> GetQuestions()
//         {
//             return Ok(_questions);
//         }

//         [HttpGet("{id}")]
//         public ActionResult<TrueFalse> GetQuestion(int id)
//         {
//             var question = _questions.FirstOrDefault(q => q.Id == id);
//             if (question == null)
//                 return NotFound();
//             return question;
//         }

//         [HttpPost]
//         public ActionResult<TrueFalse> CreateQuestion(TrueFalse question)
//         {
//             question.Id = _nextId++;
//             _questions.Add(question);
//             return CreatedAtAction(nameof(GetQuestion), new { id = question.Id }, question);
//         }

//         [HttpGet("random")]
//         public ActionResult<TrueFalse> GetRandomQuestion()
//         {
//             if (_questions.Count == 0)
//                 return NotFound("No questions available");
                
//             var random = new Random();
//             var index = random.Next(0, _questions.Count);
//             return Ok(_questions[index]);
//         }

//         [HttpDelete("{id}")]
//         public ActionResult DeleteQuestion(int id)
//         {
//             var question = _questions.FirstOrDefault(q => q.Id == id);
//             if (question == null)
//                 return NotFound();

//             _questions.Remove(question);
//             return NoContent();
//         }

//         [HttpPost("{id}/review")]
//         public ActionResult ReviewQuestion(int id, [FromBody] bool wasCorrect)
//         {
//             var question = _questions.FirstOrDefault(q => q.Id == id);
//             if (question == null)
//                 return NotFound();

//             // Add review logic here

//             return NoContent();
//         }
//     }
// }





