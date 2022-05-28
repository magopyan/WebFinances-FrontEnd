import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar-logged',
  templateUrl: './navbar-logged.component.html',
  styleUrls: ['./navbar-logged.component.scss']
})
export class NavbarLoggedComponent implements OnInit {

  uid!: any;

  showMobileMenu: boolean = false;

  constructor(private firebaseAuthService: FirebaseAuthService, public afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.firebaseAuthService.getUser().subscribe(
      (user) => this.uid = user.uid);   
  }

  onToggleHamburger() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['home']);
    });
  }
}
