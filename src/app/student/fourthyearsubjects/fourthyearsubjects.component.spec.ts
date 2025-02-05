import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthyearsubjectsComponent } from './fourthyearsubjects.component';

describe('FourthyearsubjectsComponent', () => {
  let component: FourthyearsubjectsComponent;
  let fixture: ComponentFixture<FourthyearsubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthyearsubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourthyearsubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
