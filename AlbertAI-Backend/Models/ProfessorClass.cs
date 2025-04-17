using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AlbertAI.Models
{
    public class ProfessorClass
    {

        public int Id { get; set; }

        public string ClassName { get; set; }

        public int ProfessorId { get; set; } // Foreign key to Professor

        public Professor Professor { get; set; }

    }
}