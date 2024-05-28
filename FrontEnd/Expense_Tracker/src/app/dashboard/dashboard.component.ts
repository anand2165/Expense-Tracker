import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, map } from 'rxjs';
import { UserService } from '../user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IResponse } from '../IResponse.interface';
import { ICategory } from '../ICategoty.interface';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private sub: Subscription = new Subscription();
  // userId: number=this.userService.userIdlogin;
  userId:number=0;
  username: string = '';
  email?: string;
  
  totalIncome: number = 0; 
  totalIncomeByMonth:number=0;
  totalExpense:number=0;
  totalExpenseByMonth:number=0;
  categoryIncome:number=0;
  categoryExpense:number=0;
  incomes:IResponse[]=[];
  expenses:IResponse[]=[];
  incomecategories: { id: number, categoryName: string }[] = [];
  expensecategories: { id: number, categoryName: string }[] = [];
  expenseAmount:number=0;

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth() + 1; 
  currentYear = this.currentDate.getFullYear();

  constructor(
              private userService: UserService,
              private formBuilder:FormBuilder,
            private router:Router) {}

  dateForm = this.formBuilder.group({
   startDate:[''],
   endDate:['']
  });

  incomeCategoryForm = this.formBuilder.group({
    category:[]
   });

   expenseCategoryForm = this.formBuilder.group({
    category:[]
   });

  ngOnInit(): void {
    this.userId = this.userService.userIdlogin;
     if (this.userId !== undefined) {
      //income total
      this.userService.getIncomeByUserId(this.userId).pipe(
        catchError((error) => {
          console.error('Error getting income:', error);
          throw error;
        })
      ).subscribe((response: IResponse[]) => {
        this.incomes=response;
        this.totalIncome = response.reduce((total, income) => total + income.amount, 0);
      });


      //income by month
      this.userService.getIncomeByMonth(this.userId, this.currentYear, this.currentMonth).pipe(
        catchError((error) => {
          console.error('Error getting income:', error);
          throw error;
        })
      ).subscribe((response:IResponse[])=>
      {
        this.totalIncomeByMonth = response.reduce((total, income) => total + income.amount, 0);
      });

      //expense total
      this.userService.getExpenseByUserId(this.userId).pipe(
        catchError((error) => {
          console.error('Error getting income:', error);
          throw error;
        })
      ).subscribe((response: IResponse[]) => {
        this.expenses=response;
        this.totalExpense = response.reduce((total, expense) => total + expense.amount, 0);
      });

      //expense by month
      this.userService.getExpenseByMonth(this.userId, this.currentYear, this.currentMonth).pipe(
        catchError((error) => {
          console.error('Error getting income:', error);
          throw error;
        })
      ).subscribe((response:IResponse[])=>
      {
       
        this.totalExpenseByMonth = response.reduce((total, income) => total + income.amount, 0);
      });
      }

      
      this.userService.getIncomeCategoriesByUserId(this.userId).pipe(
      map((response: ICategory[]) => {
        return response.map(category => ({ id: category.id, categoryName: category.categoryName }));
      })
    ).subscribe((categories: { id: number, categoryName: string }[]) => {
      this.incomecategories = categories;
    });

    this.userService.getExpenseCategoriesByUserId(this.userId).pipe(
      map((response: ICategory[]) => {
        return response.map(category => ({ id: category.id, categoryName: category.categoryName }));
      })
    ).subscribe((categories: { id: number, categoryName: string }[]) => {
      this.expensecategories = categories;
    });
  }

  getExpenseBydate(){
    this.userService.getExpenseByDateRange(this.userId,this.dateForm).pipe(
      catchError((error) => {
        console.error('Error getting income:', error);
        throw error;
      })
    ).subscribe((response:IResponse[])=>
    {
      this.expenseAmount = response.reduce((total, income) => total + income.amount, 0);
    });
  }

  getIncomeByCategory(){
    const categoryId = this.incomeCategoryForm.get('category')?.value;
    if (categoryId !== undefined && categoryId !== null) {
      const categoryIdNumber = parseInt(categoryId, 10);
      const catIncome = this.incomes.filter(income => income.categoryId === categoryIdNumber);
      this.categoryIncome = catIncome.reduce((acc, income) => acc + income.amount, 0);
    } else {
      console.error("Category ID is undefined or null");
    }
  }

  getExpenseByCategory(){
    const categoryId = this.expenseCategoryForm.get('category')?.value;
    if (categoryId !== undefined && categoryId !== null) {
      const categoryIdNumber = parseInt(categoryId, 10);
      const catExpense = this.expenses.filter(expense => expense.categoryId === categoryIdNumber);
      this.categoryExpense = catExpense.reduce((acc, expense) => acc + expense.amount, 0);
    } else {
      console.error("Category ID is undefined or null");
    }
  }

goGraph(){
  this.router.navigate(['/graphy']);
}

}
