using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlbertAI.Models
{
    public class Flashcard
    {
        [Key]
        public int Id { get; set; } // Unique identifier

        [Required]
        public string Question { get; set; } // Flashcard question

        [Required]
        public string Answer { get; set; } // Flashcard answer

        public string Category { get; set; } // Optional category

        [Required]
        public int ClassCodeId { get; set; } // Foreign key to ClassCode

        [ForeignKey("ClassCodeId")]
        public ClassCode ClassCode { get; set; }
    }
}