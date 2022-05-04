import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAnonComponent } from './navbar-anon.component';

describe('NavbarAnonComponent', () => {
  let component: NavbarAnonComponent;
  let fixture: ComponentFixture<NavbarAnonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarAnonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarAnonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
