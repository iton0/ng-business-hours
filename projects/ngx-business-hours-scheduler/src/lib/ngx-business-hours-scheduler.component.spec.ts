import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxBusinessHoursSchedulerComponent } from './ngx-business-hours-scheduler.component';

describe('NgxBusinessHoursSchedulerComponent', () => {
  let component: NgxBusinessHoursSchedulerComponent;
  let fixture: ComponentFixture<NgxBusinessHoursSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxBusinessHoursSchedulerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxBusinessHoursSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
