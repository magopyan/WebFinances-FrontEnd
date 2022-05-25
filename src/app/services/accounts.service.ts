import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { FirebaseAuthService } from './firebase-auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl: string = `${environment.apiBaseUrl}/accounts`;
  currentUser: any;

  constructor(private http: HttpClient, private firebaseAuthService: FirebaseAuthService) {
    this.firebaseAuthService.getUser().subscribe(
      (user) => this.currentUser = user
    );
  }

  public getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/all`);
  }

  public addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/add`, account);
  }
}
