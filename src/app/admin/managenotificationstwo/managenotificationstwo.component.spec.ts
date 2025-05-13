import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagenotificationstwoComponent } from './managenotificationstwo.component';

describe('ManagenotificationstwoComponent', () => {
  let component: ManagenotificationstwoComponent;
  let fixture: ComponentFixture<ManagenotificationstwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagenotificationstwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagenotificationstwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
