import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';


import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarAnonComponent } from './components/navbar-anon/navbar-anon.component';
import { HomeComponent } from './components/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { ContactComponent } from './components/contact/contact.component';
import { ValidationService } from './services/validation.service';
import { RegisterComponent } from './components/register/register.component';



const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent }
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
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    MatIconModule,
    NoopAnimationsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    FormsModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [ValidationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
