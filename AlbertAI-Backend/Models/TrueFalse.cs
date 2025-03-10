using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlbertAI.Models
{
        public class TrueFalse
        {

                [Key]
                public int Id { get; set; }
                public DateTime CreatedAt { get; set; }
                public DateTime? LastReviewed { get; set; }
                public int TimesReviewed { get; set; }
                public double SuccessRate { get; set; }
                [Required]
                public int ClassCodeId { get; set; } // Foreign key to ClassCode

                [ForeignKey("ClassCodeId")]
                public ClassCode ClassCode { get; set; }
        }
}