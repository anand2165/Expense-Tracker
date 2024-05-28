import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income.component';
import { ExpenseComponent } from './expense/expense.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { AddIncomeComponent } from './add-income/add-income.component';
import { authGuard } from './auth.guard';
import { GraphyComponent } from './graphy/graphy.component';


export const routes: Routes = [
    {
        path:"",
        component:SignupComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"signup",
        component:SignupComponent
    },
    {
        path:"expense",
        component:ExpenseComponent,
        canActivate:[authGuard]
    },
    {
        path:"income",
        component:IncomeComponent,
        canActivate:[authGuard]
    },
    {
        path:"dashboard",
        component:DashboardComponent,
        canActivate:[authGuard]
    },
    {
        path:"addexpense",
        component:AddExpenseComponent,
        canActivate:[authGuard]
    },
    {
        path:"addincome",
        component:AddIncomeComponent,
        canActivate:[authGuard]
    },
    {
        path:"graphy",
        component:GraphyComponent,
        canActivate:[authGuard]
    },
];
