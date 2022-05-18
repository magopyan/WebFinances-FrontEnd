import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUser: any;

  email!: string;
  password!: string;

  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;

  constructor(private router: Router, private firebaseAuthService: FirebaseAuthService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.firebaseAuthService.getUser().subscribe(
      (user) => this.currentUser = user);
  }

  onSubmitLoginForm(): void {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();

    if (this.isEmailValid && this.isPasswordValid) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          if(userCredential.user.emailVerified == true) {
            this.email = "";
            this.password = "";
          }
          else {
            this.isEmailValid = false;
            document.getElementById("error-email")!.textContent = "You need to verify your email before you can log in!";
            signOut(auth);
          }
        })
        .catch((error) => {
          if (error.code == "auth/user-not-found") { 
            this.isEmailValid = false;
            document.getElementById("error-email")!.textContent = "There is no such account registered with this email!";
          }
          else if (error.code == "auth/wrong-password") {
            this.isPasswordValid = false;
            document.getElementById("error-password")!.textContent = "Incorrect password!";
          }
          else {
            this.snackBar.open("Unexpected Firebase error! ❌", "Dismiss");
            console.log(error.code);
          }
        });
    }
  }


  clientSideValidate() {
    if (this.email == null) {
      this.isEmailValid = false;
    }
    if (this.password == null) {
      this.isPasswordValid = false;
    }
    if (this.isEmailValid) {
      const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
      this.isEmailValid = emailRegexExp.test(this.email);
    }
    if (this.isPasswordValid) {
      this.isPasswordValid = this.password.trim().length > 7;
    }
  }

  resetFlagsAndErrorMessages(): void {
    this.isEmailValid = true;
    this.isPasswordValid = true;
    document.getElementById("error-email")!.textContent = "Please enter a valid email!";
    document.getElementById("error-password")!.textContent = "Your password is at least 8 characters long!";
  }
}
