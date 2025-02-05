import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstyearmarksComponent } from './firstyearmarks.component';

describe('FirstyearmarksComponent', () => {
  let component: FirstyearmarksComponent;
  let fixture: ComponentFixture<FirstyearmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstyearmarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstyearmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
