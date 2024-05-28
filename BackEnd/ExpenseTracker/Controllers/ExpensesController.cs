using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.Data;
using ExpenseTracker.Models;

namespace ExpenseTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public ExpensesController(ExpenseDbContext context)
        {
            _context = context;
        }

        // GET: api/Expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expenses>>> GetExpenses()
        {
            return await _context.Expenses.ToListAsync();
        }

        // GET: api/Expenses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Expenses>> GetExpenses(int id)
        {
            var expenses = await _context.Expenses.FindAsync(id);

            if (expenses == null)
            {
                return NotFound();
            }

            return expenses;
        }

        // PUT: api/Expenses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpenses(int id, Expenses expenses)
        {
            if (id != expenses.Id)
            {
                return BadRequest();
            }

            _context.Entry(expenses).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpensesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Expenses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Expenses>> PostExpenses(Expenses expenses)
        {
            _context.Expenses.Add(expenses);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpenses", new { id = expenses.Id }, expenses);
        }

        // DELETE: api/Expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpenses(int id)
        {
            var expenses = await _context.Expenses.FindAsync(id);
            if (expenses == null)
            {
                return NotFound();
            }

            _context.Expenses.Remove(expenses);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Expenses/GetUserExpenses/{userId}
        [HttpGet("GetUserExpenses/{userId}")]
        public async Task<ActionResult<IEnumerable<Expenses>>> GetUserExpenses(int userId)
        {
            // Get all incomes of the specified user
            var userExpenses = await _context.Expenses
                                            .Where(i => i.UserId == userId)
                                            .ToListAsync();

            if (userExpenses == null || !userExpenses.Any())
            {
                return NoContent(); // No incomes found for the specified userId
            }

            return userExpenses;
        }

        // GET: api/Expenses/GetMonthlyIncome?userId={userId}&year={year}&month={month}
        [HttpGet("GetMonthlyExpense")]
        public async Task<ActionResult<IEnumerable<Expenses>>> GetMonthlyExpense(int userId, int year, int month)
        {
            // Get all expenses of the specified user within the specified month and year
            var expenses = await _context.Expenses
                                        .Where(i => i.UserId == userId && i.Date.Year == year && i.Date.Month == month)
                                        .ToListAsync();

            return expenses;
        }

        // GET: api/Expenses/GetExpensesByDateRange
        [HttpGet("GetExpensesByDateRange")]
        public async Task<ActionResult<IEnumerable<Expenses>>> GetExpensesByDateRange(int userId, DateOnly startDate, DateOnly endDate)
        {
            // Get expenses of the specified user within the specified date range
            var expenses = await _context.Expenses
                                        .Where(i => i.UserId == userId && i.Date >= startDate && i.Date <= endDate)
                                        .ToListAsync();

            if (expenses == null || !expenses.Any())
            {
                return NoContent(); // No expenses found within the specified date range
            }

            return expenses;
        }
        private bool ExpensesExists(int id)
        {
            return _context.Expenses.Any(e => e.Id == id);
        }
    }
}
