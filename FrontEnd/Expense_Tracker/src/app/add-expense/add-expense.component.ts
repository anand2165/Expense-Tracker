import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, map } from 'rxjs';
import { ICategory } from '../ICategoty.interface';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.css'
})
export class AddExpenseComponent {

  categories: { id: number, categoryName: string }[] = [];
  constructor(private userService:UserService,private formBuilder: FormBuilder,private router:Router){}
 
  ngOnInit(){
    const userId = this.userService.userIdlogin;
      this.userService.getExpenseCategoriesByUserId(userId).pipe(
      catchError((error) => {
        console.error('Error getting income:', error);
        throw error;
      }),
      map((response: ICategory[]) => {
        return response.map(category => ({ id: category.id, categoryName: category.categoryName }));
      })
    ).subscribe((categories: { id: number, categoryName: string }[]) => {
      console.log(categories);
      this.categories = categories;
    });
  }

    expenseForm = this.formBuilder.group({
      date: [null, Validators.required],
      amount: [null, Validators.required],
      categoryId: [null, Validators.required],
      description: [null, Validators.required]
    })

  onSubmit(){
    if(this.expenseForm){
        const userId:number=this.userService.userIdlogin;
        this.userService.addExpenseById(userId,this.expenseForm).subscribe({
          next: (response)=>{
            console.log('Expense is added successfully:', response)
            // this.expenseForm.reset;
              this.router.navigate(['/expense'])}
  
        });
      
      } 
    }

   

}


