using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker.Models
{
    public class ExpenseCategories
    {
        public int Id { get; set; }
        [ForeignKey("Users")]
        public int UserId { get; set; }
        public string CategoryName { get; set; }
        [ValidateNever]
        public Users User { get; set; }
        [ValidateNever]
        public ICollection<Expenses> Expenses { get; set; }
    }
}
