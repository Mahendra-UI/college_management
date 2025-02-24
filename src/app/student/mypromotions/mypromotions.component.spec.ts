import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MypromotionsComponent } from './mypromotions.component';

describe('MypromotionsComponent', () => {
  let component: MypromotionsComponent;
  let fixture: ComponentFixture<MypromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MypromotionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MypromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
