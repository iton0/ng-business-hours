import { FormGroup, ValidationErrors } from '@angular/forms';
import moment from 'moment';

export function daySettingsValidator(
  group: FormGroup,
): ValidationErrors | null {
  const isOpen = group.get('open')?.value;

  if (!isOpen) {
    return null; // No validation required if the business is closed
  }

  const shifts = group.get('shifts')?.value as { from: string; to: string }[];

  // Track if there are any validation errors
  let hasErrors = false;

  // Validate each shift
  shifts.forEach((shift, index) => {
    const timeFrom = moment(shift.from, 'HH:mm');
    const timeTo = moment(shift.to, 'HH:mm');

    if (timeFrom.isValid() && timeTo.isValid() && timeFrom.isBefore(timeTo)) {
      // Clear errors if valid
      group.get('shifts')?.get(String(index))?.get('from')?.setErrors(null);
      group.get('shifts')?.get(String(index))?.get('to')?.setErrors(null);
    } else {
      // Set errors if invalid
      hasErrors = true;
      group
        .get('shifts')
        ?.get(String(index))
        ?.get('from')
        ?.setErrors({ timeToMustBeGreaterThenTimeFrom: true });
      group
        .get('shifts')
        ?.get(String(index))
        ?.get('to')
        ?.setErrors({ timeToMustBeGreaterThenTimeFrom: true });
    }
  });

  return hasErrors ? { timeToMustBeGreaterThenTimeFrom: true } : null;
}
