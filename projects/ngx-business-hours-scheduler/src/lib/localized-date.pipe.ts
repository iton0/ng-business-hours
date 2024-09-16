import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { NgxBusinessHoursSchedulerLocaleService } from './ngx-business-hours-scheduler-locale.service';

@Pipe({
  name: 'localizedDate',
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private localeService: NgxBusinessHoursSchedulerLocaleService) {}

  transform(value: any, pattern: string = 'E'): any {
    return formatDate(value, pattern, this.localeService.getCurrentLocale());
  }
}
