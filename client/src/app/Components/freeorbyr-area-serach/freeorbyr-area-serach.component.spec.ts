import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeorbyrAreaSerachComponent } from './freeorbyr-area-serach.component';

describe('FreeorbyrAreaSerachComponent', () => {
  let component: FreeorbyrAreaSerachComponent;
  let fixture: ComponentFixture<FreeorbyrAreaSerachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeorbyrAreaSerachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeorbyrAreaSerachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
