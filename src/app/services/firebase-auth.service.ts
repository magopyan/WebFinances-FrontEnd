import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  private user!: any;
  private userSubject = new Subject<any>();
  private email!: any;
  private emailSubject = new Subject<any>();

  constructor() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.userSubject.next(user);
        this.email = user.email;
        this.emailSubject.next(user.email);
      } else {
        this.user = null;
        this.userSubject.next(user);
        this.email = null;
        this.emailSubject.next(user);
      }
    })
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  getEmail(): Observable<any> {
    return this.emailSubject.asObservable();
  }
}