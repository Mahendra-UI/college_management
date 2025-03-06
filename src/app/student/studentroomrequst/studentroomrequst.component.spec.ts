import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentroomrequstComponent } from './studentroomrequst.component';

describe('StudentroomrequstComponent', () => {
  let component: StudentroomrequstComponent;
  let fixture: ComponentFixture<StudentroomrequstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentroomrequstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentroomrequstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
