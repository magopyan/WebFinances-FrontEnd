import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


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

  constructor(private router: Router, private firebaseAuthService: FirebaseAuthService,
    public snackBar: MatSnackBar, public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.currentUser = this.firebaseAuthService.getCurrentUser();
    this.firebaseAuthService.getUser().subscribe(user => this.currentUser = user);
  }

  onSubmitLoginForm(): void {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();

    if (this.isEmailValid && this.isPasswordValid) {
      this.afAuth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          if (result?.user?.emailVerified == true) {
            this.email = "";
            this.password = "";
            this.router.navigate(['accounts']);
          }
          else {
            this.isEmailValid = false;
            document.getElementById("error-email")!.textContent = "You need to verify your email before you can log in!";
            this.firebaseAuthService.signOut();
          }
        })
        .catch((error) => {
          if (error.code == "auth/invalid-email") {
            this.isEmailValid = false;
          }
          else if (error.code == "auth/user-not-found") {
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
      const emailRegexExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
