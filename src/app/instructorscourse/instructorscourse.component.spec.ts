import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorscourseComponent } from './instructorscourse.component';

describe('InstructorscourseComponent', () => {
  let component: InstructorscourseComponent;
  let fixture: ComponentFixture<InstructorscourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorscourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorscourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
