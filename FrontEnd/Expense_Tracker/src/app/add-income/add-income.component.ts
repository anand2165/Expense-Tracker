import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { ICategory } from '../ICategoty.interface';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-income.component.html',
  styleUrl: './add-income.component.css'
})
export class AddIncomeComponent {
  categories: { id: number, categoryName: string }[] = [];
  incomeForm = this.formBuilder.group({
    date: [null, Validators.required],
    amount: [null, Validators.required],
    categoryId: [null, Validators.required],
    description:[null, Validators.required],

  })
 
  
 constructor(private userService:UserService,
  private router:Router,private formBuilder:FormBuilder){}
 ngOnInit(){
  const userId = this.userService.userIdlogin;
      this.userService.getIncomeCategoriesByUserId(userId).pipe(
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

 onSubmit(){
      const userId:number=this.userService.userIdlogin;
      this.userService.addIncomebyId(userId,this.incomeForm).subscribe({
        next: (response)=>{
          console.log('Income is added successfully:', response)
            this.router.navigate(['/income'])}
  });
    }

}
