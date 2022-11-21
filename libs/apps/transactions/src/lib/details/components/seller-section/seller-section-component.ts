import { Component, Input } from '@angular/core';

import { AppThemeEnum } from '@pe/common';
import { AddressService } from '@pe/forms-core';

import { DetailInterface } from '../../../shared';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-seller-section',
  templateUrl: './seller-section-component.html',
  styleUrls: ['./seller-section-component.scss'],
})

export class SellerSectionComponent {
  @Input() theme: AppThemeEnum = AppThemeEnum.default;

  get order(): DetailInterface {
    return this.detailService.orderData;
  }

  get sellerName(): string {
    return this.order.seller?.name;
  }

  get sellerEmail(): string {
    return this.order.seller?.email;
  }

  constructor(
    private detailService: DetailService,
    private addressService: AddressService,
  ) {

  }
}
