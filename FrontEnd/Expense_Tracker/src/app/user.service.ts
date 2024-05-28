import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, catchError} from 'rxjs';
import { IResponse } from './IResponse.interface';
import { ICategory } from './ICategoty.interface';
import { IUser } from './IUser.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userIdlogin: number = 0;
  userName:string='';
  userEmail:string='';

  private isLoggedInSubject: BehaviorSubject<boolean> =new BehaviorSubject<boolean>(false);
  isLoggedIn = this.isLoggedInSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  loginvalue() {
    this.isLoggedInSubject.next(true);
  }

  logout() {
    this.isLoggedInSubject.next(false);
  }

  //Sign Up API
  signUp(inputUser: FormGroup): Observable<any> {
    const newUser = {
      name: inputUser.value.Name,
      email: inputUser.value.Email,
      password: inputUser.value.Password,
    };
    return this.http.post('https://localhost:7194/api/Users', newUser).pipe(
      catchError((error) => {
        console.error('Error adding new user:', error);
        throw error;
      })
    );
  }

  //Login API
  login(user: FormGroup): Observable<IUser> {
    const loginData = { email:user.value.Email, password:user.value.Password };
    return this.http.post<IUser>('https://localhost:7194/api/Users/Login', loginData)
      .pipe(
        catchError((error) => {
          console.error('Error getting users:', error);
          throw error;
        })
      );
  }

  ///////////////Income API/////////////////////////
  addIncomebyId(userId: number, income: FormGroup): Observable<any> {
      const incomeData = {
        userId: userId,
        date: income.get('date')?.value,
        amount: income.get('amount')?.value,
        categoryId: income.get('categoryId')?.value,
        description: income.get('description')?.value,
      };
      return this.http.post<any>('https://localhost:7194/api/Incomes',incomeData).pipe(
        catchError((error) => {
          console.error('Error getting income:', error);
          throw error;
        })
      );
  }

  getIncomeByUserId(userId: number): Observable<IResponse[]> {
    return this.http
      .get<IResponse[]>(
        `https://localhost:7194/api/Incomes/GetUserIncomes/${userId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error getting income:', error);
          throw error;
        })
      );
 }

  getIncomeByMonth(userId: number,year: any,month: any): Observable<IResponse[]> {
    return this.http
      .get<IResponse[]>(
        `https://localhost:7194/api/Incomes/GetMonthlyIncome?userId=${userId}&year=${year}&month=${month}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error getting monthly income:', error);
          throw error;
        })
      );
  }

  getIncommeByDateRange(userId: number,date: FormGroup): Observable<IResponse[]> {
    const startDate = date.get('startDate')?.value;
    const endDate = date.get('endDate')?.value;
    return this.http
      .get<IResponse[]>(
        `https://localhost:7194/api/Incomes/GetIncomesByDateRange?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error getting DataIncomeRange:', error);
          throw error;
        })
      );
  }

  deleteIncomeByUserId(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7194/api/Incomes/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting income:', error);
        throw error;
      })
    );
  }

  addIncomeCategory(userId: number, inputCategory: FormGroup): Observable<any> {
    const newCategory = {
      userId: userId,
      categoryName: inputCategory.get('CategoryName')?.value,
    };
    return this.http.post<any>('https://localhost:7194/api/IncomeCategories', newCategory)
      .pipe(
        catchError((error) => {
          console.error('Error adding income category:', error);
          throw error;
        })
      );
  }

  getIncomeCategoriesByUserId(userId: number): Observable<ICategory[]> {
    return this.http
      .get<ICategory[]>(
        `https://localhost:7194/api/IncomeCategories/GetIncomeCategoriesByUserId/${userId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error getting monthly income:', error);
          throw error;
        })
      );
  }

  deleteIncomeCategory(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7194/api/IncomeCategories/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting income category:', error);
          throw error;
        })
      );
  }

///////////Expense API//////////////////////////
  addExpenseById(userId: number, inputExpense: FormGroup): Observable<any> {
    const newExpense = {
      userId: userId,
      date: inputExpense.get('date')?.value,
      amount: inputExpense.get('amount')?.value,
      categoryId: inputExpense.get('categoryId')?.value,
      description: inputExpense.get('description')?.value,
    };
    return this.http.post<any>('https://localhost:7194/api/Expenses',newExpense ).pipe(
      catchError((error) => {
        console.error('Error adding new expense:', error);
        throw error;
      })
    );
  }
  
  getExpenseByUserId(id: number): Observable<IResponse[]> {
    return this.http.get<IResponse[]>(`https://localhost:7194/api/Expenses/GetUserExpenses/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error getting expense by User Id:', error);
          throw error;
        })
      );
  }

  getExpenseByMonth(userId: number,year: any,month: any): Observable<IResponse[]> {
    return this.http.get<IResponse[]>(
        `https://localhost:7194/api/Expenses/GetMonthlyExpense?userId=${userId}&year=${year}&month=${month}`)
      .pipe(
        catchError((error) => {
          console.error('Error getting expense by month:', error);
          throw error;
        })
      );
  }

  getExpenseByDateRange(userId: number,date: FormGroup): Observable<IResponse[]> {
    const startDate = date.get('startDate')?.value;
    const endDate = date.get('endDate')?.value;
    return this.http
      .get<IResponse[]>(
        `https://localhost:7194/api/Expenses/GetExpensesByDateRange?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error getting DataIncomeRange:', error);
          throw error;
        })
      );
  }

  deleteExpenseByUserId(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7194/api/Expenses/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting expense:', error);
        throw error;
      })
    );
  }

  addExpenseCategory(userId: number, inputCategory: FormGroup): Observable<any> {
    const newCategory = {
      userId: userId,
      categoryName: inputCategory.get('CategoryName')?.value,
    };
    return this.http.post<any>('https://localhost:7194/api/ExpenseCategories', newCategory)
      .pipe(
        catchError((error) => {
          console.error('Error adding expense category:', error);
          throw error;
        })
      );
  }

  getExpenseCategoriesByUserId(userId: number): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(
        `https://localhost:7194/api/ExpenseCategories/GetExpenseCategoriesByUserId/${userId}`)
      .pipe(
        catchError((error) => {
          console.error('Error getting expense categories:', error);
          throw error;
        })
      );
  }

  deleteExpenseCategory(id: number): Observable<any> {
    return this.http.delete(`https://localhost:7194/api/ExpenseCategories/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting expense category:', error);
          throw error;
        })
      );
  }
}
