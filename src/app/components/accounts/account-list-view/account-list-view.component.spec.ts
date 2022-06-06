import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListViewComponent } from './account-list-view.component';

describe('AccountListViewComponent', () => {
  let component: AccountListViewComponent;
  let fixture: ComponentFixture<AccountListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
