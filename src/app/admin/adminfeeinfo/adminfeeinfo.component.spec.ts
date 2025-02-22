import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminfeeinfoComponent } from './adminfeeinfo.component';

describe('AdminfeeinfoComponent', () => {
  let component: AdminfeeinfoComponent;
  let fixture: ComponentFixture<AdminfeeinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminfeeinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminfeeinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
