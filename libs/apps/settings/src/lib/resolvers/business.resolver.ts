import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { settingsBusinessIdRouteParam } from '../misc/constants/route-parameters';
import { OwnerTypesEnum } from '../misc/enum';
import { BusinessInterface } from '../misc/interfaces';
import { ApiService, BusinessEnvService } from '../services';
import { SettingsRootRoutesEnum } from '../settings-root-routes.enum';

@Injectable()
export class BusinessResolver implements Resolve<Object> {
  constructor(private apiService: ApiService,
              private envService: BusinessEnvService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Object> | Object {
    const businessUid = route.parent.params['slug'] || route.parent.params[settingsBusinessIdRouteParam];

    if (route.params?.modal || state.url.includes(SettingsRootRoutesEnum.Personal)) {
      return null;
    }

    return this.apiService.getBusiness(businessUid).pipe(tap((business: BusinessInterface) => {
        this.envService.businessData = business;
        this.envService.businessUuid = businessUid;
        this.envService.ownerType = OwnerTypesEnum.Business;
      }));
  }
}
