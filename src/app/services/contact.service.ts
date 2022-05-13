import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactForm } from '../models/contact-form';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl: string = `${environment.apiBaseUrl}/contact`;

  constructor(private http: HttpClient) { }

  public postForm(contactForm: ContactForm): Observable<Map<string, string>> {
    return this.http.post<Map<string, string>>(this.apiUrl, contactForm, httpOptions);
  }
}
