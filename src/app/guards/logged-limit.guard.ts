import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedLimitGuard implements CanActivate {

  constructor(private authService: FirebaseAuthService, private router: Router) { };
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (JSON.parse(localStorage.getItem('token')!) == null)
      return true;
    else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
