import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeNewComponent } from './welcome-new.component';

describe('WelcomeNewComponent', () => {
  let component: WelcomeNewComponent;
  let fixture: ComponentFixture<WelcomeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
