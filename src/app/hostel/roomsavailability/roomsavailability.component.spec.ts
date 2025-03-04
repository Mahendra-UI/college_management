import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsavailabilityComponent } from './roomsavailability.component';

describe('RoomsavailabilityComponent', () => {
  let component: RoomsavailabilityComponent;
  let fixture: ComponentFixture<RoomsavailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsavailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsavailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
