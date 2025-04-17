using System.ComponentModel.DataAnnotations;

namespace AlbertAI.Models.DTO
{

    public class RegisterRequest

    {

        public string Email { get; set; }

        public string Password { get; set; }

        public string Name { get; set; }

        [Required]
        public string classCode { get; set; }


    }
}