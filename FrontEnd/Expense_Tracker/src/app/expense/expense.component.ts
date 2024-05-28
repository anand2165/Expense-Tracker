import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { catchError, map } from 'rxjs';
import { IResponse } from '../IResponse.interface';
import { ICategory } from '../ICategoty.interface';


@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent {
  expenses: IResponse[] = [];
  userId:number=0;
  categories: { id: number, categoryName: string }[] = [];
  constructor(private router:Router,
              private userService:UserService,
            private formBuilder:FormBuilder){}

categoryForm = this.formBuilder.group({
                CategoryName:[]
               });

  ngOnInit() {
    this.userId = this.userService.userIdlogin;
    this.userService.getExpenseByUserId(this.userId).pipe(
      catchError((error) => {
        console.error('Error getting expenses:', error);
        throw error;
      }),
      map((response: IResponse[]) => {
        // Sorting incomes based on date
        return response.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      })
    ).subscribe((response: IResponse[]) => {
      this.expenses = response;
    });

    this.userService.getExpenseCategoriesByUserId(this.userId).pipe(
      catchError((error) => {
        console.error('Error getting income:', error);
        throw error;
      }),
      map((response: ICategory[]) => {
        return response.map(category => ({ id: category.id, categoryName: category.categoryName }));
      })
    ).subscribe((categories: { id: number, categoryName: string }[]) => {
      this.categories = categories;
    });
  }

 addExpense(){
  this.router.navigate(['/addexpense']);
  this.ngOnInit();
 }

 onExpenseDelete(id:number){
  this.userService.deleteExpenseByUserId(id).subscribe((response) => {
    if(response===null){
      this.expenses = this.expenses.filter(expense => expense.id !== id);
    }
  });
}

addCategory(){
  this.userService.addExpenseCategory(this.userId,this.categoryForm).subscribe({
    next: ()=>{
      this.ngOnInit();
      }
});
}

onCategoryDelete(id: number) {
  this.userService.deleteExpenseCategory(id).subscribe(() => {
    this.categories = this.categories.filter(category => category.id !== id);
  });
}
 
}
