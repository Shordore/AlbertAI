namespace AlbertAI.Models
{
    public class UserClass
    {
        public int Id { get; set; }
        public string ClassName { get; set; }

        // Foreign key linking to User
        public int UserId { get; set; }
        public User User { get; set; }
    }
}