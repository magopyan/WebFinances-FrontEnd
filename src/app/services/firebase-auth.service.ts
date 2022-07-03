import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  currentUser!: any;
  private currentUserSubject = new Subject<any>();
  isLoggedIn!: boolean;

  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        console.log("User loaded in FB-AuthService");
        this.currentUser = user;
        this.currentUserSubject.next(user);
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser?.getIdToken().then((token: string | string[]) => {
          localStorage.setItem('token', JSON.stringify(token));
        })
      } else {
        console.log("User NULL in FB-AuthService");
        this.currentUser = null;
        this.currentUserSubject.next(user);
        this.isLoggedIn = false;
        localStorage.setItem('user', JSON.stringify(null));
        localStorage.setItem('token', JSON.stringify(null));
      }
    });
  }

  getUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isLogged(): boolean {
    return this.isLoggedIn;
  }

  signOut() {
    this.afAuth.signOut();
  }
}