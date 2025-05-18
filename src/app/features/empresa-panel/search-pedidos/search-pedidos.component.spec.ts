import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPedidosComponent } from './search-pedidos.component';

describe('SearchPedidosComponent', () => {
  let component: SearchPedidosComponent;
  let fixture: ComponentFixture<SearchPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
