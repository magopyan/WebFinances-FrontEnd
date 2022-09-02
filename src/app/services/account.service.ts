import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { FirebaseAuthService } from './firebase-auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl: string = `${environment.apiBaseUrl}/accounts`;
  currentUser: any;
  currentPageNumber!: number;

  constructor(private http: HttpClient, private firebaseAuthService: FirebaseAuthService) {  }

  getCurrentPageNumber() {
    return this.currentPageNumber;
  }

  setCurrentPageNumber(currentPageNumber: number) {
    this.currentPageNumber = currentPageNumber;
  }

  updateHttpHeaders() {
    let token = localStorage.getItem('token');
    if (token != null) {
      console.log(JSON.parse(token));
      httpOptions.headers = httpOptions.headers.set('Authorization', JSON.parse(token));
    }
    else {
      httpOptions.headers = httpOptions.headers.set('Authorization', "");
      console.log("Token NULL in AccountService");
    }
  }

  public getAllAccounts(): Observable<Account[]> {
    this.updateHttpHeaders();
    return this.http.get<Account[]>(`${this.apiUrl}/all`, httpOptions);
  }

  public getAccounts(pageNumber: number): Observable<Account[]> {
    this.updateHttpHeaders();
    return this.http.get<Account[]>(`${this.apiUrl}/all?page=${pageNumber}`, httpOptions);
  }

  public addAccount(account: Account): Observable<Account> {
    this.updateHttpHeaders();
    return this.http.post<Account>(`${this.apiUrl}/add`, account, httpOptions);
  }

  public editAccount(account: Account): Observable<Account> {
    this.updateHttpHeaders();
    return this.http.put<Account>(`${this.apiUrl}/update`, account, httpOptions);
  }

  public deleteAccount(account: Account): Observable<void> {
    this.updateHttpHeaders();
    return this.http.delete<void>(`${this.apiUrl}/delete/${account.id}`, httpOptions);
  }
}
