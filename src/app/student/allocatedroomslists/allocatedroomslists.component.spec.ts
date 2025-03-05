import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedroomslistsComponent } from './allocatedroomslists.component';

describe('AllocatedroomslistsComponent', () => {
  let component: AllocatedroomslistsComponent;
  let fixture: ComponentFixture<AllocatedroomslistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocatedroomslistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocatedroomslistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
