import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateroomsComponent } from './allocaterooms.component';

describe('AllocateroomsComponent', () => {
  let component: AllocateroomsComponent;
  let fixture: ComponentFixture<AllocateroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocateroomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
