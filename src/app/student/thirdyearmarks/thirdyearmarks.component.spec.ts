import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdyearmarksComponent } from './thirdyearmarks.component';

describe('ThirdyearmarksComponent', () => {
  let component: ThirdyearmarksComponent;
  let fixture: ComponentFixture<ThirdyearmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdyearmarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdyearmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
