import { Component, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { TransactionsListService } from '../../../services/list.service';
import { StatusUpdaterService } from '../../../services/status-updater.service';
import { StatusType } from '../../../shared/interfaces/status.type';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-general-section',
  templateUrl: './general-section.component.html',
  styleUrls: ['./general-section.component.scss'],
})

export class GeneralSectionComponent extends BaseSectionClass {

  get quantity(): number {
    return this.detailService.quantity;
  }

  constructor(
    public detailService: DetailService,
    public listService: TransactionsListService,
    public injector: Injector,
    private statusUpdaterService: StatusUpdaterService,
  ) {
    super(injector);
  }

  getStatus$(): Observable<StatusType> {
    return this.statusUpdaterService.getStatus$(this.order.transaction.uuid).pipe(map(s => s || this.order.status.general));
  }
}
