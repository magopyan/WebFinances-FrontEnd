import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Account } from '../models/account';
import { AccountType } from '../models/account-type';
import { Category, Subcategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class SelectedService {

  accountType!: any;
  private accountTypeSubject = new Subject<any>();

  account!: any;
  private accountSubject = new Subject<any>();

  category!: any;
  private categorySubject = new Subject<any>();

  subcategory!: any;
  private subcategorySubject = new Subject<any>();

  constructor() { }

  setAccountType(accountType: AccountType) {
    this.accountType = accountType;
    this.accountTypeSubject.next(this.accountType);
  }

  setAccount(account: Account) {
    this.account = account;
    this.accountSubject.next(this.account);
  }
  
  setCategory(category: Category) {
    this.category = category;
    this.categorySubject.next(this.category);
  }

  setSubcategory(subcategory: Subcategory) {
    this.subcategory = subcategory;
    this.subcategorySubject.next(this.subcategory);
  }

  getAccountType(): Observable<any> {
    return this.accountTypeSubject.asObservable();
  }

  getAccount(): Observable<any> {
    return this.accountSubject.asObservable();
  }

  getCategory(): Observable<any> {
    return this.categorySubject.asObservable();
  }

  getSubcategory(): Observable<any> {
    return this.subcategorySubject.asObservable();
  }
}
