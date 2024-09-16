import { NgModule } from '@angular/core';
import { NgxBusinessHoursSchedulerComponent } from './ngx-business-hours-scheduler.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalizedDatePipe } from './localized-date.pipe';
import { NgxBusinessHoursSchedulerLocaleService } from './ngx-business-hours-scheduler-locale.service';

@NgModule({
  declarations: [NgxBusinessHoursSchedulerComponent, LocalizedDatePipe],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [NgxBusinessHoursSchedulerComponent],
  providers: [LocalizedDatePipe, NgxBusinessHoursSchedulerLocaleService],
})
export class NgxBusinessHoursSchedulerModule {}
