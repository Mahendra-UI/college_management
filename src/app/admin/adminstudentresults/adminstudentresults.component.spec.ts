import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstudentresultsComponent } from './adminstudentresults.component';

describe('AdminstudentresultsComponent', () => {
  let component: AdminstudentresultsComponent;
  let fixture: ComponentFixture<AdminstudentresultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminstudentresultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminstudentresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
