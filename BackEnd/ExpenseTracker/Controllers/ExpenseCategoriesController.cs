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
    public class ExpenseCategoriesController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public ExpenseCategoriesController(ExpenseDbContext context)
        {
            _context = context;
        }

        // GET: api/ExpenseCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseCategories>>> GetExpenseCategories()
        {
            return await _context.ExpenseCategories.ToListAsync();
        }

        // GET: api/ExpenseCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseCategories>> GetExpenseCategories(int id)
        {
            var expenseCategories = await _context.ExpenseCategories.FindAsync(id);

            if (expenseCategories == null)
            {
                return NotFound();
            }

            return expenseCategories;
        }

        // PUT: api/ExpenseCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpenseCategories(int id, ExpenseCategories expenseCategories)
        {
            if (id != expenseCategories.Id)
            {
                return BadRequest();
            }

            _context.Entry(expenseCategories).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpenseCategoriesExists(id))
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

        // POST: api/ExpenseCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExpenseCategories>> PostExpenseCategories(ExpenseCategories expenseCategories)
        {
            _context.ExpenseCategories.Add(expenseCategories);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpenseCategories", new { id = expenseCategories.Id }, expenseCategories);
        }

        // DELETE: api/ExpenseCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpenseCategories(int id)
        {
            var expenseCategories = await _context.ExpenseCategories.FindAsync(id);
            if (expenseCategories == null)
            {
                return NotFound();
            }

            _context.ExpenseCategories.Remove(expenseCategories);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/ExpenseCategories/GetExpenseCategoriesByUserId/{userId}
        [HttpGet("GetExpenseCategoriesByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<ExpenseCategories>>> GetExpenseCategoriesByUserId(int userId)
        {
            var expenseCategories = await _context.ExpenseCategories
                                                .Where(ic => ic.UserId == userId)
                                                .ToListAsync();

            if (expenseCategories == null || !expenseCategories.Any())
            {
                return NotFound(); // No expense categories found for the specified userId
            }

            return expenseCategories;
        }

        private bool ExpenseCategoriesExists(int id)
        {
            return _context.ExpenseCategories.Any(e => e.Id == id);
        }
    }
}
