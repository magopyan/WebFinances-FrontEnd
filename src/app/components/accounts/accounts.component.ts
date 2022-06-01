import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'src/app/models/account';
import { AccountType } from 'src/app/models/account-type';
import { AccountService } from 'src/app/services/account.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { StaticDataService } from 'src/app/services/static-data.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  totalBalance: number = 0;
  accounts!: Account[];

  currentUser: any;

  acc: Account;
  editAccount!: Account;
  accountTypes!: AccountType[];

  constructor(private firebaseAuthService: FirebaseAuthService, private accountService: AccountService, 
    public snackBar: MatSnackBar, private staticDataService: StaticDataService) { 
    this.acc = {
      name: "Nameeee",
      balance: parseFloat("12.34"),
      accountType: {
        id: 1,
        name: "tyyype",
        imageUrl: "https://i.postimg.cc/vZXSZRMZ/credit-card.png"
      }
    }
  }

  ngOnInit(): void {
    console.log("AccountsComponent onInit()");
    this.getAccounts();
    this.getAccountTypes();
  }

  getAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (response: Account[]) => {
        this.totalBalance = 0;
        this.accounts = response;
        for (let i = 0; i < this.accounts.length; i++) {
          this.totalBalance += this.accounts[i].balance;
        }
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

  deleteAccount(account: Account) {
    this.accountService.deleteAccount(account).subscribe({
      next: (response: void) => {
        this.snackBar.open('Account deleted successfully.', '', {
          duration: 4000,
          panelClass: ['snackbar']
        });
        this.getAccounts();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open("Error when deleting account. ❌", "Dismiss");
      }
    })
  }

  updateAccount(account: Account): void {
    this.editAccount = account;
    this.openEditFormModal();

    // this.employeeService.updateEmployee(employee).subscribe({
    //   next: (response: Employee) => {
    //     console.log(response);
    //     this.getEmployees();
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     alert(error.message);
    //   }
    // })
  }

  openEditFormModal() {
    const container = document.getElementById('container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#updateAccountModal')
    container?.appendChild(button);
    button.click();
  }

  closeModal(form: NgForm) {
    form.reset();
  }
}
