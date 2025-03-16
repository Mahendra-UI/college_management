import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpaymentsinformationComponent } from './adminpaymentsinformation.component';

describe('AdminpaymentsinformationComponent', () => {
  let component: AdminpaymentsinformationComponent;
  let fixture: ComponentFixture<AdminpaymentsinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminpaymentsinformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpaymentsinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
