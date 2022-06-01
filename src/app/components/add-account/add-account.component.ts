import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { AccountForm } from 'src/app/models/account-form';
import { AccountType } from 'src/app/models/account-type';
import { AccountService } from 'src/app/services/account.service';
import { SelectAccountTypeService } from 'src/app/services/select-account-type.service';
import { StaticDataService } from 'src/app/services/static-data.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {

  accountType!: AccountType;
  name!: string;
  balance!: string;

  isNameValid: boolean = true;
  isBalanceValid: boolean = true;

  accountTypes!: AccountType[];
  chosenAccountType: any;

  newAccount!: Account;

  firstStepCompleted: boolean = false;
  secondStepCompleted: boolean = false;

  currentUser: any;

  constructor(private router: Router, private staticDataService: StaticDataService, private validationService: ValidationService,
    public snackBar: MatSnackBar, private selectAccountTypeService: SelectAccountTypeService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getAccountTypes();
    this.selectAccountTypeService.getAccountType().subscribe(
      (accountType) => this.chosenAccountType = accountType);
  }

  getAccountTypes(): void {
    this.staticDataService.getAccountTypes().subscribe({
      next: (response: AccountType[]) => {
        this.accountTypes = response;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(`Server error. Code ${error.status} ❌`, "Dismiss");
      }
    })
  }

  onCloseStepper(): void {
    this.router.navigate(['/accounts']);
  }

  onStepBack(stepper: MatStepper): void {
    stepper.selectedIndex = stepper.selectedIndex - 1;
  }

  onSubmitFirstStep(stepper: MatStepper) {
    if (this.chosenAccountType == null) {
      return;
    }
    else {
      this.firstStepCompleted = true;
      stepper.selectedIndex = 1;
    }
  }

  onSubmitSecondStep(stepper: MatStepper) {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();

    if (this.isNameValid && this.isBalanceValid) {
      const accountForm: AccountForm = {
        name: this.name,
        balance: this.balance
      }

      this.validationService.postAccountForm(accountForm).subscribe({
        next: (response: Object) => {
          this.resetFlagsAndErrorMessages();
          this.newAccount = {
            name: this.name,
            balance: parseFloat(this.balance),
            accountType: this.chosenAccountType
          }
          this.secondStepCompleted = true;
          stepper.selectedIndex = 2;
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.handleServerErrors(errorResponse);
        }
      })
    }
  }

  onCreateAccount(stepper: MatStepper) {
    this.accountService.addAccount(this.newAccount).subscribe({
      next: (response: Account) => {
        this.snackBar.open("Account saved successfully! ✔️", '', {
          duration: 4000,
          panelClass: ['snackbar']
        });
        this.router.navigate(['accounts']);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.message + " ❌", "Dismiss");
      }
    })
  }

  handleServerErrors(errorResponse: HttpErrorResponse) {
    if (errorResponse.status == 400) {
      const errorsMap = new Map<string, string>(Object.entries(errorResponse.error));
      if (errorsMap.has("name")) {
        this.isNameValid = false;
        document.getElementById("error-name")!.textContent = errorsMap.get("name")!;
      }
      if (errorsMap.has("balance")) {
        this.isBalanceValid = false;
        document.getElementById("error-balance")!.textContent = errorsMap.get("balance")!;
      }
    }
    else {
      this.snackBar.open("Server error. ❌", "Dismiss");
    }
  }

  clientSideValidate() {
    if (this.name == null) {
      this.isNameValid = false;
    }
    if (this.balance == null) {
      this.isBalanceValid = false;
    }

    if (this.isNameValid) {
      if (this.isNameValid && (this.name.length < 2 || this.name.length > 32)) {
        this.isNameValid = false;
        document.getElementById("error-name")!.textContent = "The account name has to be between 2 and 32 characters long!";
      }
    }

    if (this.isBalanceValid) {
      this.balance = this.balance.replace(/\s+/g, '');
      const balanceRegexExp = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;
      if (!balanceRegexExp.test(this.balance)) {
        this.isBalanceValid = false;
      }
      else {
        this.balance = Number(this.balance).toFixed(2);
      }
    }
  }

  resetFlagsAndErrorMessages(): void {
    this.isNameValid = true;
    this.isBalanceValid = true;

    document.getElementById("error-name")!.textContent = "Please enter a name for your account!";
  }
}
