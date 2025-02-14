using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AlbertAI.Models.DTO
{
    public class UserProfileResponse
    {

        public int Id { get; set; }
        public string UFID { get; set; }
        public string Name { get; set; }

        public List<string> Classes { get; set; } = new List<string>();

    }
}
