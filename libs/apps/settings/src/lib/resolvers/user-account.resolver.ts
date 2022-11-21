import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserAccountInterface } from '@pe/shared/user';

import { OwnerTypesEnum } from '../misc/enum';
import { ApiService, BusinessEnvService } from '../services';
import { SettingsRootRoutesEnum } from '../settings-root-routes.enum';

@Injectable()
export class UserAccountResolver implements Resolve<UserAccountInterface> {
  constructor(private apiService: ApiService,
              private envService: BusinessEnvService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserAccountInterface> | UserAccountInterface {
    return this.apiService.getUserAccount().pipe(tap((userData: UserAccountInterface) => {
      this.envService.userAccount = userData;
      this.envService.userUuid = userData._id;
      const firstSegment = route.url[0];

      if (firstSegment) {
        const ownerType = firstSegment.path === SettingsRootRoutesEnum.Business
          ? OwnerTypesEnum.Business
          : OwnerTypesEnum.Personal;

        this.envService.ownerType = ownerType;
      }
    }));
  }
}
