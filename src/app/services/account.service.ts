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

  constructor(private http: HttpClient, private firebaseAuthService: FirebaseAuthService) {
    this.currentUser = this.firebaseAuthService.getCurrentUser();
    this.currentUser?.getIdToken().then((token: string | string[]) => {
      console.log("Token 1: ", token);
      httpOptions.headers = httpOptions.headers.set('Authorization', token);
    })
    this.firebaseAuthService.getUser().subscribe(user => {
      this.currentUser = user;
      this.currentUser?.getIdToken().then((token: string | string[]) => {
        console.log("Token 2", token);
        httpOptions.headers = httpOptions.headers.set('Authorization', token);
      })
    })
  }

  getCurrentPageNumber() {
    return this.currentPageNumber;
  }

  setCurrentPageNumber(currentPageNumber: number) {
    this.currentPageNumber = currentPageNumber;
  }

  public getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/all`, httpOptions);
  }

  public getAccounts(pageNumber: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/all?page=${pageNumber}`, httpOptions);
  }

  public addAccount(account: Account): Observable<Account> {
    console.log(httpOptions.headers.get('Authorization'));
    return this.http.post<Account>(`${this.apiUrl}/add`, account, httpOptions);
  }

  public editAccount(account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/update`, account, httpOptions);
  }

  public deleteAccount(account: Account): Observable<void> {
    console.log(account.id)
    return this.http.delete<void>(`${this.apiUrl}/delete/${account.id}`, httpOptions);
  }
}
