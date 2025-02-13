namespace AlbertAI.Models
{
    public class ClassCode
    {
        public int Id { get; set; }  // Primary Key
        public string Code { get; set; }  // 8-character alphanumeric course code
        public string ClassName { get; set; }  // Associated class name
    }
}