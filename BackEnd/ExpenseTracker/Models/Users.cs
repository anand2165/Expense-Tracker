using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace ExpenseTracker.Models
{
    public class Users
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        [ValidateNever]
        public ICollection<ExpenseCategories> ExpenseCategory { get; set; }
        [ValidateNever]
        public ICollection<Expenses> Expense  { get; set; }
        [ValidateNever]
        public ICollection<IncomeCategories> IncomeCategory { get; set; }
        [ValidateNever]
        public ICollection<Incomes> Income { get; set; }
    }
}
