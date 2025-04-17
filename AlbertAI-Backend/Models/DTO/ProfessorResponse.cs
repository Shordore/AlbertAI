// Models/DTO/ProfessorResponse.cs
namespace AlbertAI.Models.DTO
{
    public class ProfessorResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        // If you track courses taught, you could add:
        // public List<string> Courses { get; set; }
    }
}
