import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sibiling2Component } from './sibiling2.component';

describe('Sibiling2Component', () => {
  let component: Sibiling2Component;
  let fixture: ComponentFixture<Sibiling2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sibiling2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sibiling2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
