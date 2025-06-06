import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersV2Component } from './orders-v2.component';

describe('OrdersV2Component', () => {
  let component: OrdersV2Component;
  let fixture: ComponentFixture<OrdersV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
