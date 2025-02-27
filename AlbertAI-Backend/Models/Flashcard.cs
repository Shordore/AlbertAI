using System;
using System.ComponentModel.DataAnnotations;

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

        // New properties to add
        public DateTime CreatedAt { get; set; }
        public DateTime? LastReviewed { get; set; }
        public int TimesReviewed { get; set; }
        public double SuccessRate { get; set; }
    }
}