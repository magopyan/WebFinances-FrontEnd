import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/navbar/footer/footer.component';
import { NavbarAnonComponent } from './components/navbar/navbar-anon/navbar-anon.component';
import { HomeComponent } from './components/static-pages/home/home.component';
import { HeroComponent } from './components/static-pages/hero/hero.component';
import { FeaturesSectionComponent } from './components/static-pages/features-section/features-section.component';
import { ContactComponent } from './components/static-pages/contact/contact.component';
import { ValidationService } from './services/validation.service';
import { RegisterComponent } from './components/static-pages/register/register.component';
import { NavbarLoggedComponent } from './components/navbar/navbar-logged/navbar-logged.component';
import { LoginComponent } from './components/static-pages/login/login.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { AddAccountComponent } from './components/accounts/add-account/add-account.component';
import { StaticDataService } from './services/static-data.service';
import { AccountTypeViewComponent } from './components/accounts/account-type-view/account-type-view.component';
import { AccountViewComponent } from './components/accounts/account-view/account-view.component';
import { AccountService } from './services/account.service';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionViewComponent } from './components/dashboard/transaction-view/transaction-view.component';
import { AddIncomeComponent } from './components/dashboard/add-income/add-income.component';
import { AddExpenseComponent } from './components/dashboard/add-expense/add-expense.component';
import { CategoryViewComponent } from './components/dashboard/category-view/category-view.component';
import { SubcategoryViewComponent } from './components/dashboard/subcategory-view/subcategory-view.component';
import { AccountListViewComponent } from './components/accounts/account-list-view/account-list-view.component';

const appRoutes: Routes = [
  { path: '#', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'add-account', component: AddAccountComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-income', component: AddIncomeComponent },
  { path: 'add-expense', component: AddExpenseComponent }
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
    AccountViewComponent,
    DashboardComponent,
    TransactionViewComponent,
    AddIncomeComponent,
    AddExpenseComponent,
    CategoryViewComponent,
    SubcategoryViewComponent,
    AccountListViewComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    MatIconModule,
    NoopAnimationsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    NgxPaginationModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatDialogModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [ValidationService, FirebaseAuthService, AccountService, StaticDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
