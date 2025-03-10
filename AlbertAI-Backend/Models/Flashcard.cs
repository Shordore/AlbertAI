using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using albertai.models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlbertAI.Data;
using AlbertAI.Models;
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

        public int ClassCodeId { get; set; } // Foreign key to ClassCode

        [ForeignKey("ClassCodeId")]
        public ClassCode ClassCode { get; set; }
    }
}