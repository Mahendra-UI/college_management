import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeestatusComponent } from './feestatus.component';

describe('FeestatusComponent', () => {
  let component: FeestatusComponent;
  let fixture: ComponentFixture<FeestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeestatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
