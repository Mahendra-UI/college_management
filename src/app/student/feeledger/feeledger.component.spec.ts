import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeledgerComponent } from './feeledger.component';

describe('FeeledgerComponent', () => {
  let component: FeeledgerComponent;
  let fixture: ComponentFixture<FeeledgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeledgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
