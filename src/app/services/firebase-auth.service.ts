import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  currentUser!: any;
  private currentUserSubject = new Subject<any>();

  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        console.log("User loaded in FB-AuthService");
        this.currentUser = user;
        this.currentUserSubject.next(user);
      } else {
        console.log("User NULL in FB-AuthService");
        this.currentUser = null;
        this.currentUserSubject.next(user);
      }
    });
  }

  getUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  signOut() {
    this.afAuth.signOut();
  }
}