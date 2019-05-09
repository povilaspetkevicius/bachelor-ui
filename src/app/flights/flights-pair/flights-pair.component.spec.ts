import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsPairComponent } from './flights-pair.component';

describe('FlightsPairComponent', () => {
  let component: FlightsPairComponent;
  let fixture: ComponentFixture<FlightsPairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightsPairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightsPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
