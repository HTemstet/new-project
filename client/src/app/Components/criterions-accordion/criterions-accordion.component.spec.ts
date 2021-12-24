import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionsAccordionComponent } from './criterions-accordion.component';

describe('CriterionsAccordionComponent', () => {
  let component: CriterionsAccordionComponent;
  let fixture: ComponentFixture<CriterionsAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriterionsAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
