import { Component, Injector } from '@angular/core';

import { AddressService } from '@pe/forms-core';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-billing-section',
  templateUrl: './billing-section-component.html',
  styleUrls: ['./billing-section-component.scss'],
})

export class BillingSectionComponent extends BaseSectionClass {

  constructor(
    public detailService: DetailService,
    public addressService: AddressService,
    public injector: Injector
  ) {
    super(injector);
  }
}
