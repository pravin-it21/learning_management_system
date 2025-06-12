import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitQuizComponent } from './submit-quiz.component';

describe('SubmitQuizComponent', () => {
  let component: SubmitQuizComponent;
  let fixture: ComponentFixture<SubmitQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
