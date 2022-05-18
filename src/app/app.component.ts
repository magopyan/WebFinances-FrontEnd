import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from './services/firebase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  currentUser: any;

  constructor(private firebaseAuthService: FirebaseAuthService) { }

  ngOnInit(): void {
    this.firebaseAuthService.getUser().subscribe(
      (user) => this.currentUser = user);
  }
}
