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
    return this.transaction?.subcategory?.category?.categoryType?.coefficient > 0;
  }

  getAmount() {
    if(this.transaction.subcategory.category.categoryType.coefficient == -1) {
      return "-"+Number(this.transaction?.amount).toFixed(2)
    }
    else {
      return Number(this.transaction?.amount).toFixed(2)
    }
  }

  getDate() {
    return new Date(this.transaction.date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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
