using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddExamIdToQuestions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExamId",
                table: "TrueFalses",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExamId",
                table: "MultipleChoices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExamId",
                table: "Flashcards",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrueFalses_ClassCodeId",
                table: "TrueFalses",
                column: "ClassCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_TrueFalses_ExamId",
                table: "TrueFalses",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_MultipleChoices_ClassCodeId",
                table: "MultipleChoices",
                column: "ClassCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_MultipleChoices_ExamId",
                table: "MultipleChoices",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_Flashcards_ClassCodeId",
                table: "Flashcards",
                column: "ClassCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_Flashcards_ExamId",
                table: "Flashcards",
                column: "ExamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Flashcards_ClassCodes_ClassCodeId",
                table: "Flashcards",
                column: "ClassCodeId",
                principalTable: "ClassCodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Flashcards_Exams_ExamId",
                table: "Flashcards",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MultipleChoices_ClassCodes_ClassCodeId",
                table: "MultipleChoices",
                column: "ClassCodeId",
                principalTable: "ClassCodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MultipleChoices_Exams_ExamId",
                table: "MultipleChoices",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrueFalses_ClassCodes_ClassCodeId",
                table: "TrueFalses",
                column: "ClassCodeId",
                principalTable: "ClassCodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrueFalses_Exams_ExamId",
                table: "TrueFalses",
                column: "ExamId",
                principalTable: "Exams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Flashcards_ClassCodes_ClassCodeId",
                table: "Flashcards");

            migrationBuilder.DropForeignKey(
                name: "FK_Flashcards_Exams_ExamId",
                table: "Flashcards");

            migrationBuilder.DropForeignKey(
                name: "FK_MultipleChoices_ClassCodes_ClassCodeId",
                table: "MultipleChoices");

            migrationBuilder.DropForeignKey(
                name: "FK_MultipleChoices_Exams_ExamId",
                table: "MultipleChoices");

            migrationBuilder.DropForeignKey(
                name: "FK_TrueFalses_ClassCodes_ClassCodeId",
                table: "TrueFalses");

            migrationBuilder.DropForeignKey(
                name: "FK_TrueFalses_Exams_ExamId",
                table: "TrueFalses");

            migrationBuilder.DropIndex(
                name: "IX_TrueFalses_ClassCodeId",
                table: "TrueFalses");

            migrationBuilder.DropIndex(
                name: "IX_TrueFalses_ExamId",
                table: "TrueFalses");

            migrationBuilder.DropIndex(
                name: "IX_MultipleChoices_ClassCodeId",
                table: "MultipleChoices");

            migrationBuilder.DropIndex(
                name: "IX_MultipleChoices_ExamId",
                table: "MultipleChoices");

            migrationBuilder.DropIndex(
                name: "IX_Flashcards_ClassCodeId",
                table: "Flashcards");

            migrationBuilder.DropIndex(
                name: "IX_Flashcards_ExamId",
                table: "Flashcards");

            migrationBuilder.DropColumn(
                name: "ExamId",
                table: "TrueFalses");

            migrationBuilder.DropColumn(
                name: "ExamId",
                table: "MultipleChoices");

            migrationBuilder.DropColumn(
                name: "ExamId",
                table: "Flashcards");
        }
    }
}
