import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelfooterComponent } from './hostelfooter.component';

describe('HostelfooterComponent', () => {
  let component: HostelfooterComponent;
  let fixture: ComponentFixture<HostelfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelfooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
