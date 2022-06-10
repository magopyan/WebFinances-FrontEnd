import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Subcategory } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { TransactionForm } from 'src/app/models/transaction-form';
import { AccountService } from 'src/app/services/account.service';
import { SelectedService } from 'src/app/services/selected.service';
import { StaticDataService } from 'src/app/services/static-data.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {

  amount!: any;
  date: Date = new Date();
  note!: string;

  allAccounts!: Account[];
  chosenAccount: any;
  subcategories!: Subcategory[];
  chosenSubcategory: any;

  isAmountValid: boolean = true;
  isDateValid: boolean = true;
  isNoteValid: boolean = true;

  newTransaction!: Transaction;
  firstStepCompleted: boolean = false;
  secondStepCompleted: boolean = false;

  constructor(private router: Router, private staticDataService: StaticDataService, private validationService: ValidationService,
    public snackBar: MatSnackBar, private selectedService: SelectedService, private accountService: AccountService,
    private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.getSubcategories();
    this.getAccounts();
    this.selectedService.getSubcategory().subscribe(
      (subcategory) => this.chosenSubcategory = subcategory);
    this.selectedService.getAccount().subscribe(
      (account) => this.chosenAccount = account);
  }

  getSubcategories(): void {
    this.staticDataService.getIncomeSubcategories().subscribe({
      next: (response: Subcategory[]) => {
        this.subcategories = response;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(`Server error. Code ${error.status} ❌`, "Dismiss");
      }
    })
  }

  getAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: (response: Account[]) => {
        this.allAccounts = response;
      },
      error: (error: HttpErrorResponse) => {
        if (!this.snackBar._openedSnackBarRef) {
          this.snackBar.open("Server error when retrieving accounts. Please try to sign in again. ❌", "Dismiss");
        }
      }
    })
  }

  onCloseStepper(): void {
    this.router.navigate(['/dashboard']);
  }

  onStepBack(stepper: MatStepper): void {
    stepper.selectedIndex = stepper.selectedIndex - 1;
  }

  onSubmitFirstStep(stepper: MatStepper) {
    if (this.chosenSubcategory == null) {
      return;
    }
    else {
      this.firstStepCompleted = true;
      stepper!.selected!.completed = true;
      stepper!.next();
    }
  }

  onSubmitSecondStep(stepper: MatStepper) {
    if (this.chosenAccount == null) {
      return;
    }
    else {
      this.secondStepCompleted = true;
      stepper!.selected!.completed = true;
      stepper!.next();
    }
  }

  onCreateTransaction(stepper: MatStepper) {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();

    let dateFormatted = this.date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })

    if (this.isAmountValid && this.isDateValid && this.isNoteValid) {
      const transactionForm: TransactionForm = {
        amount: this.amount,
        date: dateFormatted,
        note: this.note
      }
      console.log(transactionForm.date);
      this.validationService.postTransactionForm(transactionForm).subscribe({
        next: (response: Object) => {
          this.newTransaction = {
            amount: this.amount,
            date: dateFormatted,
            note: this.note,
            subcategory: this.chosenSubcategory,
            account: this.chosenAccount
          }
          this.transactionService.addTransaction(this.newTransaction).subscribe({
            next: (response: Transaction) => {
              this.snackBar.open("Transaction saved successfully! ✔️", '', {
                duration: 4000,
                panelClass: ['snackbar']
              });
              this.router.navigate(['dashboard']);
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.open(error.message + " ❌", "Dismiss");
            }
          })
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.handleServerErrors(errorResponse);
        }
      })
    }
  }

  handleServerErrors(errorResponse: HttpErrorResponse) {
    if (errorResponse.status == 406) {
      const errorsMap = new Map<string, string>(Object.entries(errorResponse.error));
      if (errorsMap.has("amount")) {
        this.isAmountValid = false;
        document.getElementById("error-amount")!.textContent = errorsMap.get("amount")!;
      }
      if (errorsMap.has("date")) {
        this.isDateValid = false;
        document.getElementById("error-date")!.textContent = errorsMap.get("date")!;
      }
      if (errorsMap.has("note")) {
        this.isNoteValid = false;
        document.getElementById("error-note")!.textContent = errorsMap.get("note")!;
      }
    }
    else {
      this.snackBar.open("Server error. ❌", "Dismiss");
    }
  }

  clientSideValidate() {
    if (this.amount == null) {
      this.isAmountValid = false;
    }
    if (this.date == null) {
      this.isDateValid = false;
    }

    if (this.isAmountValid) {
      this.amount = this.amount.replace(/\s+/g, '');
      const balanceRegexExp = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;
      if (!balanceRegexExp.test(this.amount)) {
        this.isAmountValid = false;
      }
      else {
        this.amount = Number(this.amount).toFixed(2);
      }
    }
    if (this.isDateValid) {
      if (this.date.getTime() == NaN) {
        this.isDateValid = false;
      }
    }
    if (this.isNoteValid) {
      if (this.note?.length > 64) {
        this.isNoteValid = false;
      }
    }
  }

  resetFlagsAndErrorMessages(): void {
    this.isAmountValid = true;
    this.isDateValid = true;
    this.isNoteValid = true;
  }
}
