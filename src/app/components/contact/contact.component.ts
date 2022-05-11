import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  name!: string;
  email!: string;
  message!: string;

  isNameValid: boolean = true;
  isEmailValid: boolean = true;
  isMessageValid: boolean = true;

  constructor(public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmitContactForm(): void {
    this.resetFlags();

    // Null check
    if(this.name == null) {
      this.isNameValid = false;
    }
    if (this.email == null) {
      this.isEmailValid = false;
    }
    if (this.message == null) {
      this.isMessageValid = false;
    }

    // Validation
    if(this.isNameValid) {
      const nameRegexExp = /^[a-zA-Z\- \’']+$/;
      this.isNameValid = nameRegexExp.test(this.name) && this.name.trim().length > 1;
    }
    if(this.isEmailValid) {
      const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
      this.isEmailValid = emailRegexExp.test(this.email);
    }
    if(this.isMessageValid) {
      this.isMessageValid = this.message.trim().length > 1;
    }

    if(this.isNameValid && this.isEmailValid && this.isMessageValid) { 
      this.snackBar.open('Message successfully submitted.', '', {
        duration: 4000,
        panelClass: ['snackbar']
      });
    }
  }

  resetFlags(): void {
    this.isNameValid = true;
    this.isEmailValid = true;
    this.isMessageValid = true;
  }
}
