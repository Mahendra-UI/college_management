import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleroomrequeststatusComponent } from './toggleroomrequeststatus.component';

describe('ToggleroomrequeststatusComponent', () => {
  let component: ToggleroomrequeststatusComponent;
  let fixture: ComponentFixture<ToggleroomrequeststatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleroomrequeststatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleroomrequeststatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
