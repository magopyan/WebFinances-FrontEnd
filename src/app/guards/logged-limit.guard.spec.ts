import { TestBed } from '@angular/core/testing';

import { LoggedLimitGuard } from './logged-limit.guard';

describe('LoggedLimitGuard', () => {
  let guard: LoggedLimitGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedLimitGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
