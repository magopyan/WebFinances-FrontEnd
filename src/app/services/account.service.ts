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

  constructor(private http: HttpClient, private firebaseAuthService: FirebaseAuthService) {
    this.currentUser = this.firebaseAuthService.getCurrentUser();
    this.currentUser.getIdToken().then((token: string | string[]) => {
      httpOptions.headers = httpOptions.headers.set('Authorization', token);
    })
    this.firebaseAuthService.getUser().subscribe(user => {
      this.currentUser = user;
      this.currentUser.getIdToken().then((token: string | string[]) => {
        httpOptions.headers = httpOptions.headers.set('Authorization', token);
      })
    })
  }

  public getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${ this.apiUrl }/all`, httpOptions);
  }

  public addAccount(account: Account): Observable < Account > {
    console.log(httpOptions.headers.get('Authorization'));
  return this.http.post<Account>(`${this.apiUrl}/add`, account, httpOptions);

}
}
