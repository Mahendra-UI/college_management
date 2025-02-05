import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagestudentsComponent } from './managestudents.component';

describe('ManagestudentsComponent', () => {
  let component: ManagestudentsComponent;
  let fixture: ComponentFixture<ManagestudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagestudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagestudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
