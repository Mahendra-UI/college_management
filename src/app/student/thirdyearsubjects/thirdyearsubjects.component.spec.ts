import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdyearsubjectsComponent } from './thirdyearsubjects.component';

describe('ThirdyearsubjectsComponent', () => {
  let component: ThirdyearsubjectsComponent;
  let fixture: ComponentFixture<ThirdyearsubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdyearsubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdyearsubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
