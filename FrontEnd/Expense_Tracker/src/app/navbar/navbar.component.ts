// import { Component } from '@angular/core';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import {MatButtonModule} from '@angular/material/button';
// import { RouterLink, RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { UserService } from '../user.service';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [RouterLink,RouterOutlet,MatToolbarModule,MatButtonModule,CommonModule],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {
//   userId?:number;
//   isLoggedIn:boolean=false;
//   constructor(private userService:UserService){}
 
// ngOnInit(){
//   if(this.isLoggedIn){
//   this.userId=this.userService.userIdlogin;
//   this.isLoggedIn=this.userService.isLoggedIn;
//   console.log(this.isLoggedIn);
//   }
// }
//   logout():void{
// this.userService.isLoggedIn=false
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,RouterOutlet,MatToolbarModule,MatButtonModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userId?:number;
  private isLoggedInSubscription: Subscription = new Subscription();


  constructor(private userService: UserService,private router:Router) {}

  ngOnInit() {
    this.isLoggedInSubscription = this.userService.isLoggedIn.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}

