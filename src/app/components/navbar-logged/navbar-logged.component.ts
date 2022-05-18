import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";


@Component({
  selector: 'app-navbar-logged',
  templateUrl: './navbar-logged.component.html',
  styleUrls: ['./navbar-logged.component.scss']
})
export class NavbarLoggedComponent implements OnInit {

  showMobileMenu: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleHamburger() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  signOut() {
    signOut(getAuth());
    this.onToggleHamburger();
  }
}
