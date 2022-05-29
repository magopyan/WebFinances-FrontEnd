import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account.service';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

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

  constructor(private firebaseAuthService: FirebaseAuthService, private accountService: AccountService, public snackBar: MatSnackBar) { 
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
    this.getAccounts();
  }

  getAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (response: Account[]) => {
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
}
