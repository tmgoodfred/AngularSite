import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-user-account',
  template: `
    <div class="container">
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
  `],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})
export class UserAccountComponent {
  registerUser = { UserName: '', UserPass: '' };
  loginUser = { UserName: '', UserPass: '' };
  registerMessage: string | null = null;
  registerSuccess: boolean = false;
  loginMessage: string | null = null;

  constructor(private authService: AuthService) { }

  register(): void {
    this.authService.register(this.registerUser).subscribe(
      response => {
        console.log('User registered successfully', response);
        this.registerMessage = 'Account created successfully!';
        this.registerSuccess = true;
      },
      error => {
        console.error('Error registering user', error);
        this.registerMessage = 'Error creating account. Please try again.';
        this.registerSuccess = false;
      }
    );
  }

  login(): void {
    this.authService.login(this.loginUser).subscribe(
      response => {
        console.log('User logged in successfully', response);
        this.loginMessage = 'Login Successful!';
      },
      error => {
        console.error('Error logging in', error);
        this.loginMessage = 'Error logging in. Please try again.';
      }
    );
  }
}





