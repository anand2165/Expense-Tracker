using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseTracker.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedcategoryName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Incomes_IncomeCategories_CategotyId",
                table: "Incomes");

            migrationBuilder.RenameColumn(
                name: "CategotyId",
                table: "Incomes",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Incomes_CategotyId",
                table: "Incomes",
                newName: "IX_Incomes_CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Incomes_IncomeCategories_CategoryId",
                table: "Incomes",
                column: "CategoryId",
                principalTable: "IncomeCategories",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Incomes_IncomeCategories_CategoryId",
                table: "Incomes");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Incomes",
                newName: "CategotyId");

            migrationBuilder.RenameIndex(
                name: "IX_Incomes_CategoryId",
                table: "Incomes",
                newName: "IX_Incomes_CategotyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Incomes_IncomeCategories_CategotyId",
                table: "Incomes",
                column: "CategotyId",
                principalTable: "IncomeCategories",
                principalColumn: "Id");
        }
    }
}
