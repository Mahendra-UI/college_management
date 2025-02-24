import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostellandingComponent } from './hostellanding.component';

describe('HostellandingComponent', () => {
  let component: HostellandingComponent;
  let fixture: ComponentFixture<HostellandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostellandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostellandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
