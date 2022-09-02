import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'src/app/models/account';
import { AccountType } from 'src/app/models/account-type';
import { AccountService } from 'src/app/services/account.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { StaticDataService } from 'src/app/services/static-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ValidationService } from 'src/app/services/validation.service';
import { AccountForm } from 'src/app/models/account-form';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  currentPageNumber: number = 1;
  itemsPerPage: number = 9;

  totalBalance: number = 0;
  allAccounts!: Account[];
  accounts!: Account[];

  accountDelete!: Account;
  @ViewChild('dialogRefDelete') dialogRefDelete!: TemplateRef<any>;

  editAccount!: Account;
  accountTypes!: AccountType[];
  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;
  isNameValid: boolean = true;
  isBalanceValid: boolean = true;
  isAccountTypeValid: boolean = true;

  constructor(private firebaseAuthService: FirebaseAuthService, private accountService: AccountService,
    public snackBar: MatSnackBar, private staticDataService: StaticDataService, public dialog: MatDialog,
    private validationService: ValidationService, private router: Router, private transactionService: TransactionService) {
    //this.currentPageNumber = this.router.getCurrentNavigation()?.extras?.state?.['pageNumber'];
  }

  ngOnInit(): void {
    console.log("AccountsComponent onInit()");
    this.getAccounts(this.currentPageNumber);
    this.getAccountTypes();
  }

  getAccounts(pageNumber: number): void {
    this.accountService.getAccounts(pageNumber - 1).subscribe({
      next: (response: Account[]) => {
        this.accounts = response;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Server error when retrieving accounts. Please try to sign in again. ❌", "Dismiss");
      }
    })
    this.accountService.getAllAccounts().subscribe({
      next: (response: Account[]) => {
        this.totalBalance = 0;
        this.allAccounts = response;
        for (let i = 0; i < this.allAccounts.length; i++) {
          this.totalBalance += this.allAccounts[i].balance;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Server error when retrieving accounts. Please try to sign in again. ❌", "Dismiss");
      }
    })
  }

  getTotalBalance() {
    return Number(this.totalBalance).toFixed(2);
  }

  isTotalBalancePositive(): boolean {
    return this.totalBalance > 0;
  }

  pageChanged(newPage: number): void {
    this.accountService.getAccounts(newPage - 1).subscribe({
      next: (response: Account[]) => {
        this.accounts = response;
        this.currentPageNumber = newPage;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Server error when retrieving accounts. Please try to sign in again. ❌", "Dismiss");
      }
    })
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

  onOpenDeleteDialog(account: Account) {
    this.accountDelete = account;
    this.transactionService.getTransactionsByAccountId(this.accountDelete.id!).subscribe({
      next: (response: Transaction[]) => {
        this.dialog.open(this.dialogRefDelete, { width: '400px', panelClass: 'custom-modalbox' });
        if (response.length > 0) {
          document.getElementById("deleteDialogText")!.textContent = `Are you sure you want to delete account ${this.accountDelete.name}
            and all of its ${response.length} transactions?`;
        }
        else {
          document.getElementById("deleteDialogText")!.textContent = `Are you sure you want to delete account ${this.accountDelete.name}?`;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Server error when retrieving the transactions of account"
          + this.accountDelete.name + ". ❌", "Dismiss");
      }
    })

  }

  onDeleteAccount() {
    let pageEmpty: boolean = this.accounts.length <= 1 && this.currentPageNumber > 1;
    this.accountService.deleteAccount(this.accountDelete).subscribe({
      next: (response: void) => {
        this.snackBar.open('Account deleted successfully.', '', {
          duration: 4000,
          panelClass: ['snackbar']
        });
        if (pageEmpty) {
          console.log("Page empty, go 1 back");
          this.getAccounts(this.currentPageNumber - 1);
        }
        else {
          console.log("Page not empty, stay");
          this.getAccounts(this.currentPageNumber);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Error when deleting account. ❌", "Dismiss");
      }
    })
    this.dialog.closeAll();
  }


  // EDIT ACCOUNT
  ////////////////////////////////////////////////////////////////////////
  onOpenEditDialog(account: Account): void {
    this.editAccount = Object.assign({}, account); // clone account so that it doesn't change in the account view as I edit
    this.dialog.open(this.dialogRef, { data: account.name, width: '500px', panelClass: 'custom-modalbox' });
  }

  // Used to automatically select the option from Select matching the editAccount.accountType
  compareById(itemOne: any, itemTwo: any) {
    return itemOne && itemTwo && itemOne.id == itemTwo.id;
  }

  onSubmitEditForm() {
    this.resetFlagsAndErrorMessages();
    this.clientSideValidate();
    console.log(this.editAccount);

    if (this.isNameValid && this.isBalanceValid && this.isAccountTypeValid) {
      const accountForm: AccountForm = {
        name: this.editAccount.name,
        balance: this.editAccount.balance.toString()
      }
      this.validationService.postAccountForm(accountForm).subscribe({
        next: (response: Object) => {
          console.log("Post account edit form success");
          this.resetFlagsAndErrorMessages();
          this.accountService.editAccount(this.editAccount).subscribe({
            next: (response: Account) => {
              this.dialog.closeAll();
              this.getAccounts(this.currentPageNumber);
            },
            error: (error: HttpErrorResponse) => {
              if (error.status == 500) {
                this.snackBar.open("The account name must be unique! ❌", "Dismiss");
              }
              else {
                this.snackBar.open(error.message + " ❌", "Dismiss");
              }
            }
          })
        },
        error: (errorResponse: HttpErrorResponse) => {
          console.log("Post account edit form fail");
          this.handleServerErrors(errorResponse);
        }
      })
    }
  }

  clientSideValidate() {
    if (this.editAccount.name == null) {
      this.isNameValid = false;
    }
    if (this.editAccount.balance == null) {
      this.isBalanceValid = false;
    }
    if (this.editAccount.accountType == null) {
      this.isAccountTypeValid = false;
    }

    if (this.isNameValid) {
      if (this.isNameValid && (this.editAccount.name.length < 2 || this.editAccount.name.length > 32)) {
        this.isNameValid = false;
        document.getElementById("error-name")!.textContent = "The account name has to be between 2 and 32 characters long!";
      }
    }
    if (this.isBalanceValid) {
      let balance = this.editAccount.balance.toString();
      balance = balance.replace(/\s+/g, '');
      const balanceRegexExp = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;
      if (!balanceRegexExp.test(balance)) {
        this.isBalanceValid = false;
      }
    }
  }

  handleServerErrors(errorResponse: HttpErrorResponse) {
    if (errorResponse.status == 406) {
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

  resetFlagsAndErrorMessages(): void {
    this.isNameValid = true;
    this.isBalanceValid = true;
    this.isAccountTypeValid = true;

    document.getElementById("error-name")!.textContent = "Please enter a name for your account!";
  }
}
