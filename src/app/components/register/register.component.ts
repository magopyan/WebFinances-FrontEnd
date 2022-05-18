import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegisterForm } from 'src/app/models/user-register-form';
import { ValidationService } from 'src/app/services/validation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';


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

  currentUser: any;

  constructor(private router: Router, private validationService: ValidationService, 
    private firebaseAuthService: FirebaseAuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.firebaseAuthService.getUser().subscribe(
      (user) => this.currentUser = user);
  }

  signOut(): void {
    getAuth().signOut();
  }

  onSubmitRegisterForm(): void {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();

    if (this.isEmailValid && this.isPasswordValid && this.isRepeatPasswordValid) {
      const userForm: UserRegisterForm = {
        email: this.email,
        password: this.password,
        repeatPassword: this.repeatPassword
      }

      this.validationService.postRegisterForm(userForm).subscribe({
        next: (response: Object) => {
          const auth = getAuth();
          createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
              sendEmailVerification(this.currentUser);
              this.signOut();
              console.log(userCredential.user.emailVerified);
              this.email = "";
              this.password = "";
              this.repeatPassword = "";
              const map = new Map(Object.entries(response));
              this.snackBar.open(map.get("response"), '', {
                duration: 4000,
                panelClass: ['snackbar']
              });
            })
            .catch((error) => {
              if (error.code == "auth/email-already-in-use") {
                this.isEmailValid = false;
                document.getElementById("error-email")!.textContent = "This email is already taken!";
              }
              else {
                this.snackBar.open("Unexpected Firebase error! ❌", "Dismiss");
              }
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
      console.log(errorResponse.error);
      this.snackBar.open("Server error. ❌", "Dismiss");
    }
  }

  resetFlagsAndErrorMessages(): void {
    this.isEmailValid = true;
    this.isPasswordValid = true;
    this.isRepeatPasswordValid = true;
    document.getElementById("error-password")!.textContent = "Your password has to be at least 8 characters long!";
  }
}
