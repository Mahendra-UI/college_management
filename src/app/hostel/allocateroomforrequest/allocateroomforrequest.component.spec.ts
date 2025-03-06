import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateroomforrequestComponent } from './allocateroomforrequest.component';

describe('AllocateroomforrequestComponent', () => {
  let component: AllocateroomforrequestComponent;
  let fixture: ComponentFixture<AllocateroomforrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocateroomforrequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateroomforrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
