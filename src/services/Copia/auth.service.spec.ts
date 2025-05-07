import { TestBed } from '@angular/core/testing';

import { DatosEmpresasService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosEmpresasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
