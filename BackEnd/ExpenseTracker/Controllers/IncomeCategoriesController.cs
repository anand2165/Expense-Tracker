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
    public class IncomeCategoriesController : ControllerBase
    {
        private readonly ExpenseDbContext _context;

        public IncomeCategoriesController(ExpenseDbContext context)
        {
            _context = context;
        }

        // GET: api/IncomeCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncomeCategories>>> GetIncomeCategories()
        {
            return await _context.IncomeCategories.ToListAsync();
        }

        // GET: api/IncomeCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IncomeCategories>> GetIncomeCategories(int id)
        {
            var incomeCategories = await _context.IncomeCategories.FindAsync(id);

            if (incomeCategories == null)
            {
                return NotFound();
            }

            return incomeCategories;
        }

        // PUT: api/IncomeCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutIncomeCategories(int id, IncomeCategories incomeCategories)
        {
            if (id != incomeCategories.Id)
            {
                return BadRequest();
            }

            _context.Entry(incomeCategories).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IncomeCategoriesExists(id))
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

        // POST: api/IncomeCategories
        [HttpPost]
        public async Task<ActionResult<IncomeCategories>> PostIncomeCategories(IncomeCategories incomeCategories)
        {
            _context.IncomeCategories.Add(incomeCategories);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetIncomeCategories", new { id = incomeCategories.Id }, incomeCategories);
        }

        // DELETE: api/IncomeCategories/id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIncomeCategories(int id)
        {
            var incomeCategories = await _context.IncomeCategories.FindAsync(id);
            if (incomeCategories == null)
            {
                return NotFound();
            }

            _context.IncomeCategories.Remove(incomeCategories);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/IncomeCategories/GetIncomeCategoriesByUserId/{userId}
        [HttpGet("GetIncomeCategoriesByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<IncomeCategories>>> GetIncomeCategoriesByUserId(int userId)
        {
            var incomeCategories = await _context.IncomeCategories
                                                .Where(ic => ic.UserId == userId)
                                                .ToListAsync();

            if (incomeCategories == null || !incomeCategories.Any())
            {
                return NotFound(); // No income categories found for the specified userId
            }

            return incomeCategories;
        }

        private bool IncomeCategoriesExists(int id)
        {
            return _context.IncomeCategories.Any(e => e.Id == id);
        }
    }
}
