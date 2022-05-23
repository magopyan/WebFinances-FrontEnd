import { TestBed } from '@angular/core/testing';

import { SelectAccountTypeService } from './select-account-type.service';

describe('SelectAccountTypeService', () => {
  let service: SelectAccountTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectAccountTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
