import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminmanagecgpaComponent } from './adminmanagecgpa.component';

describe('AdminmanagecgpaComponent', () => {
  let component: AdminmanagecgpaComponent;
  let fixture: ComponentFixture<AdminmanagecgpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminmanagecgpaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminmanagecgpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
