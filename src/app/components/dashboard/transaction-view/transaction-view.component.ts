import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent implements OnInit {

  @Input() transaction!: Transaction;
  @Output() onEdit: EventEmitter<Transaction> = new EventEmitter();
  @Output() onDelete: EventEmitter<Transaction> = new EventEmitter();
  @Output() onView: EventEmitter<Transaction> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  isAmountPositive(): boolean {
    return this.transaction?.amount > 0;
  }

  getAmount() {
    return Number(this.transaction?.amount).toFixed(2)
  }

  onEditTransaction(transaction: Transaction): void {
    this.onEdit.emit(transaction);
  }

  onDeleteTransaction(transaction: Transaction): void {
    this.onDelete.emit(transaction);
  }

  onViewTransaction(transaction: Transaction): void {
    this.onView.emit(transaction);
  }
}
