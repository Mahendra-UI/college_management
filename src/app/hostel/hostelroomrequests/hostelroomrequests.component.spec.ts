import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelroomrequestsComponent } from './hostelroomrequests.component';

describe('HostelroomrequestsComponent', () => {
  let component: HostelroomrequestsComponent;
  let fixture: ComponentFixture<HostelroomrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelroomrequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelroomrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
