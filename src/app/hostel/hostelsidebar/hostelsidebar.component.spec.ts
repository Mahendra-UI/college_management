import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelsidebarComponent } from './hostelsidebar.component';

describe('HostelsidebarComponent', () => {
  let component: HostelsidebarComponent;
  let fixture: ComponentFixture<HostelsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelsidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
