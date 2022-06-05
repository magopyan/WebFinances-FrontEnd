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

  onEditAccount(account: Account): void {
    this.onEdit.emit(account);
  }

  onDeleteAccount(account: Account): void {
    this.onDelete.emit(account);
  }
}
