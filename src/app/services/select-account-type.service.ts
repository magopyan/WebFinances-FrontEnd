import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AccountType } from '../models/account-type';

@Injectable({
  providedIn: 'root'
})
export class SelectAccountTypeService {

  accountType!: any;
  private subject = new Subject<any>();

  constructor() { }

  setAccountType(accountType: AccountType) {
    this.accountType = accountType;
    this.subject.next(this.accountType);
  }

  getAccountType(): Observable<any> {
    return this.subject.asObservable();
  }
}
