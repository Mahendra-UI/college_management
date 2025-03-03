import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfloorsComponent } from './addfloors.component';

describe('AddfloorsComponent', () => {
  let component: AddfloorsComponent;
  let fixture: ComponentFixture<AddfloorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddfloorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddfloorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
