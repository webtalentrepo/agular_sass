import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { TranslateService } from '@pe/i18n';

import { MOBILE_PHONE_PATTERN } from '../misc/constants/validation-patterns.constants';

@Injectable()
export class ValidationErrorsMapperService {
  private readonly errorsLocalesMap = {
    required: 'common.forms.validations.required',
    email: 'common.forms.validations.email.invalid',
    [`${MOBILE_PHONE_PATTERN.toString()}`]: 'common.forms.validations.pattern.mobile_phone',
  };

  constructor(private translationService: TranslateService) { }

  getErrorMessage(errorName: string): string {
    return this.translationService.translate(this.errorsLocalesMap[errorName]);
  }

  getAllErrorMessages(errors: ValidationErrors): string[] {
    const allErrorNames = Object.keys(errors || {});

    return allErrorNames.map(errorName => this.getErrorMessage(errorName));
  }
}
