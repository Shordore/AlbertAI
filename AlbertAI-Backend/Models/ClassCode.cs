using System.ComponentModel.DataAnnotations.Schema;

namespace AlbertAI.Models
{
    public class ClassCode
    {
        public int Id { get; set; }  // Primary Key
        public string Code { get; set; }  // 8-character alphanumeric course code
        public string ClassName { get; set; }  // Associated class name
        
        // Foreign key to Professor
        public int ProfessorId { get; set; }
        
        // Navigation property
        [ForeignKey("ProfessorId")]
        public Professor Professor { get; set; }
    }
}