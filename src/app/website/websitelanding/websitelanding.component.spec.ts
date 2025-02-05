import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitelandingComponent } from './websitelanding.component';

describe('WebsitelandingComponent', () => {
  let component: WebsitelandingComponent;
  let fixture: ComponentFixture<WebsitelandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsitelandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsitelandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
