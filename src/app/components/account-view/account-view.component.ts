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
  @Output() onEditAccount: EventEmitter<Account> = new EventEmitter();
  @Output() onDeleteAccount: EventEmitter<Account> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(account: Account) {
    this.onEditAccount.emit(account);
  }

  onDelete(account: Account) {
    this.onDeleteAccount.emit(account);
  }
}
