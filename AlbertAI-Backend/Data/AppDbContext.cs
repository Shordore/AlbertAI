using albertai.models;
using AlbertAI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace AlbertAI.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        // DbSets for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<MultipleChoice> MultipleChoices { get; set; }
        public DbSet<Flashcard> Flashcards { get; set; }
        public DbSet<TrueFalse> TrueFalses { get; set; }
        public DbSet<UserClass> UserClasses { get; set; }
        public DbSet<Professor> Professors { get; set; }
        public DbSet<ClassCode> ClassCodes { get; set; }
        public DbSet<Exam> Exams { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Unique index on User.Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}