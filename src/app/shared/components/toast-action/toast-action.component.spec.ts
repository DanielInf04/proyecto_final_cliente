import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastActionComponent } from './toast-action.component';

describe('ToastActionComponent', () => {
  let component: ToastActionComponent;
  let fixture: ComponentFixture<ToastActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
