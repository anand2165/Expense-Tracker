import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ICategory } from '../ICategoty.interface';
import { IResponse } from '../IResponse.interface';
import { catchError, map } from 'rxjs/operators';
import { Chart, ChartType } from 'chart.js/auto'; 
import moment from 'moment'; 

@Component({
  selector: 'app-graphy',
  standalone: true,
  imports: [],
  templateUrl: './graphy.component.html',
  styleUrls: ['./graphy.component.css'],
})
export class GraphyComponent implements OnInit {
  userId: number = 0;
  totalExpense: number = 0;
  expenses: IResponse[] = [];
  expensecategories: ICategory[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.userService.userIdlogin;
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses(): void {
    this.userService.getExpenseByUserId(this.userId).pipe(
      catchError((error) => {
        console.error('Error getting expenses:', error);
        throw error;
      })
    ).subscribe({
      next: (response: IResponse[]) => {
        this.expenses = response;
        this.totalExpense = response.reduce((total, expense) => total + expense.amount, 0);
        this.checkDataLoaded();
      }
    });
  }

  loadCategories(): void {
    this.userService.getExpenseCategoriesByUserId(this.userId).pipe(
      map((response: ICategory[]) => response.map((category) => ({
        id: category.id,
        categoryName: category.categoryName,
      })))
    ).subscribe({
      next: (categories) => {
        this.expensecategories = categories;
        this.checkDataLoaded();
      }
    });
  }

  checkDataLoaded(): void {
    if (this.expenses.length > 0 && this.expensecategories.length > 0) {
      this.loadCharts();
      this.displayMonthlyTable();
      this.displayCategoryTable();
    }
  }

  loadCharts(): void {
    const expensesByMonth = this.groupExpensesByMonth(this.expenses);
    const monthlyCanvas = document.getElementById('mymonthlychart') as HTMLCanvasElement;
    const monthLabels = Object.keys(expensesByMonth);
    const monthlyExpense = Object.values(expensesByMonth);
    
    const expensesByCategory = this.groupExpensesByCategory(this.expenses, this.expensecategories);
    const categoryCanvas = document.getElementById('mycategorychart') as HTMLCanvasElement;
    const categoryLabels = Object.keys(expensesByCategory);
    const categoryExpense = Object.values(expensesByCategory);
    
    this.createChart(monthlyCanvas,'bar', monthLabels, monthlyExpense, 'Expense Amount', 'Expenses by Month');
    this.createChart(categoryCanvas,'pie', categoryLabels, categoryExpense, 'Expense Amount', 'Expenses by Category');
  }

  createChart(ctx: HTMLCanvasElement, chartType: ChartType, labels: string[], data: number[], label: string, title: string): void {
    const backgroundColors = this.generateColors(data.length);

    new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
        
          data: data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => this.darkenColor(color)),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: chartType !== 'pie' ? {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        } : {},
        plugins: {
          legend: {
            position: 'top',
            align: 'end'
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    });
  }

  generateColors(numColors: number): string[] {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue = i * 360 / numColors;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  }

  darkenColor(color: string): string {
    const hsl = color.match(/\d+/g);
    if (hsl) {
      const h = parseInt(hsl[0], 10);
      const s = parseInt(hsl[1], 10);
      const l = parseInt(hsl[2], 10) - 10;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    return color;
  }

  groupExpensesByMonth(expenses: IResponse[]): { [key: string]: number } {
    return expenses.reduce((acc, expense) => {
      const month = moment(expense.date).format('YYYY-MM'); 
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += expense.amount;
      return acc;
    }, {} as { [key: string]: number });
  }

  groupExpensesByCategory(expenses: IResponse[], expenseCategories: ICategory[]): { [key: string]: number } {
    return expenses.reduce((acc, expense) => {
      const category = expenseCategories.find(cat => cat.id === expense.categoryId);
      const categoryName = category ? category.categoryName : 'Unknown Category';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += expense.amount;
      return acc;
    }, {} as { [key: string]: number });
  }

  displayMonthlyTable(): void {
    const expensesByMonth = this.groupExpensesByMonth(this.expenses);
    let tableHtml = '<table class="table table-striped"><thead><tr><th>Month</th><th>Expense Amount</th></tr></thead><tbody>';
    
    for (const [month, amount] of Object.entries(expensesByMonth)) {
      tableHtml += `<tr><td>${month}</td><td>${amount}</td></tr>`;
    }
    
    tableHtml += '</tbody></table>';
    
    const monthlyTableElement = document.getElementById('monthly-table');
    if (monthlyTableElement) {
      monthlyTableElement.innerHTML = tableHtml;
    }
  }

  displayCategoryTable(): void {
    const expensesByCategory = this.groupExpensesByCategory(this.expenses, this.expensecategories);
    let tableHtml = '<table class="table table-striped"><thead><tr><th>Category</th><th>Expense Amount</th></tr></thead><tbody>';
    
    for (const [category, amount] of Object.entries(expensesByCategory)) {
      tableHtml += `<tr><td>${category}</td><td>${amount}</td></tr>`;
    }
    
    tableHtml += '</tbody></table>';
    
    const categoryTableElement = document.getElementById('category-table');
    if (categoryTableElement) {
      categoryTableElement.innerHTML = tableHtml;
    }
  }
}
