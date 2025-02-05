import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeinfoComponent } from './feeinfo.component';

describe('FeeinfoComponent', () => {
  let component: FeeinfoComponent;
  let fixture: ComponentFixture<FeeinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
