using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Models
{
    public class Incomes
    {
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        public DateOnly Date { get; set; }
        public double Amount { get; set; }
        [ForeignKey("IncomeCategories")]
        public int CategoryId { get; set; }
        public string Description { get; set; }
        [ValidateNever]
        public Users User { get; set; }
        [ValidateNever]
        public IncomeCategories IncomeCategories { get; set; }    
    }
}
