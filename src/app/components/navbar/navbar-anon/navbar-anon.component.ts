import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-anon',
  templateUrl: './navbar-anon.component.html',
  styleUrls: ['./navbar-anon.component.scss']
})
export class NavbarAnonComponent implements OnInit {

  showMobileMenu: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleHamburger() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
