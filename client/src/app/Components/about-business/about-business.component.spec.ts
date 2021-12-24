import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutBusinessComponent } from './about-business.component';

describe('AboutBusinessComponent', () => {
  let component: AboutBusinessComponent;
  let fixture: ComponentFixture<AboutBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
