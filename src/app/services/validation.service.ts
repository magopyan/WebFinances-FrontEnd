import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactForm } from '../models/contact-form';
import { UserRegisterForm } from '../models/user-register-form';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private apiUrl: string = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  public postContactForm(contactForm: ContactForm): Observable<Map<string, string>> {
    return this.http.post<Map<string, string>>(`${this.apiUrl}/contact`, contactForm, httpOptions);
  }

  public postRegisterForm(userRegisterForm: UserRegisterForm): Observable<Map<string, string>> {
    return this.http.post<Map<string, string>>(`${this.apiUrl}/user/register`, userRegisterForm, httpOptions);
  }
}
