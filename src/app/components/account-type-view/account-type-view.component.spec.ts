import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTypeViewComponent } from './account-type-view.component';

describe('AccountTypeViewComponent', () => {
  let component: AccountTypeViewComponent;
  let fixture: ComponentFixture<AccountTypeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTypeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
