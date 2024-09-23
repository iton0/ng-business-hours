export interface Shift {
  from: string;
  to: string;
}

export interface NgxBusinessHoursSchedulerDaySettings {
  open: boolean;
  shifts: Shift[];
}
