import { Component, Injector } from '@angular/core';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-order-section',
  templateUrl: './order-section.component.html',
  styleUrls: ['./order-section.component.scss'],
})

export class OrderSectionComponent extends BaseSectionClass {

  constructor(
    public detailService: DetailService,
    public injector: Injector
  ) {
    super(injector);
  }
}
