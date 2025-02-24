import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelheaderComponent } from './hostelheader.component';

describe('HostelheaderComponent', () => {
  let component: HostelheaderComponent;
  let fixture: ComponentFixture<HostelheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
