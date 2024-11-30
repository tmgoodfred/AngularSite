import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-account',
  template: `
    <div class="container">
      <div *ngIf="isLoggedIn" class="greeting">
        <h1>Welcome, {{ loggedInUser }}!</h1>
        <button class="btn btn-secondary" (click)="logout()">Not {{ loggedInUser }}? Log out</button>
      </div>
      <div *ngIf="!isLoggedIn">
        <h1>Create Account</h1>
        <form (submit)="register()">
          <div class="form-group">
            <input type="text" [(ngModel)]="registerUser.UserName" placeholder="Username" name="username" class="form-control" required>
          </div>
          <div class="form-group">
            <input type="password" [(ngModel)]="registerUser.UserPass" placeholder="Password" name="password" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <div *ngIf="registerMessage" class="alert" [ngClass]="{'alert-success': registerSuccess, 'alert-danger': !registerSuccess, 'mt-3': true}">{{ registerMessage }}</div>

        <h1>Login</h1>
        <form (submit)="login()">
          <div class="form-group">
            <input type="text" [(ngModel)]="loginUser.UserName" placeholder="Username" name="username" class="form-control" required>
          </div>
          <div class="form-group">
            <input type="password" [(ngModel)]="loginUser.UserPass" placeholder="Password" name="password" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <div *ngIf="loginMessage" class="alert alert-success mt-3">{{ loginMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .btn {
      width: 100%;
    }
    .greeting {
      text-align: center;
      margin-bottom: 20px;
    }
  `],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class UserAccountComponent implements OnInit {
  registerUser = { UserName: '', UserPass: '' };
  loginUser = { UserName: '', UserPass: '' };
  registerMessage: string | null = null;
  registerSuccess: boolean = false;
  loginMessage: string | null = null;
  isLoggedIn: boolean = false;
  loggedInUser: string | null = null;

  constructor(private authService: AuthService, private cookieService: CookieService) { }

  ngOnInit(): void {
    const token = this.cookieService.get('authToken');
    if (token) {
      this.authService.verifyToken(token).subscribe(
        response => {
          this.isLoggedIn = true;
          this.loggedInUser = response.userName;
        },
        error => {
          console.error('Error verifying token', error);
          this.isLoggedIn = false;
        }
      );
    }
  }

  register(): void {
    this.authService.register(this.registerUser).subscribe(
      response => {
        console.log('User registered successfully', response);
        this.registerMessage = 'Account created successfully!';
        this.registerSuccess = true;
      },
      error => {
        console.error('Error registering user', error);
        if (error.status === 409) {
          this.registerMessage = 'User already exists. Please choose a different username.';
        } else {
          this.registerMessage = 'Error creating account. Please try again.';
        }
        this.registerSuccess = false;
      }
    );
  }

  login(): void {
    this.authService.login(this.loginUser).subscribe(
      response => {
        console.log('User logged in successfully', response);
        this.cookieService.set('authToken', response.token);
        this.isLoggedIn = true;
        this.loggedInUser = this.loginUser.UserName;
        this.loginMessage = 'Login Successful!';
      },
      error => {
        console.error('Error logging in', error);
        this.loginMessage = 'Error logging in. Please try again.';
      }
    );
  }

  logout(): void {
    this.cookieService.delete('authToken');
    this.isLoggedIn = false;
    this.loggedInUser = null;
  }
}
