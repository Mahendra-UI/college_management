import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggridtestComponent } from './aggridtest.component';

describe('AggridtestComponent', () => {
  let component: AggridtestComponent;
  let fixture: ComponentFixture<AggridtestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AggridtestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggridtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
