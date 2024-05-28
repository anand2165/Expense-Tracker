import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { IUser } from '../IUser.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formsubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  loginForm = this.formBuilder.group({
    Email: [''],
    Password: [''],
  });

  onSubmit() {
    this.formsubmit = true;
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm).subscribe({
        next: (response: IUser) => {
          if (response) {
            this.userService.loginvalue();
            this.toastr.success('Logged in successfully',`Welcome ${response.name}`);
            this.userService.userIdlogin = response.id;
            this.userService.userName=response.name;
            this.userService.userEmail=response.email;
            this.router.navigate(['/dashboard']);
          }
        },
      });
    }
  }
}
