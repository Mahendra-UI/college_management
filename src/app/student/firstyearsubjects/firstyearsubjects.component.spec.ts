import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstyearsubjectsComponent } from './firstyearsubjects.component';

describe('FirstyearsubjectsComponent', () => {
  let component: FirstyearsubjectsComponent;
  let fixture: ComponentFixture<FirstyearsubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstyearsubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstyearsubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
