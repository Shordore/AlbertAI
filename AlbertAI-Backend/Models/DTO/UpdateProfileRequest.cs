using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AlbertAI.Models.DTO
{
    public class UpdateProfileRequest
    {
        [Required]
        public string Name { get; set; }

    }
}
