import { Component, Injector } from '@angular/core';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-shipping-section',
  templateUrl: './shipping-section.component.html',
  styleUrls: ['./shipping-section.component.scss'],
})

export class ShippingSectionComponent extends BaseSectionClass {

  constructor(
    public detailService: DetailService,
    public injector: Injector
  ) {
    super(injector);
  }
}
