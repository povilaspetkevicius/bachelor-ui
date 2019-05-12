import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsInfoComponent } from './flights-info.component';

describe('FlightsInfoComponent', () => {
  let component: FlightsInfoComponent;
  let fixture: ComponentFixture<FlightsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
