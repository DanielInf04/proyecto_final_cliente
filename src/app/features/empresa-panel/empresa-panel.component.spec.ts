import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaPanelComponent } from './empresa-panel.component';

describe('EmpresaPanelComponent', () => {
  let component: EmpresaPanelComponent;
  let fixture: ComponentFixture<EmpresaPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpresaPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
