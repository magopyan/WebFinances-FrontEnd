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
  itemsPerPage = 15;
  allTransactions!: Transaction[];
  transactionsPage!: Transaction[];

  adjustAccountBalance: boolean = false;
  transactionDelete!: Transaction;
  @ViewChild('dialogRefDelete') dialogRefDelete!: TemplateRef<any>;
  @ViewChild('dialogRefViewIncome') dialogRefViewIncome!: TemplateRef<any>;
  @ViewChild('dialogRefViewExpense') dialogRefViewExpense!: TemplateRef<any>;

  startDate!: Date | string;
  endDate!: Date | string;
  dateRangeSet: boolean = false;

  constructor(private firebaseAuthService: FirebaseAuthService, private transactionService: TransactionService,
    public dialog: MatDialog, public snackBar: MatSnackBar, private staticDataService: StaticDataService,
    private validationService: ValidationService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getTransactions(this.currentPageNumber);
  }

  getTransactions(pageNumber: number): void {
    this.transactionService.getTransactions(pageNumber - 1).subscribe({
      next: (response: Transaction[]) => {
        this.transactionsPage = response;
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

  getTransactionsByDateRange(pageNumber: number, startDate: string, endDate: string) {
    this.transactionService.getTransactionsByDateRange(pageNumber - 1, startDate, endDate).subscribe({
      next: (response: Transaction[]) => {
        this.transactionsPage = response;
      },
      error: (error: HttpErrorResponse) => {
        if (!this.snackBar._openedSnackBarRef) {
          this.snackBar.open(`Server error when retrieving transactions page ${this.currentPageNumber}. Please try to sign in again. ❌`, "Dismiss");
        }
      }
    })
    this.transactionService.getAllTransactionsByDateRange(startDate, endDate).subscribe({
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
    this.dateRangeSet = true;
    this.currentPageNumber = 1;
    this.getTransactionsByDateRange(1, this.parseDate(this.startDate as Date), this.parseDate(this.endDate as Date));
  }

  parseDate(date: Date): string {
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  resetDateRange() {
    this.dateRangeSet = false;
    this.currentPageNumber = 1;
    this.startDate = "";
    this.endDate = "";
    this.getTransactions(1);
  }

  viewTransaction(transaction: Transaction) {
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

deleteTransaction(transaction: Transaction) {
  this.transactionDelete = transaction;
  this.dialog.open(this.dialogRefDelete, { width: '400px', panelClass: 'custom-modalbox' });
}

onDeleteTransaction() {
  console.log(this.adjustAccountBalance);
  let pageEmpty: boolean = this.transactionsPage.length <= 1 && this.currentPageNumber > 1;
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
  // for delete
  let amount = this.transactionDelete.amount;
  let balance = this.transactionDelete.account.balance;
  console.log("starting balance:", balance);
  let isError: boolean = false;
  if (amount == 0) {
    return true;
  }
  else {
    let coefficient: number = this.transactionDelete.subcategory.category.categoryType.coefficient;
    console.log("coeff:", coefficient);
    if(coefficient == -1) {
      balance = balance + amount;
    }
    else {
      balance = balance - amount;
    }
    this.transactionDelete.account.balance = balance;
    console.log("new balance:", balance);
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
  if(this.dateRangeSet) {
  this.transactionService.getTransactionsByDateRange(newPage - 1,
    this.parseDate(this.startDate as Date), this.parseDate(this.endDate as Date)).subscribe({
      next: (response: Transaction[]) => {
        this.transactionsPage = response;
        this.currentPageNumber = newPage;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Server error when retrieving transactions. Please try to sign in again. ❌", "Dismiss");
      }
    })
}
    else {
  this.transactionService.getTransactions(newPage - 1).subscribe({
    next: (response: Transaction[]) => {
      this.transactionsPage = response;
      this.currentPageNumber = newPage;
    },
    error: (error: HttpErrorResponse) => {
      this.snackBar.open("Server error when retrieving transactions. Please try to sign in again. ❌", "Dismiss");
    }
  })
}
  }
}
