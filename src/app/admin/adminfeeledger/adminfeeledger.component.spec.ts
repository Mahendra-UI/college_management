import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminfeeledgerComponent } from './adminfeeledger.component';

describe('AdminfeeledgerComponent', () => {
  let component: AdminfeeledgerComponent;
  let fixture: ComponentFixture<AdminfeeledgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminfeeledgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminfeeledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
