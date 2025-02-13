using System.ComponentModel.DataAnnotations;

namespace AlbertAI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string UFID { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Name { get; set; }

        public ICollection<UserClass> UserClasses { get; set; } = new List<UserClass>();

    }

}