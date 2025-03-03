import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddroomsComponent } from './addrooms.component';

describe('AddroomsComponent', () => {
  let component: AddroomsComponent;
  let fixture: ComponentFixture<AddroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddroomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
