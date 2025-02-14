import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagenotificationsComponent } from './managenotifications.component';

describe('ManagenotificationsComponent', () => {
  let component: ManagenotificationsComponent;
  let fixture: ComponentFixture<ManagenotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagenotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagenotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
