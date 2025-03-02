import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddblocksComponent } from './addblocks.component';

describe('AddblocksComponent', () => {
  let component: AddblocksComponent;
  let fixture: ComponentFixture<AddblocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddblocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddblocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
