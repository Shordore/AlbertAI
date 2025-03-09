using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddClassCodeIdToFlashcards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClassCodeId",
                table: "Flashcards",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Flashcards_ClassCodeId",
                table: "Flashcards",
                column: "ClassCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flashcards_ClassCodes_ClassCodeId",
                table: "Flashcards",
                column: "ClassCodeId",
                principalTable: "ClassCodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flashcards_ClassCodes_ClassCodeId",
                table: "Flashcards");

            migrationBuilder.DropIndex(
                name: "IX_Flashcards_ClassCodeId",
                table: "Flashcards");

            migrationBuilder.DropColumn(
                name: "ClassCodeId",
                table: "Flashcards");
        }
    }
}
