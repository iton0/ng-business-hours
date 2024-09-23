import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgxBusinessHoursSchedulerModule } from '../../../ngx-business-hours-scheduler/src/lib/ngx-business-hours-scheduler.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LocaleService } from './locale.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBusinessHoursSchedulerModule,
    BrowserAnimationsModule,
  ],
  providers: [
    LocaleService,
    {
      provide: LOCALE_ID,
      deps: [LocaleService],
      useFactory: (localeService: LocaleService) => localeService.locale,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
