import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: any;
  subscription!: Subscription;

  constructor(private firebaseAuthService: FirebaseAuthService) { }

  ngOnInit(): void {
    let user = localStorage.getItem('user');
    if (user != null) {
      this.currentUser = JSON.parse(user);
    }
    else {
      this.currentUser = null;
    }
    this.currentUser = this.firebaseAuthService.getCurrentUser();
    this.firebaseAuthService.getUser().subscribe(user => {
      this.currentUser = user;
    })
  }
}
