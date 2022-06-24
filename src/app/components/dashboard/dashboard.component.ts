import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Transaction } from 'src/app/models/transaction';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { StaticDataService } from 'src/app/services/static-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ValidationService } from 'src/app/services/validation.service';
import { Category, Subcategory } from 'src/app/models/category';
import { TransactionService } from 'src/app/services/transaction.service';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';
import { TransactionForm } from 'src/app/models/transaction-form';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentPageNumber = 1;
  itemsPerPage = 14;
  allTransactions!: Transaction[];
  transactions!: Transaction[];

  adjustAccountBalance: boolean = false;
  transactionDelete!: Transaction;
  @ViewChild('dialogRefDelete') dialogRefDelete!: TemplateRef<any>;
  @ViewChild('dialogRefViewIncome') dialogRefViewIncome!: TemplateRef<any>;
  @ViewChild('dialogRefViewExpense') dialogRefViewExpense!: TemplateRef<any>;

  startDate!: Date | string;
  endDate!: Date | string;
  dateRangeSet: boolean = false;

  // editTransaction!: Transaction;
  // categories!: Category[];
  // incomeSubcategories!: Subcategory[];
  // allAccounts!: Account[];

  // oldTransactionAmount!: number;
  // oldTransactionAccount!: Account;
  //@ViewChild('dialogRefIncome') dialogRefIncome!: TemplateRef<any>;
  //@ViewChild('dialogRefExpense') dialogRefExpense!: TemplateRef<any>;
  // isNoteValid: boolean = true;
  // isAmountValid: boolean = true;
  // isDateValid: boolean = true;
  // isSubcategoryValid: boolean = true;
  // isAccountValid: boolean = true;

  constructor(private firebaseAuthService: FirebaseAuthService, private transactionService: TransactionService,
    public dialog: MatDialog, public snackBar: MatSnackBar, private staticDataService: StaticDataService,
    private validationService: ValidationService, private accountService: AccountService) { }

  ngOnInit(): void {
    console.log("DashboardComponent onInit()");
    this.getTransactions(this.currentPageNumber);
    // this.getCategories();
    // this.getSubcategories();
    // this.getAllAccounts();
  }

  getTransactions(pageNumber: number): void {
    this.transactionService.getTransactions(pageNumber - 1).subscribe({
      next: (response: Transaction[]) => {
        this.transactions = response;
      },
      error: (error: HttpErrorResponse) => {
        if (!this.snackBar._openedSnackBarRef) {
          this.snackBar.open(`Server error when retrieving transactions page ${this.currentPageNumber}. Please try to sign in again. ❌`, "Dismiss");
        }
      }
    })
    this.transactionService.getAllTransactions().subscribe({
      next: (response: Transaction[]) => {
        this.allTransactions = response;
      },
      error: (error: HttpErrorResponse) => {
        if (!this.snackBar._openedSnackBarRef) {
          this.snackBar.open("Server error when retrieving transactions. Please try to sign in again. ❌", "Dismiss");
        }
      }
    })
  }

  filterByDateRange() {
    this.transactionService.getAllTransactions().subscribe({
      next: (response: Transaction[]) => {
        this.allTransactions = response;
        this.dateRangeSet = true;
        let startDate: Date = new Date(this.startDate);
        let endDate: Date = new Date(this.endDate);

        this.allTransactions = this.allTransactions.filter(tran =>
          this.parseDate(tran.date).getTime() >= startDate.getTime() && this.parseDate(tran.date).getTime() <= endDate.getTime());

        let size = this.allTransactions.length;
        if (size > this.itemsPerPage) {
          this.transactions = this.allTransactions.slice(0, this.itemsPerPage);
        }
        else {
          this.transactions = this.allTransactions;
        }
        this.currentPageNumber = 1;

      },
      error: (error: HttpErrorResponse) => {
        if (!this.snackBar._openedSnackBarRef) {
          this.snackBar.open("Server error when retrieving transactions. Please try to sign in again. ❌", "Dismiss");
        }
      }
    })
  }

  parseDate(dateString: string): Date {
    let parts = dateString.split("-");
    var mydate = new Date(Number.parseInt(parts[0]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[2]));
    return mydate;
  }

  resetDateRange() {
    this.dateRangeSet = false;
    this.startDate = "";
    this.endDate = "";
    this.pageChanged(1);
  }

  viewTransaction(transaction: Transaction) {
    if (transaction.subcategory.category.categoryType.coefficient == 1) {
      this.dialog.open(this.dialogRefViewIncome, {
        data:
        {
          transaction: transaction,
          date: new Date(transaction.date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        },
        width: '500px', panelClass: 'custom-modalbox'
      });
    }
    if (transaction.subcategory.category.categoryType.coefficient == -1) {
      this.dialog.open(this.dialogRefViewExpense, { data: transaction, width: '500px', panelClass: 'custom-modalbox' });
    }
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionDelete = transaction;
    this.dialog.open(this.dialogRefDelete, { width: '400px', panelClass: 'custom-modalbox' });
  }

  onDeleteTransaction() {
    console.log(this.adjustAccountBalance);
    let pageEmpty: boolean = this.transactions.length <= 1 && this.currentPageNumber > 1;
    this.transactionService.deleteTransaction(this.transactionDelete).subscribe({
      next: (response: void) => {
        if (this.adjustAccountBalance) {
          this.updateAccount();
        }
        this.snackBar.open('Transaction deleted successfully.', '', {
          duration: 4000,
          panelClass: ['snackbar']
        });
        this.dialog.closeAll();
        if (pageEmpty) {
          this.getTransactions(this.currentPageNumber - 1);
        }
        else {
          this.getTransactions(this.currentPageNumber);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Error when deleting transaction. ❌", "Dismiss");
      }
    })
  }

  updateAccount(): boolean {
    console.log("Update account >:(");
    // for delete
    let amount = this.transactionDelete.amount;
    let balance = this.transactionDelete.account.balance;
    let isError: boolean = false;
    if (amount == 0) {
      return true;
    }
    else {
      if (amount > 0) {
        balance = balance - amount;
        this.transactionDelete.account.balance = balance;
      }
      else if (amount < 0) {
        balance = balance + amount;
        this.transactionDelete.account.balance = balance;
      }
      this.accountService.editAccount(this.transactionDelete.account).subscribe({
        next: (response: Account) => { },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open("Updating account balance failed! ❌", "Dismiss");
          isError = true;
        }
      })
      return (isError ? false : true);
    }
  }

  pageChanged(newPage: number): void {
    if (this.dateRangeSet) {
      let from = (newPage-1) * this.itemsPerPage;
      let to = from + this.itemsPerPage;
      let size = this.allTransactions.length;
      if (size >= to) {
        this.transactions = this.allTransactions.slice(from, to);
      }
      else {
        this.transactions = this.allTransactions.slice(from);
      }
      this.currentPageNumber = newPage;
    }
    else {
      this.transactionService.getTransactions(newPage - 1).subscribe({
        next: (response: Transaction[]) => {
          this.transactions = response;
          this.currentPageNumber = newPage;
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open("Server error when retrieving transactions. Please try to sign in again. ❌", "Dismiss");
        }
      })
    }
  }

  // getAllAccounts() {
  //   this.accountService.getAllAccounts().subscribe({
  //     next: (response: Account[]) => {
  //       this.allAccounts = response;
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       if (!this.snackBar._openedSnackBarRef) {
  //         this.snackBar.open("Server error when retrieving accounts. Please try to sign in again. ❌", "Dismiss");
  //       }
  //     }
  //   })
  // }

  // getCategories(): void {
  //   this.staticDataService.getCategories().subscribe({
  //     next: (response: Category[]) => {
  //       this.categories = response;
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.snackBar.open(`Server error. Code ${error.status} ❌`, "Dismiss");
  //     }
  //   })
  // }

  // getSubcategories(): void {
  //   this.staticDataService.getIncomeSubcategories().subscribe({
  //     next: (response: Subcategory[]) => {
  //       this.incomeSubcategories = response;
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       this.snackBar.open(`Server error. Code ${error.status} ❌`, "Dismiss");
  //     }
  //   })
  // }


  // onOpenIncomeEditDialog(transaction: Transaction): void {
  //   this.oldTransactionAmount = transaction.amount;
  //   this.oldTransactionAccount = transaction.account;
  //   this.editTransaction = Object.assign({}, transaction); // clone transaction so that it doesn't change in the transaction view as I edit
  //   this.dialog.open(this.dialogRefIncome, { width: '500px', panelClass: 'custom-modalbox' });
  // }

  // // Used to automatically select the option from Select matching the editTransaction.accountType
  // compareById(itemOne: any, itemTwo: any) {
  //   return itemOne && itemTwo && itemOne.id == itemTwo.id;
  // }

  // onSubmitIncomeEditForm() {
  //   this.resetFlagsAndErrorMessages();
  //   this.clientSideValidate();
  //   console.log(this.editTransaction);

  //   // if ((document.getElementById('adjust') as HTMLInputElement).checked) {
  //   //   this.adjustAccountBalance = true;
  //   // }
  //   // else {
  //   //   this.adjustAccountBalance = false;
  //   // }

  //   if (this.isAccountValid && this.isAmountValid && this.isDateValid && this.isSubcategoryValid && this.isNoteValid) {
  //     const transactionForm: TransactionForm = {
  //       amount: this.editTransaction.amount.toString(),
  //       note: this.editTransaction.note,
  //       date: this.editTransaction.date
  //     }
  //     this.validationService.postTransactionForm(transactionForm).subscribe({
  //       next: (response: Object) => {
  //         this.resetFlagsAndErrorMessages();
  //         this.transactionService.editTransaction(this.editTransaction).subscribe({
  //           next: (response: Transaction) => {
  //             this.dialog.closeAll();
  //             this.updateAccount();
  //             this.getTransactions(this.currentPageNumber);
  //           },
  //           error: (error: HttpErrorResponse) => {
  //             this.snackBar.open(error.message + " ❌", "Dismiss");
  //           }
  //         })
  //       },
  //       error: (errorResponse: HttpErrorResponse) => {
  //         this.handleServerErrors(errorResponse);
  //       }
  //     })
  //   }
  // }

  // updateAccount(): boolean {
  //   console.log("Update account >:(");
  //   // for delete
  //   let amount = this.transactionDelete.amount;
  //   let balance = this.transactionDelete.account.balance;
  //   let isError: boolean = false;
  //   if (amount == 0) {
  //     return true;
  //   }
  //   else {
  //     if (amount > 0) {
  //       balance = balance - amount;
  //       this.transactionDelete.account.balance = balance;
  //     }
  //     else if (amount < 0) {
  //       balance = balance + amount;
  //       this.transactionDelete.account.balance = balance;
  //     }
  //     this.accountService.editAccount(this.transactionDelete.account).subscribe({
  //       next: (response: Account) => { },
  //       error: (error: HttpErrorResponse) => {
  //         this.snackBar.open("Updating account balance failed! ❌", "Dismiss");
  //         isError = true;
  //       }
  //     })
  //     return (isError ? false : true);
  //   }

  //   // FOR EDIT !!!!!!!!!!!!!------------------------------------------------
  //   // if (this.oldTransactionAccount == this.editTransaction.account && this.oldTransactionAmount == this.editTransaction.amount) {
  //   //   return;
  //   // }
  //   // else if (this.oldTransactionAccount == this.editTransaction.account && this.oldTransactionAmount != this.editTransaction.amount) {
  //   //   let currentBalance: number = this.editTransaction.account.balance;
  //   //   currentBalance -= this.oldTransactionAmount;
  //   //   currentBalance += this.editTransaction.amount;
  //   //   this.editTransaction.account.balance = currentBalance;
  //   //   this.accountService.editAccount(this.editTransaction.account).subscribe({
  //   //     next: (response: Account) => { },
  //   //     error: (error: HttpErrorResponse) => {
  //   //       this.snackBar.open("Updating account balance failed! ❌", "Dismiss");
  //   //     }
  //   //   })
  //   // }
  //   // else {
  //   //   let oldAccount = this.oldTransactionAccount;
  //   //   let newAccount = this.editTransaction.account;
  //   //   oldAccount.balance -= this.oldTransactionAmount;
  //   //   newAccount.balance += this.editTransaction.amount;
  //   //   this.accountService.editAccount(oldAccount).subscribe({
  //   //     next: (response: Account) => { },
  //   //     error: (error: HttpErrorResponse) => {
  //   //       this.snackBar.open("Updating account balance failed! ❌", "Dismiss");
  //   //     }
  //   //   })
  //   //   this.accountService.editAccount(newAccount).subscribe({
  //   //     next: (response: Account) => { },
  //   //     error: (error: HttpErrorResponse) => {
  //   //       this.snackBar.open("Updating account balance failed! ❌", "Dismiss");
  //   //     }
  //   //   })
  //   // }
  // }

  // clientSideValidate() {
  //   if (this.editTransaction.amount == null) {
  //     this.isAmountValid = false;
  //   }
  //   if (this.editTransaction.date == null) {
  //     this.isDateValid = false;
  //   }
  //   if (this.editTransaction.account == null) {
  //     this.isAccountValid = false;
  //   }
  //   if (this.editTransaction.subcategory == null) {
  //     this.isSubcategoryValid = false;
  //   }
  //   if (this.isAmountValid) {
  //     let amount = this.editTransaction.amount.toString();
  //     amount = amount.replace(/\s+/g, '');
  //     const balanceRegexExp = /^\s*-?[1-9]\d*(\.?\d{1,2})?\s*$/;
  //     if (!balanceRegexExp.test(amount)) {
  //       this.isAmountValid = false;
  //     }
  //     else {
  //       this.editTransaction.amount = Number(amount);
  //     }
  //   }
  //   if (this.isDateValid) {
  //     let date = new Date(this.editTransaction.date);
  //     if (date.getTime() == NaN) {
  //       this.isDateValid = false;
  //     }
  //   }
  //   if (this.isNoteValid) {
  //     if (this.editTransaction.note?.length > 64) {
  //       this.isNoteValid = false;
  //     }
  //   }
  // }

  // handleServerErrors(errorResponse: HttpErrorResponse) {
  //   if (errorResponse.status == 406) {
  //     const errorsMap = new Map<string, string>(Object.entries(errorResponse.error));
  //     if (errorsMap.has("amount")) {
  //       this.isAmountValid = false;
  //       document.getElementById("error-amount")!.textContent = errorsMap.get("amount")!;
  //     }
  //     if (errorsMap.has("date")) {
  //       this.isDateValid = false;
  //       document.getElementById("error-date")!.textContent = errorsMap.get("date")!;
  //     }
  //     if (errorsMap.has("note")) {
  //       this.isNoteValid = false;
  //       document.getElementById("error-note")!.textContent = errorsMap.get("note")!;
  //     }
  //   }
  //   else {
  //     this.snackBar.open("Server error. ❌", "Dismiss");
  //   }
  // }

  // resetFlagsAndErrorMessages(): void {
  //   this.isAmountValid = true;
  //   this.isDateValid = true;
  //   this.isNoteValid = true;
  //   this.isAccountValid = true;
  //   this.isSubcategoryValid = true;
  // }
}
