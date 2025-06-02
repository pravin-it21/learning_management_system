import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveenrollmentComponent } from './saveenrollment.component';

describe('SaveenrollmentComponent', () => {
  let component: SaveenrollmentComponent;
  let fixture: ComponentFixture<SaveenrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveenrollmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveenrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
