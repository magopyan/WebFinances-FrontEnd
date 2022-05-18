import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  private user!: any;
  private subject = new Subject<any>();

  constructor() { 
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user
        this.subject.next(this.user);
      } else {
        this.user = null;
        this.subject.next(this.user);
      }
    })
  }

  getUser(): Observable<any> {
    return this.subject.asObservable();
  }
}
