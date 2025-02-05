import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelstudentsmanageComponent } from './hostelstudentsmanage.component';

describe('HostelstudentsmanageComponent', () => {
  let component: HostelstudentsmanageComponent;
  let fixture: ComponentFixture<HostelstudentsmanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelstudentsmanageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelstudentsmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
