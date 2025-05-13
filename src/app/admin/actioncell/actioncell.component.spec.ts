import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActioncellComponent } from './actioncell.component';

describe('ActioncellComponent', () => {
  let component: ActioncellComponent;
  let fixture: ComponentFixture<ActioncellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActioncellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActioncellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
