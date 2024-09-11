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
  const timeFrom = moment(group.get('from')?.value, 'HH:mm');
  const timeTo = moment(group.get('to')?.value, 'HH:mm');

  // TODO: check to see what to do with the conditional
  // will this work with overnight shifts? (prob not)
  if (timeFrom < timeTo) {
    group.get('from')?.setErrors(null);
    group.get('to')?.setErrors(null);

    return null;
  }

  group.get('from')?.setErrors({ timeToMustBeGreaterThenTimeFrom: true });
  group.get('to')?.setErrors({ timeToMustBeGreaterThenTimeFrom: true });

  return { timeToMustBeGreaterThenTimeFrom: true };
}
