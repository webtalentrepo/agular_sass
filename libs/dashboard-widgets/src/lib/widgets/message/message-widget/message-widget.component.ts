import { Component, Injector, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { EMPTY } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { MessageInterface } from '@pe/dashboard-widgets';
import { EditWidgetsService, MessageNameEnum } from '@pe/shared/widget';
import { Widget } from '@pe/widgets';


import { AbstractWidgetComponent } from '../../abstract-widget.component';

@Component({
  selector: 'message-widget',
  templateUrl: './message-widget.component.html',
  styleUrls: ['./message-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageWidgetComponent extends AbstractWidgetComponent implements OnInit {
  readonly appName: string = 'message';
  @Input() widget: Widget;

  constructor(
    injector: Injector,
    private cdr: ChangeDetectorRef,
    private editWidgetsService:EditWidgetsService,

  ) {
    super(injector);
    const DEFAULT_MESSAGE_DATA = this.envService.isPersonalMode
      ? MessageNameEnum.PERSONAL_DEFAULT_MESSAGE_DATA
      : MessageNameEnum.BUSINESS_DEFAULT_MESSAGE_DATA;
    this.editWidgetsService.emitEventWithInterceptor(DEFAULT_MESSAGE_DATA);
  }

  ngOnInit(): void {

    this.editWidgetsService.defaultMessageSubject$.pipe(
      takeUntil(this.destroyed$),
      tap((data : MessageInterface[]) => {
        this.widget = {
          ...this.widget,
          data: data,
          openButtonFn: () => {
            this.onOpenButtonClick();

            return EMPTY;
          },
        };
        this.cdr.detectChanges();
      }),

    ).subscribe();
  }
}
