import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { BusinessState, SettingsBusinessInterface } from '@pe/business';
import { EnvService } from '@pe/common';

import { ApiService } from '../services';

@Injectable()
export class SettingsAccessGuard implements CanActivate {
  @SelectSnapshot(BusinessState.businessData) businessData: SettingsBusinessInterface;

  constructor(
    private envService: EnvService,
    private settingsApiService: ApiService,
  ) {}

  canActivate(): Observable<boolean> | boolean {
    this.envService.businessData = this.businessData;
    this.envService.businessId = this.businessData._id;

    return this.settingsApiService.checkAccess(this.envService.businessId).pipe(
      mapTo(true),
    );
  }
}
