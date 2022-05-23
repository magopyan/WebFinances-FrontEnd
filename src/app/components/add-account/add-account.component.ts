import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { AccountType } from 'src/app/models/account-type';
import { SelectAccountTypeService } from 'src/app/services/select-account-type.service';
import { StaticDataService } from 'src/app/services/static-data.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})
export class AddAccountComponent implements OnInit {

  accountType!: AccountType;
  name!: string;
  balance!: number;

  accountTypes!: AccountType[];
  chosenAccountType: any;

  firstStepCompleted: boolean = false;

  constructor(private router: Router, private staticDataService: StaticDataService,
    public snackBar: MatSnackBar, private selectAccountTypeService: SelectAccountTypeService) {
  }

  ngOnInit(): void {
    this.getAccountTypes();
    this.selectAccountTypeService.getAccountType().subscribe(
      (accountType) => this.chosenAccountType = accountType); 
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

  onCloseStepper(): void {
    this.router.navigate(['/accounts']);
  }

  onSubmitFirstStep(stepper: MatStepper) {
    if(this.chosenAccountType == null) {
      return;
    }
    else {
      this.firstStepCompleted = true;
      stepper.selectedIndex = 1;
      //stepper.next();
    }
  }
}
