import { Component, Input, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account';
import { SelectedService } from 'src/app/services/selected.service';

@Component({
  selector: 'app-account-list-view',
  templateUrl: './account-list-view.component.html',
  styleUrls: ['./account-list-view.component.scss']
})
export class AccountListViewComponent implements OnInit {

  @Input() account!: Account;
  chosenAccount: any;

  constructor(private selectedService: SelectedService) { }

  ngOnInit(): void {
    this.selectedService.getAccount().subscribe(
      (account) => this.chosenAccount = account);
  }

  getBalance() {
    return Number(this.account?.balance).toFixed(2)
  }

  isBalancePositive(): boolean {
    return this.account?.balance > 0;
  }

  onSelectAccount() {
    this.selectedService.setAccount(this.account);
  }
}
