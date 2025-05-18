import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileV2Component } from './profile-v2.component';

describe('ProfileV2Component', () => {
  let component: ProfileV2Component;
  let fixture: ComponentFixture<ProfileV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
