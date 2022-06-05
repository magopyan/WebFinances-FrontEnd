import { Component, Input, OnInit } from '@angular/core';
import { AccountType } from 'src/app/models/account-type';
import { SelectAccountTypeService } from 'src/app/services/select-account-type.service';

@Component({
  selector: 'app-account-type-view',
  templateUrl: './account-type-view.component.html',
  styleUrls: ['./account-type-view.component.scss']
})
export class AccountTypeViewComponent implements OnInit {

  @Input() accountType!: AccountType;
  chosenAccountType: any;

  constructor(private selectAccountTypeService: SelectAccountTypeService) { }

  ngOnInit(): void {
    this.selectAccountTypeService.getAccountType().subscribe(
      (accountType) => this.chosenAccountType = accountType); 
  }

  onSelectAccountType() {
    this.selectAccountTypeService.setAccountType(this.accountType);
  }
}
