export interface Shift {
  from: string;
  to: string;
}

export interface NgBusinessHoursDaySettings {
  open: boolean;
  shifts: Shift[];
  is24?: boolean;
}
