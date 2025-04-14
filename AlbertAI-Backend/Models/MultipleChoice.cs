using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AlbertAI.Models;


namespace albertai.models
{
    public class MultipleChoice
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Question { get; set; }

        [Required]
        public List<string> Choices { get; set; }

        [Required]
        public string Answer { get; set; }

        public string Category { get; set; }

        [Required]
        public int ClassCodeId { get; set; }



    }
}
