import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { IResponse } from '../IResponse.interface';
import { ICategory } from '../ICategoty.interface';


@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent {
  
  categories: { id: number, categoryName: string }[] = [];
  incomes: IResponse[] = [];
  userId:number=0;
  constructor(private formBuilder: FormBuilder, private userService: UserService,private router:Router) {}
  
  categoryForm = this.formBuilder.group({
    CategoryName:[]
   });


ngOnInit(){
  this.userId = this.userService.userIdlogin;
    this.userService.getIncomeCategoriesByUserId(this.userId).pipe(
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

  this.userService.getIncomeByUserId(this.userId).pipe(
    catchError((error) => {
      console.error('Error getting imconmes:', error);
      throw error;
    }),
    map((response: IResponse[]) => {
      // Sorting incomes based on date
      return response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    })
  ).subscribe((response: IResponse[]) => {
    this.incomes = response;
  });  
}

addIncome(){
  this.router.navigate(['/addincome']);
  this.ngOnInit();
}

onIncomeDelete(id: number) {
  this.userService.deleteIncomeByUserId(id).subscribe((response) => {
      this.incomes = this.incomes.filter(income => income.id !== id);
  });
}


onSubmit(){
  this.userService.addIncomeCategory(this.userId,this.categoryForm).subscribe({
    next: ()=>{
      this.ngOnInit();
      }
});
}

onCategoryDelete(id: number) {
  this.userService.deleteIncomeCategory(id).subscribe((response) => {
      // this.ngOnInit();
      this.categories = this.categories.filter(category => category.id !== id);
    
  });
}

}
