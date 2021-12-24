import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySelectComponent } from './display-select.component';

describe('DisplaySelectComponent', () => {
  let component: DisplaySelectComponent;
  let fixture: ComponentFixture<DisplaySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
