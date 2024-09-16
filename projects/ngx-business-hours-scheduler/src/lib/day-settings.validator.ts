import { FormGroup, ValidationErrors } from '@angular/forms';
import moment from 'moment';

export function daySettingsValidator(
  group: FormGroup,
): ValidationErrors | null {
  const isOpen = group.get('open')?.value;

  if (!isOpen) {
    return null;
  }

  // TODO: update this validation to check for each to and from from each individual shift
  const shifts = group.get('shifts')?.value;
  if (shifts != null) {
    const timeFrom = moment(group.get(shifts['from'])?.value, 'HH:mm');
    const timeTo = moment(group.get(shifts['to'])?.value, 'HH:mm');
  }

  group.get('from')?.setErrors({ timeToMustBeGreaterThenTimeFrom: true });
  group.get('to')?.setErrors({ timeToMustBeGreaterThenTimeFrom: true });

  return { timeToMustBeGreaterThenTimeFrom: true };
}
