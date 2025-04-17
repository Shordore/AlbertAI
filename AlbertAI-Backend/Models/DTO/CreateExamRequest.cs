using System.ComponentModel.DataAnnotations;

namespace AlbertAI.Models.DTO
{
    public class CreateExamRequest
    {
        [Required]
        public int ClassId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public DateTime Date { get; set; }
    }
} 