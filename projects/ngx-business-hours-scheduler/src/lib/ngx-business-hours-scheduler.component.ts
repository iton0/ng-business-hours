import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormArray,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { LocalizedDatePipe } from './localized-date.pipe';
import { daySettingsValidator } from './day-settings.validator';
import { NgxBusinessHoursSchedulerDaySettings } from './ngx-business-hours-scheduler-day-settings.model';

@Component({
  selector: 'ngx-business-hours-scheduler',
  templateUrl: './ngx-business-hours-scheduler.component.html',
  styleUrls: ['./ngx-business-hours-scheduler.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NgxBusinessHoursSchedulerComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => NgxBusinessHoursSchedulerComponent),
    },
  ],
})
export class NgxBusinessHoursSchedulerComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  @Input() timeFromLabel: string | undefined;
  @Input() timeToLabel: string | undefined;
  @Input() validationErrorMessage: string | undefined;
  @Input() timeFrom = '09:00';
  @Input() timeTo = '18:00';
  @Input() isoWeek = true;

  val = '';
  disabled = false;
  form!: FormGroup;
  formValueChangesSubscription!: Subscription;

  startTime = '00:00';
  maxTime = '24:00';
  interval = 15;
  timeFormat = 'HH:mm';
  timeOptions!: string[];

  weekdays!: number[];
  defaultBusinessHours: NgxBusinessHoursSchedulerDaySettings[] = [
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: false, shifts: [] },
    { open: false, shifts: [] },
  ];
  businessHours!: NgxBusinessHoursSchedulerDaySettings[];

  onChange = (obj: NgxBusinessHoursSchedulerDaySettings[]) => {
    this.onValuesChange(obj);
  };
  onValuesChange = (value: NgxBusinessHoursSchedulerDaySettings[]) => {};
  onTouched = () => {};

  constructor(
    private localizedDatePipe: LocalizedDatePipe,
    private fb: FormBuilder,
  ) {
    this.weekdays = Array.from(Array(7).keys());
    this.businessHours = this.defaultBusinessHours;
    this.timeOptions = this.getTimeOptions(
      this.startTime,
      this.maxTime,
      this.interval,
    );
    this.initForm();
  }

  ngOnInit(): void {
    this.formValueChangesSubscription = this.form.valueChanges.subscribe(
      this.onChange,
    );
  }

  registerOnChange(fn: any): void {
    this.onValuesChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  writeValue(obj: NgxBusinessHoursSchedulerDaySettings[]): void {
    if (obj && obj.length > 0) {
      this.businessHours = obj;
      this.form.setValue(this.businessHours, { emitEvent: false });
    } else {
      this.form.setValue(this.defaultBusinessHours, { emitEvent: true });
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { businessHoursInvalid: true };
  }

  onChangeOperationState(i: number): void {
    if (this.disabled) {
      return;
    }

    this.businessHours[i].open = !this.businessHours[i].open;
    this.form.get(String(i))?.get('open')?.setValue(this.businessHours[i].open);

    if (this.businessHours[i].open) {
      this.addDefaultShift(i);
    } else {
      this.clearShifts(i);
    }
  }

  addDefaultShift(dayIdx: number): void {
    const dayControl = this.form.get(String(dayIdx));
    if (dayControl) {
      const shiftsArray = dayControl.get('shifts') as FormArray;
      shiftsArray.push(
        this.fb.group({
          from: [this.timeFrom],
          to: [this.timeTo],
        }),
      );
    }
  }

  clearShifts(dayIdx: number): void {
    const dayControl = this.form.get(String(dayIdx));
    if (dayControl) {
      const shiftsArray = dayControl.get('shifts') as FormArray;
      shiftsArray.clear();
    }
  }

  getDateForWeekDay(num: number): Date {
    return moment()
      .startOf(this.isoWeek ? 'isoWeek' : 'week')
      .add(num, 'day')
      .toDate();
  }

  getShifts(dayIdx: number): FormArray | null {
    const dayControl = this.form.get(String(dayIdx));
    return dayControl instanceof FormGroup
      ? (dayControl.get('shifts') as FormArray)
      : null;
  }

  private initForm(): void {
    this.form = this.fb.group({});
    this.weekdays.forEach((value, index) => {
      const shiftsArray = this.fb.array(
        this.businessHours[index].shifts.map((shift) =>
          this.fb.group({
            from: [{ value: shift.from, disabled: this.disabled }],
            to: [{ value: shift.to, disabled: this.disabled }],
          }),
        ),
      );
      const fg = this.fb.group(
        {
          open: [
            { value: this.businessHours[index].open, disabled: this.disabled },
          ],
          shifts: shiftsArray,
        },
        { validators: daySettingsValidator },
      );
      this.form.addControl(String(index), fg);
    });
  }

  private getTimeOptions(
    startTime: string,
    maxTime: string,
    interval: number,
  ): string[] {
    const start = moment(startTime, 'HH:mm');
    const max = moment(maxTime, 'HH:mm');

    const timeOptions = [];
    while (start <= max) {
      timeOptions.push(moment(start).format('HH:mm'));
      start.add(interval, 'minutes');
    }

    return timeOptions;
  }

  ngOnDestroy(): void {
    this.formValueChangesSubscription.unsubscribe();
  }
}
