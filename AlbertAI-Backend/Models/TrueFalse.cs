using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlbertAI.Models
{
    public class TrueFalse
    {
        [Key]
        public int Id { get; set; } // Unique identifier

        [Required]
        public string Question { get; set; } // Flashcard question

        [Required]
        public bool Answer { get; set; }  // true or false

        public string Category { get; set; } // Optional category

<<<<<<< HEAD:AlbertAI-Backend/Models/TrueFalse.cs
        // New properties to add
        public DateTime CreatedAt { get; set; }
        public DateTime? LastReviewed { get; set; }
        public int TimesReviewed { get; set; }
        public double SuccessRate { get; set; }
=======
        [Required]
        public int ClassCodeId { get; set; } // Foreign key to ClassCode

        [ForeignKey("ClassCodeId")]
        public ClassCode ClassCode { get; set; }
>>>>>>> a2b5bf284b9bf67497a4ce8ad3ff680a9f8b7ac4:AlbertAI-Backend/Models/Flashcard.cs
    }
}