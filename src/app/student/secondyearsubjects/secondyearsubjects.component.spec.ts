import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondyearsubjectsComponent } from './secondyearsubjects.component';

describe('SecondyearsubjectsComponent', () => {
  let component: SecondyearsubjectsComponent;
  let fixture: ComponentFixture<SecondyearsubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondyearsubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondyearsubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
