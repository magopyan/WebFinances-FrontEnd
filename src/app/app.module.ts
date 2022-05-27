import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarAnonComponent } from './components/navbar-anon/navbar-anon.component';
import { HomeComponent } from './components/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { ContactComponent } from './components/contact/contact.component';
import { ValidationService } from './services/validation.service';
import { RegisterComponent } from './components/register/register.component';
import { NavbarLoggedComponent } from './components/navbar-logged/navbar-logged.component';
import { LoginComponent } from './components/login/login.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { AddAccountComponent } from './components/add-account/add-account.component';
import { StaticDataService } from './services/static-data.service';
import { AccountTypeViewComponent } from './components/account-type-view/account-type-view.component';
import { AccountViewComponent } from './components/account-view/account-view.component';
import { AccountService } from './services/account.service';


const firebaseConfig = {
  apiKey: "AIzaSyCIlnsyDeZcG_eruXmOwUdCEfQwOLDhRAI",
  authDomain: "web-finances.firebaseapp.com",
  projectId: "web-finances",
  storageBucket: "web-finances.appspot.com",
  messagingSenderId: "737057594981",
  appId: "1:737057594981:web:9596940201bea8a607308c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'add-account', component: AddAccountComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarAnonComponent,
    HomeComponent,
    HeroComponent,
    FeaturesSectionComponent,
    ContactComponent,
    RegisterComponent,
    NavbarLoggedComponent,
    LoginComponent,
    AccountsComponent,
    AddAccountComponent,
    AccountTypeViewComponent,
    AccountViewComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    MatIconModule,
    NoopAnimationsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    FormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    HttpClientModule
  ],
  providers: [ValidationService, FirebaseAuthService, AccountService, StaticDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
