import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

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

  emailForReset!: string;
  isEmailResetValid: boolean = true;

  @ViewChild('dialogRefReset') dialogRefReset!: TemplateRef<any>;

  constructor(private router: Router, private firebaseAuthService: FirebaseAuthService, private dialog: MatDialog,
    public snackBar: MatSnackBar, public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return firstValueFrom(this.afAuth.authState.pipe());
  }

  onResetPassword() {
    this.isEmailResetValid = true;
    this.dialog.open(this.dialogRefReset, { width: '400px', panelClass: 'custom-modalbox' });
  }

  resetPassword() {
    this.isEmailResetValid = true;
    this.afAuth
      .sendPasswordResetEmail(this.emailForReset)
      .then(() => {
        this.dialog.closeAll();
        this.snackBar.open("Password reset email sent successfully! ✔️", '', {
          duration: 4000,
          panelClass: ['snackbar']
        });        
      })
      .catch((error) => {
        if (error.code == "auth/invalid-email" || error.code == "auth/user-not-found") {
          this.isEmailResetValid = false;
        }
        else {
          this.snackBar.open("Unexpected Firebase error! ❌", "Dismiss");
        }
      });
  }

  async navigateToDashboard() {
    const user = await this.isLoggedIn();
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      user?.getIdToken().then((token: string | string[]) => {
        localStorage.setItem('token', JSON.stringify(token));
        this.router.navigate(['dashboard']);
      })
    } else {
      console.log("NavigateToDashboard null");
    }
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
            this.navigateToDashboard();
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
