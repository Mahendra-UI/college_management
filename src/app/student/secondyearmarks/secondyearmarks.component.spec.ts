import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondyearmarksComponent } from './secondyearmarks.component';

describe('SecondyearmarksComponent', () => {
  let component: SecondyearmarksComponent;
  let fixture: ComponentFixture<SecondyearmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondyearmarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondyearmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
