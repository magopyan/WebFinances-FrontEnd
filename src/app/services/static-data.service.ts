import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountType } from '../models/account-type';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  private apiUrl: string = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  public getAccountTypes(): Observable<AccountType[]> {
    return this.http.get<AccountType[]>(`${this.apiUrl}/account-types/all`);
  }
}
