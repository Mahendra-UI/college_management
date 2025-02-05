import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminlandingComponent } from './adminlanding.component';

describe('AdminlandingComponent', () => {
  let component: AdminlandingComponent;
  let fixture: ComponentFixture<AdminlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminlandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
