import { Component } from '@angular/core';
import { LocaleService } from './locale.service';
import { NgxBusinessHoursSchedulerLocaleService } from '../../../ngx-business-hours-scheduler/src/lib/ngx-business-hours-scheduler-locale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'demo';
  businessHours = [];
  disabled = false;
  isoWeek = true;

  constructor(
    private localeService: LocaleService,
    private ngBusinessHoursLocaleService: NgxBusinessHoursSchedulerLocaleService,
  ) {}

  getLocale(): string {
    return this.localeService.locale;
  }

  onChangeLocale(event: any): void {
    this.localeService.locale = event.target?.value;
    this.ngBusinessHoursLocaleService.setCurrentLocale(event.target?.value);
  }
}
