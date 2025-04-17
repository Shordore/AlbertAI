using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddProfessorIdToClassCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProfessorId",
                table: "ClassCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ClassCodes_ProfessorId",
                table: "ClassCodes",
                column: "ProfessorId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassCodes_Professors_ProfessorId",
                table: "ClassCodes",
                column: "ProfessorId",
                principalTable: "Professors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassCodes_Professors_ProfessorId",
                table: "ClassCodes");

            migrationBuilder.DropIndex(
                name: "IX_ClassCodes_ProfessorId",
                table: "ClassCodes");

            migrationBuilder.DropColumn(
                name: "ProfessorId",
                table: "ClassCodes");
        }
    }
}
