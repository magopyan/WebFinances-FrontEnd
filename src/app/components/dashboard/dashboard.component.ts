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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentPageNumber = 1;
  itemsPerPage = 15;
  allTransactions!: Transaction[];
  transactions!: Transaction[];

  editTransaction!: Transaction;
  categories!: Category[];
  subcategories!: Subcategory[];
  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;
  // isNameValid: boolean = true;
  // isBalanceValid: boolean = true;
  // isTransactionTypeValid: boolean = true;

  constructor(private firebaseAuthService: FirebaseAuthService, private transactionService: TransactionService, public dialog: MatDialog,
    public snackBar: MatSnackBar, private staticDataService: StaticDataService, private validationService: ValidationService) { }

  ngOnInit(): void {
    console.log("DashboardComponent onInit()");
    this.getTransactions(0);
    this.getCategories();
    this.getSubcategories();
  }

  getTransactions(pageNumber: number): void {
    this.transactionService.getTransactions(pageNumber).subscribe({
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

  pageChanged(newPage: number): void {
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

  getCategories(): void {
    this.staticDataService.getCategories().subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(`Server error. Code ${error.status} ❌`, "Dismiss");
      }
    })
  }

  getSubcategories(): void {
    this.staticDataService.getSubcategories().subscribe({
      next: (response: Subcategory[]) => {
        this.subcategories = response;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(`Server error. Code ${error.status} ❌`, "Dismiss");
      }
    })
  }

  deleteTransaction(transaction: Transaction) {
    let pageEmpty: boolean = this.transactions.length <= 1 && this.currentPageNumber > 0;
    this.transactionService.deleteTransaction(transaction).subscribe({
      next: (response: void) => {
        this.snackBar.open('Transaction deleted successfully.', '', {
          duration: 4000,
          panelClass: ['snackbar']
        });
        if (pageEmpty) {
          this.getTransactions(this.currentPageNumber - 2);
        }
        else {
          this.getTransactions(this.currentPageNumber - 1);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Error when deleting transaction. ❌", "Dismiss");
      }
    })
  }

  // onOpenEditDialog(transaction: Transaction): void {
  //   this.editTransaction = Object.assign({}, transaction); // clone transaction so that it doesn't change in the transaction view as I edit
  //   this.dialog.open(this.dialogRef, { data: transaction.name, width: '500px', panelClass: 'custom-modalbox' });
  // }

  // // Used to automatically select the option from Select matching the editTransaction.accountType
  // compareById(itemOne: any, itemTwo: any) {
  //   return itemOne && itemTwo && itemOne.id == itemTwo.id;
  // }

  // onSubmitEditForm() {
  //   this.resetFlagsAndErrorMessages();
  //   this.clientSideValidate();
  //   console.log(this.editTransaction);

  //   if (this.isNameValid && this.isBalanceValid && this.isTransactionTypeValid) {
  //     const accountForm: TransactionForm = {
  //       name: this.editTransaction.name,
  //       balance: this.editTransaction.balance.toString()
  //     }
  //     this.validationService.postTransactionForm(accountForm).subscribe({
  //       next: (response: Object) => {
  //         this.resetFlagsAndErrorMessages();
  //         this.transactionService.editTransaction(this.editTransaction).subscribe({
  //           next: (response: Transaction) => {
  //             this.dialog.closeAll();
  //             this.getTransactions(this.currentPageNumber - 1);
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

  // clientSideValidate() {
  //   if (this.editTransaction.name == null) {
  //     this.isNameValid = false;
  //   }
  //   if (this.editTransaction.balance == null) {
  //     this.isBalanceValid = false;
  //   }
  //   if (this.editTransaction.accountType == null) {
  //     this.isTransactionTypeValid = false;
  //   }

  //   if (this.isNameValid) {
  //     if (this.isNameValid && (this.editTransaction.name.length < 2 || this.editTransaction.name.length > 32)) {
  //       this.isNameValid = false;
  //       document.getElementById("error-name")!.textContent = "The transaction name has to be between 2 and 32 characters long!";
  //     }
  //   }
  //   if (this.isBalanceValid) {
  //     let balance = this.editTransaction.balance.toString();
  //     balance = balance.replace(/\s+/g, '');
  //     const balanceRegexExp = /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/;
  //     if (!balanceRegexExp.test(balance)) {
  //       this.isBalanceValid = false;
  //     }
  //     else {
  //       balance = Number(balance).toFixed(2);
  //     }
  //   }
  // }

  // handleServerErrors(errorResponse: HttpErrorResponse) {
  //   if (errorResponse.status == 400) {
  //     const errorsMap = new Map<string, string>(Object.entries(errorResponse.error));
  //     if (errorsMap.has("name")) {
  //       this.isNameValid = false;
  //       document.getElementById("error-name")!.textContent = errorsMap.get("name")!;
  //     }
  //     if (errorsMap.has("balance")) {
  //       this.isBalanceValid = false;
  //       document.getElementById("error-balance")!.textContent = errorsMap.get("balance")!;
  //     }
  //   }
  //   else {
  //     this.snackBar.open("Server error. ❌", "Dismiss");
  //   }
  // }

  // resetFlagsAndErrorMessages(): void {
  //   this.isNameValid = true;
  //   this.isBalanceValid = true;
  //   this.isTransactionTypeValid = true;

  //   document.getElementById("error-name")!.textContent = "Please enter a name for your transaction!";
  // }

}
