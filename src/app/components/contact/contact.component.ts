import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidationService } from 'src/app/services/validation.service';
import { ContactForm } from 'src/app/models/contact-form';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(public snackBar: MatSnackBar, private contactService: ValidationService) { }

  ngOnInit(): void {
  }

  onSubmitContactForm(): void {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();

    // Back End Validation
    if (this.isNameValid && this.isEmailValid && this.isMessageValid) {
      const contactForm: ContactForm = {
        name: this.name,
        email: this.email,
        message: this.message
      }

      this.contactService.postContactForm(contactForm).subscribe({
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
    // Null check
    if (this.name == null) {
      this.isNameValid = false;
    }
    if (this.email == null) {
      this.isEmailValid = false;
    }
    if (this.message == null) {
      this.isMessageValid = false;
    }

    // Validation
    if (this.isNameValid) {
      const nameRegexExp = /^[a-zA-Z\- \’']+$/;
      this.isNameValid = nameRegexExp.test(this.name) && this.name.trim().length > 1;
      if (this.isNameValid && this.name.length > 64) {
        this.isNameValid = false;
        document.getElementById("error-name")!.textContent = "Your name should be 64 or less characters long!";
      }
    }
    if (this.isEmailValid) {
      const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
      this.isEmailValid = emailRegexExp.test(this.email);
    }
    if (this.isMessageValid) {
      this.isMessageValid = this.message.trim().length > 1;
      if (this.isMessageValid && this.message.length > 1024) {
        this.isMessageValid = false;
        document.getElementById("error-message")!.textContent = "The message is too long!";
      }
    }
  }

  handleServerErrors(errorResponse: HttpErrorResponse) {
    if (errorResponse.status == 400) {
      const errorsMap = new Map<string, string>(Object.entries(errorResponse.error));
      if (errorsMap.has("name")) {
        this.isNameValid = false;
        document.getElementById("error-name")!.textContent = errorsMap.get("name")!;
      }
      if (errorsMap.has("email")) {
        this.isEmailValid = false;
        document.getElementById("error-email")!.textContent = errorsMap.get("email")!;
      }
      if (errorsMap.has("message")) {
        this.isMessageValid = false;
        document.getElementById("error-message")!.textContent = errorsMap.get("message")!;
      }
    }
    else {
      this.snackBar.open("Unexpected error. ❌", "Dismiss");
    }
  }

  resetFlagsAndErrorMessages(): void {
    this.isNameValid = true;
    this.isEmailValid = true;
    this.isMessageValid = true;

    document.getElementById("error-name")!.textContent = "Please enter your name!";
    document.getElementById("error-message")!.textContent = "Please leave us a message!";
  }
}
