import { Component, Input, OnInit, Output } from '@angular/core';
import { Account } from 'src/app/models/account';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.scss']
})
export class AccountViewComponent implements OnInit {

  @Input() account!: Account;
  @Input() areIconsVisible!: boolean;
  @Output() onEdit: EventEmitter<Account> = new EventEmitter();
  @Output() onDelete: EventEmitter<Account> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  isBalancePositive(): boolean {
    return this.account?.balance > 0;
  }

  getBalance() {
    return Number(this.account?.balance).toFixed(2)
  }

  onEditAccount(account: Account): void {
    this.onEdit.emit(account);
  }

  onDeleteAccount(account: Account): void {
    this.onDelete.emit(account);
  }
}
