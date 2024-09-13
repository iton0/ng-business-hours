import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { LocalizedDatePipe } from './localized-date.pipe';
import { daySettingsValidator } from './day-settings.validator';
import {
  Shift,
  NgBusinessHoursDaySettings,
} from './ng-business-hours-day-settings.model';

@Component({
  selector: 'ng-business-hours',
  templateUrl: './ng-business-hours.component.html',
  styleUrls: ['./ng-business-hours.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NgBusinessHoursComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => NgBusinessHoursComponent),
    },
  ],
})
export class NgBusinessHoursComponent
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
  defaultBusinessHours: NgBusinessHoursDaySettings[] = [
    {
      open: true,
      shifts: [
        { from: this.timeFrom, to: this.timeTo },
        { from: this.timeFrom, to: this.timeTo },
        //{ from: '21:00', to: '4:00', overnight: true },
      ],
    },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: true, shifts: [{ from: this.timeFrom, to: this.timeTo }] },
    { open: false, shifts: [{ from: '', to: '' }] },
    { open: false, shifts: [{ from: '', to: '' }] },
  ];
  businessHours!: NgBusinessHoursDaySettings[];

  onChange = (obj: NgBusinessHoursDaySettings[]) => {
    const values = Object.values(obj);
    this.onValuesChange(values);
  };
  onValuesChange = (value: NgBusinessHoursDaySettings[]) => {};
  onTouched = () => {};

  constructor(
    private localizedDatePipe: LocalizedDatePipe,
    private fb: FormBuilder,
  ) {
    this.weekdays = Array.from(Array(7).keys());
    this.timeOptions = this.getTimeOptions(
      this.startTime,
      this.maxTime,
      this.interval,
    );
    this.businessHours = this.defaultBusinessHours;
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

  writeValue(obj: []): void {
    if (obj && obj.length > 0) {
      const values = { ...obj };
      this.businessHours = values;
      this.form.setValue(values, { emitEvent: false });
    } else {
      this.form.setValue(this.defaultBusinessHours, { emitEvent: true });
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    }

    return { businessHoursInvalid: true };
  }

  onChangeOperationState(i: number): void {
    if (this.disabled) {
      return;
    }

    this.businessHours[i].open = !this.businessHours[i].open;
    this.form.get(String(i))?.get('open')?.setValue(this.businessHours[i].open);

    if (this.businessHours[i].open) {
      this.form
        .get(String(i))
        ?.get('shifts')
        ?.get('from')
        ?.setValue(this.timeFrom);
      this.form.get(String(i))?.get('shifts')?.get('to')?.setValue(this.timeTo);
    } else {
      this.form.get(String(i))?.get('shifts')?.get('from')?.setValue('');
      this.form.get(String(i))?.get('shifts')?.get('to')?.setValue('');
    }
  }

  getDateForWeekDay(num: number): Date {
    return moment()
      .startOf(this.isoWeek ? 'isoWeek' : 'week')
      .add(num, 'day')
      .toDate();
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

  // TODO: implement these functions to use in the html
  addShift(dayIdx: number, newShift: Shift) {
    const selDay = this.defaultBusinessHours[dayIdx];
    if (selDay.open && this.hasShiftConflict(selDay, newShift)) {
      selDay.shifts.push(newShift);
    } else {
      return;
    }
  }

  removeShift(dayIdx: number, shiftToRemove: Shift) {
    const selDay = this.defaultBusinessHours[dayIdx];
    const shiftIdx = selDay.shifts.findIndex(
      (shift) =>
        shift.from === shiftToRemove.from && shift.to === shiftToRemove.to,
    );
    if (selDay.open && shiftIdx !== -1) {
      selDay.shifts.splice(shiftIdx, 1);
    } else {
      return;
    }
  }

  changeShift(dayIdx: number, shiftToChange: Shift, changedShift: Shift) {
    const selDay = this.defaultBusinessHours[dayIdx];
    const shiftIdx = selDay.shifts.findIndex(
      (shift) =>
        shift.from === shiftToChange.from && shift.to === shiftToChange.to,
    );
    if (
      selDay.open &&
      shiftIdx !== -1 &&
      this.hasShiftConflict(selDay, changedShift)
    ) {
      selDay.shifts[shiftIdx].from = changedShift.from;
      selDay.shifts[shiftIdx].to = changedShift.to;
    } else {
      return;
    }
  }

  private hasShiftConflict(
    day: NgBusinessHoursDaySettings,
    currShift: Shift,
  ): boolean {
    return !day.shifts.some((shift) => {
      (shift.from === currShift.from || shift.to === currShift.from) &&
        (shift.from === currShift.to || shift.to === currShift.to);
    });
  }
  //private createOvernightShift(shift: Shift): void {}

  private getTimeOptions(
    startTime: string,
    maxTime: string,
    interval: number,
  ): string[] {
    const start = moment(startTime, 'HH:mm');
    const max = moment(maxTime, 'HH:mm');

    const timeOptions = [];
    while (start <= max) {
      timeOptions.push(moment(start).format(this.timeFormat));
      start.add(interval, 'minutes');
    }

    return timeOptions;
  }

  ngOnDestroy(): void {
    this.formValueChangesSubscription.unsubscribe();
  }
}
