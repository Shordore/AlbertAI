using AlbertAI.Models;

namespace AlbertAI.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public int ClassId { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        
        // Navigation property for the related class
        public ClassCode Class { get; set; }
    }
} 