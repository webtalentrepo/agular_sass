import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { EnvironmentConfigInterface, EnvService, PE_ENV } from '@pe/common';

import { TerminalInterface } from '../pos.types';

import { PosEnvService } from './pos-env.service';


@Injectable({ providedIn: 'root' })

export class PosConnectService {
  terminal$: BehaviorSubject<TerminalInterface> = new BehaviorSubject(null);
  integration$: BehaviorSubject<any> = new BehaviorSubject(null);

  get integration(): any {
    return this.integration$.value;
  }

  get terminal(): any {
    return this.terminal$.value;
  }

  constructor(
    private http: HttpClient,
    @Inject(EnvService) private envService: PosEnvService,
    @Inject(PE_ENV) private env: EnvironmentConfigInterface,
  ) {}

  get checkoutWrapperCustomerViewLink(): string {
    return `${this.env.frontend.checkoutWrapper}/pay/create-flow-from-qr/channel-set-id/${this.terminal.channelSet}`;
  }

  requestInitialForm(): Observable<{ form: any }> {
    const url = `${this.integration.extension.url}/app/${this.envService.businessId}/generate`;

    return this.http.post<{ form: any }>(url, {
      businessId: this.envService.businessId,
      businessName: this.envService.businessName,
      url: this.checkoutWrapperCustomerViewLink,
      id: this.terminal._id,
      avatarUrl: this.terminal.logo,
    });
  }
}
