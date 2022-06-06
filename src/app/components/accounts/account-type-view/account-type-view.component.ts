import { Component, Input, OnInit } from '@angular/core';
import { AccountType } from 'src/app/models/account-type';
import { SelectedService } from 'src/app/services/selected.service';

@Component({
  selector: 'app-account-type-view',
  templateUrl: './account-type-view.component.html',
  styleUrls: ['./account-type-view.component.scss']
})
export class AccountTypeViewComponent implements OnInit {

  @Input() accountType!: AccountType;
  chosenAccountType: any;

  constructor(private selectedService: SelectedService) { }

  ngOnInit(): void {
    this.selectedService.getAccountType().subscribe(
      (accountType) => this.chosenAccountType = accountType);
  }

  onSelectAccountType() {
    this.selectedService.setAccountType(this.accountType);
  }
}
