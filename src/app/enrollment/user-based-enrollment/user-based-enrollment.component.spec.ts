import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBasedEnrollmentComponent } from './user-based-enrollment.component';

describe('UserBasedEnrollmentComponent', () => {
  let component: UserBasedEnrollmentComponent;
  let fixture: ComponentFixture<UserBasedEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBasedEnrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBasedEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
