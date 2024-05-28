using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Models
{
    public class IncomeCategories
    {
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        public string CategoryName { get; set; }
        [ValidateNever]
        public Users User { get; set; }
        [ValidateNever]
        public ICollection<Incomes> Incomes { get; set; }    
    }
}
