import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountType } from '../models/account-type';
import { Category, Subcategory } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  private apiUrl: string = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  public getAccountTypes(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.apiUrl}/account-types/all`);
  }

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/all`);
  }

  public getIncomeSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${this.apiUrl}/subcategories/all/income`);
  }

  public getExpenseSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`${this.apiUrl}/subcategories/all/expense`);
  }
}
