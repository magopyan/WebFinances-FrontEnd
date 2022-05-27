import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable } from '@angular/core';
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
  //   this.firebaseAuthService.getUser().subscribe(
  //     (user) => {
  //       this.currentUser = user;
  //       if (user != null) {
  //         user.getIdToken().then((token: string | string[]) => console.log(token)
  //         //httpOptions.headers.set('Authorization', token)
  //         );
  //         console.log(httpOptions.headers.get('Authorization'));
  //         //   function (token: string | string[]) {
  //         //   httpOptions.headers.set('Authorization', token);
  //         //   httpOptions.headers.set('Authorization', user.getIdToken());
  //         //   console.log(user.getIdToken());
  //         // })
  //     }
  // })
  }

  public getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/all`, httpOptions);
  }

  public addAccount(account: Account): Observable<Account> {
    httpOptions.headers.set('Authorization', this.firebaseAuthService.getToken());
    console.log(httpOptions.headers.get('Authorization'));
    return this.http.post<Account>(`${this.apiUrl}/add`, account, httpOptions);
  }
}
