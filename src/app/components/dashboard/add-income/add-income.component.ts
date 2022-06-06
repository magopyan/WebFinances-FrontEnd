import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { Subcategory } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
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
  date!: string;
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
      stepper.selectedIndex = 1;
    }
  }

  onSubmitSecondStep(stepper: MatStepper) {
    if (this.chosenAccount == null) {
      return;
    }
    else {
      this.secondStepCompleted = true;
      stepper.selectedIndex = 2;
    }
  }

  onCreateTransaction(stepper: MatStepper) {
  }
}
