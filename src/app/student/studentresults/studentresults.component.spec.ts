import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentresultsComponent } from './studentresults.component';

describe('StudentresultsComponent', () => {
  let component: StudentresultsComponent;
  let fixture: ComponentFixture<StudentresultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentresultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
