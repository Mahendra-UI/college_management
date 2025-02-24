import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelhomeComponent } from './hostelhome.component';

describe('HostelhomeComponent', () => {
  let component: HostelhomeComponent;
  let fixture: ComponentFixture<HostelhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelhomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
