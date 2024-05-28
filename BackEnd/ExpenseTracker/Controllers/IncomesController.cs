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
    public class IncomesController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public IncomesController(ExpenseDbContext context)
        {
            _context = context;
        }

        // GET: api/Incomes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Incomes>>> GetIncomes()
        {
            return await _context.Incomes.ToListAsync();
        }

        // GET: api/Incomes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Incomes>> GetIncomes(int id)
        {
            var incomes = await _context.Incomes.FindAsync(id);

            if (incomes == null)
            {
                return NotFound();
            }

            return incomes;
        }

        // PUT: api/Incomes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncomes(int id, Incomes incomes)
        {
            if (id != incomes.Id)
            {
                return BadRequest();
            }

            _context.Entry(incomes).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IncomesExists(id))
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

        // POST: api/Incomes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Incomes>> PostIncomes(Incomes incomes)
        {
            _context.Incomes.Add(incomes);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIncomes", new { id = incomes.Id }, incomes);
        }

        // DELETE: api/Incomes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncomes(int id)
        {
            var incomes = await _context.Incomes.FindAsync(id);
            if (incomes == null)
            {
                return NotFound();
            }

            _context.Incomes.Remove(incomes);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Incomes/GetUserIncomes/{userId}
        [HttpGet("GetUserIncomes/{userId}")]
        public async Task<ActionResult<IEnumerable<Incomes>>> GetUserIncomes(int userId)
        {
            // Get all incomes of the specified user
            var userIncomes = await _context.Incomes
                                            .Where(i => i.UserId == userId)
                                            .ToListAsync();

            if (userIncomes == null || !userIncomes.Any())
            {
                return NoContent(); // No incomes found for the specified userId
            }

            return userIncomes;
        }

        // GET: api/Incomes/GetMonthlyIncome?userId={userId}&year={year}&month={month}
        [HttpGet("GetMonthlyIncome")]
        public async Task<ActionResult<List<Incomes>>> GetMonthlyIncome(int userId, int year, int month)
        {
            // Get all incomes of the specified user within the specified month and year
            var incomes = await _context.Incomes
                                        .Where(i => i.UserId == userId && i.Date.Year == year && i.Date.Month == month)
                                        .ToListAsync();

            if (incomes == null || !incomes.Any())
            {
                return NoContent(); // No incomes found for the specified userId
            }

            return incomes;
        }

        // GET: api/Incomes/GetIncomesByDateRange
        [HttpGet("GetIncomesByDateRange")]
        public async Task<ActionResult<List<Incomes>>> GetIncomesByDateRange(int userId, DateOnly startDate, DateOnly endDate)
        {
            // Get incomes of the specified user within the specified date range
            var incomes = await _context.Incomes
                                        .Where(i => i.UserId == userId && i.Date >= startDate && i.Date <= endDate)
                                        .ToListAsync();

            if (incomes == null || !incomes.Any())
            {
                return NoContent(); // No incomes found within the specified date range
            }

            return incomes;
        }


        private bool IncomesExists(int id)
        {
            return _context.Incomes.Any(e => e.Id == id);
        }
    }
}
