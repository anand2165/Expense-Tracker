import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isFormSubmitted:boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  signinForm = this.formBuilder.group({
    Name: ['',[Validators.required, Validators.maxLength(20)]],
    Email: ['',[Validators.required,Validators.email]],
    Password: ['',Validators.minLength(8)],
  });

  onSubmit() {
    this.isFormSubmitted=true;
    if(this.signinForm.valid){
      this.userService.signUp(this.signinForm).subscribe({
        next: (response) => {
          this.toastr.success('Sign up successfull');
          this.signinForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error adding user:', error);
        },
      });
    } 
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
