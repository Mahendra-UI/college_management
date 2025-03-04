import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedroomsComponent } from './allocatedrooms.component';

describe('AllocatedroomsComponent', () => {
  let component: AllocatedroomsComponent;
  let fixture: ComponentFixture<AllocatedroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocatedroomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
