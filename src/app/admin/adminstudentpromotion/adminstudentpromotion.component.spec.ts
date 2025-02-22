import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminstudentpromotionComponent } from './adminstudentpromotion.component';

describe('AdminstudentpromotionComponent', () => {
  let component: AdminstudentpromotionComponent;
  let fixture: ComponentFixture<AdminstudentpromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminstudentpromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminstudentpromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
