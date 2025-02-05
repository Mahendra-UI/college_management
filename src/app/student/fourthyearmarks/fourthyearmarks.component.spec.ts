import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourthyearmarksComponent } from './fourthyearmarks.component';

describe('FourthyearmarksComponent', () => {
  let component: FourthyearmarksComponent;
  let fixture: ComponentFixture<FourthyearmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FourthyearmarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourthyearmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
