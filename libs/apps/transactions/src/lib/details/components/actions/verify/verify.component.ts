import { ChangeDetectionStrategy, Component, HostBinding, Injector, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AppThemeEnum, PeDestroyService } from '@pe/common';

import { AbstractAction, ActionTypeEnum, VERIFY_PAYMENTS_CONTROLS } from '../../../../shared';
import { GuarantorTypeEnum } from '../../../../shared/enums';
import { VerifyPayloadInterface } from '../../../../shared/interfaces/action.interface';


@Component({
  selector: 'pe-verify-action',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss', '../actions.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PeDestroyService,
  ],
})
export class ActionVerifyComponent extends AbstractAction implements OnInit {
  @HostBinding('class') get themeClass(): AppThemeEnum {
    return this.theme
  }

  isSubmitted = false;
  verify$ = new Subject<void>();

  showById$ = this.order$.pipe(
    map(order => VERIFY_PAYMENTS_CONTROLS[order.payment_option.type]),
    shareReplay(1),
  );

  showSimple$ = this.order$.pipe(
    map(order => !!order.details.pos_verify_type),
    shareReplay(1),
  );

  get isGuarantor (): boolean {
    return this.order.details?.guarantor_type && this.order.details?.guarantor_type !== GuarantorTypeEnum.NONE;
  }

  constructor(
    public injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getData();
  }

  done(): void {
    this.verify$.next();
  }

  verify({ data, dataKey }: VerifyPayloadInterface): void {
    this.isSubmitted = true;

    this.sendAction(
      data,
      ActionTypeEnum.Verify,
      dataKey,
      false
    );
  }

  createForm(): void {}
}
