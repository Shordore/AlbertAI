using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlbertAI.Models
{
        public class TrueFalse
        {

                [Key]
                public int Id { get; set; }

                [Required]
                public string Question { get; set; }

                [Required]
                public bool IsTrue { get; set; }
                public int TimesReviewed { get; set; }
                public double SuccessRate { get; set; }
                [Required]
                public int ClassCodeId { get; set; } // Foreign key to ClassCode

        }
}