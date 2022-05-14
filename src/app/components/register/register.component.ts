import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterForm } from 'src/app/models/user-register-form';
import { ValidationService } from 'src/app/services/validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email!: string;
  password!: string;
  repeatPassword!: string;

  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  isRepeatPasswordValid: boolean = true;

  constructor(private router: Router, private validationService: ValidationService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmitRegisterForm(): void {
    this.resetFlagsAndErrorMessages();
   // this.clientSideValidate();

    // Back End Validation
    if (this.isEmailValid && this.isPasswordValid && this.isRepeatPasswordValid) {
      const userForm: UserRegisterForm = {
        email: this.email,
        password: this.password,
        repeatPassword: this.repeatPassword
      }

      this.validationService.postRegisterForm(userForm).subscribe({
        next: (response: Object) => {
          const map = new Map(Object.entries(response));
          this.snackBar.open(map.get("response"), '', {
            duration: 4000,
            panelClass: ['snackbar']
          });
          this.resetFlagsAndErrorMessages();
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.handleServerErrors(errorResponse);
        }
      })
    }
  }


  clientSideValidate() {
    if (this.email == null) {
      this.isEmailValid = false;
    }
    if (this.password == null) {
      this.isPasswordValid = false;
    }
    if (this.repeatPassword == null) {
      this.isRepeatPasswordValid = false;
    }

    if (this.isEmailValid) {
      const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
      this.isEmailValid = emailRegexExp.test(this.email);
    }
    if (this.isPasswordValid) {
      this.isPasswordValid = this.password.trim().length > 7;
      if (this.isPasswordValid && this.password.length > 32) {
        this.isPasswordValid = false;
        document.getElementById("error-password")!.textContent = "Your password should not exceed 32 characters!";
      }
    }
    if (this.isRepeatPasswordValid) {
      this.isRepeatPasswordValid = this.password === this.repeatPassword;
    }
  }

  handleServerErrors(errorResponse: HttpErrorResponse) {
    if (errorResponse.status == 400) {
      const errorsMap = new Map<string, string>(Object.entries(errorResponse.error));
      if (errorsMap.has("email")) {
        this.isEmailValid = false;
        document.getElementById("error-email")!.textContent = errorsMap.get("email")!;
      }
      if (errorsMap.has("password")) {
        this.isPasswordValid = false;
        document.getElementById("error-password")!.textContent = errorsMap.get("password")!;
      }
      if (errorsMap.has("repeatPassword")) {
        this.isRepeatPasswordValid = false;
        document.getElementById("error-repeat-password")!.textContent = errorsMap.get("repeatPassword")!;
      }
    }
    else {
      this.snackBar.open("Unexpected error. ❌", "Dismiss");
    }
  }

  resetFlagsAndErrorMessages(): void {
    this.isEmailValid = true;
    this.isPasswordValid = true;
    this.isRepeatPasswordValid = true;

    document.getElementById("error-password")!.textContent = "Your password has to be at least 8 characters long!";
  }
}
