using ExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Data
{
    public class ExpenseDbContext:DbContext
    {
        public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options) : base(options)
        {

        }
        public DbSet<Users> Users { get; set; }
        public DbSet<ExpenseCategories> ExpenseCategories { get; set; }
        public DbSet<Expenses> Expenses { get; set; }
        public DbSet<IncomeCategories> IncomeCategories { get; set; }
        public DbSet<Incomes> Incomes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>()
                .HasMany(u => u.ExpenseCategory)
                .WithOne(ec => ec.User)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Users>()
                .HasMany(u => u.Expense)
                .WithOne(e => e.User)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Users>()
                .HasMany(u => u.IncomeCategory)
                .WithOne(ic => ic.User)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Users>()
                .HasMany(u => u.Income)
                .WithOne(i => i.User)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<ExpenseCategories>()
                .HasMany(ec => ec.Expenses)
                .WithOne(e => e.ExpenseCategories)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<IncomeCategories>()
                .HasMany(ic => ic.Incomes)
                .WithOne(i => i.IncomeCategories)
                .OnDelete(DeleteBehavior.ClientSetNull);

            base.OnModelCreating(modelBuilder);
        }
    }
}
