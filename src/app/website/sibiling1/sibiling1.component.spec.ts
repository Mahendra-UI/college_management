import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sibiling1Component } from './sibiling1.component';

describe('Sibiling1Component', () => {
  let component: Sibiling1Component;
  let fixture: ComponentFixture<Sibiling1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sibiling1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sibiling1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
