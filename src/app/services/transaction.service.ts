import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';
import { FirebaseAuthService } from './firebase-auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl: string = `${environment.apiBaseUrl}/transactions`;
  currentUser: any;

  constructor(private http: HttpClient, private firebaseAuthService: FirebaseAuthService) {
    // this.currentUser = this.firebaseAuthService.getCurrentUser();
    // this.currentUser?.getIdToken().then((token: string | string[]) => {
    //   console.log("Token 1: ", token);
    //   httpOptions.headers = httpOptions.headers.set('Authorization', token);
    // })
    // this.firebaseAuthService.getUser().subscribe(user => {
    //   this.currentUser = user;
    //   this.currentUser?.getIdToken().then((token: string | string[]) => {
    //     console.log("Token 2", token);
    //     httpOptions.headers = httpOptions.headers.set('Authorization', token);
    //   })
    // })
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

  public getAllTransactions(): Observable<Transaction[]> {
    this.updateHttpHeaders();
    return this.http.get<Transaction[]>(`${this.apiUrl}/all`, httpOptions);
  }

  public getTransactions(pageNumber: number): Observable<Transaction[]> {
    this.updateHttpHeaders();
    return this.http.get<Transaction[]>(`${this.apiUrl}/all?page=${pageNumber}`, httpOptions);
  }

  public getTransactionsByDateRange(pageNumber: number, startDate: string, endDate: string): Observable<Transaction[]> {
    this.updateHttpHeaders();
    return this.http.get<Transaction[]>(`${this.apiUrl}/all?page=${pageNumber}&startDate=${startDate}&endDate=${endDate}`, httpOptions);
  }

  public addTransaction(transaction: Transaction): Observable<Transaction> {
    this.updateHttpHeaders();
    return this.http.post<Transaction>(`${this.apiUrl}/add`, transaction, httpOptions);
  }

  public editTransaction(transaction: Transaction): Observable<Transaction> {
    this.updateHttpHeaders();
    return this.http.put<Transaction>(`${this.apiUrl}/update`, transaction, httpOptions);
  }

  public deleteTransaction(transaction: Transaction): Observable<void> {
    this.updateHttpHeaders();
    return this.http.delete<void>(`${this.apiUrl}/delete/${transaction.id}`, httpOptions);
  }
}
