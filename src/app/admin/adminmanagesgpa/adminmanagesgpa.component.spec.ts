import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmanagesgpaComponent } from './adminmanagesgpa.component';

describe('AdminmanagesgpaComponent', () => {
  let component: AdminmanagesgpaComponent;
  let fixture: ComponentFixture<AdminmanagesgpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminmanagesgpaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminmanagesgpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
