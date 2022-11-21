import { Component, Injector } from '@angular/core';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-payment-section',
  templateUrl: './payment-section.component.html',
  styleUrls: ['./payment-section.component.scss'],
})

export class PaymentSectionComponent extends BaseSectionClass {

  constructor(
    public detailService: DetailService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
