import { Component, Inject, Injector } from '@angular/core';

import { EnvironmentConfigInterface, PE_ENV } from '@pe/common';
import { MediaContainerType, MediaUrlPipe } from '@pe/media';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.scss'],
  providers: [
    MediaUrlPipe,
  ],
})

export class ProductsSectionComponent extends BaseSectionClass {

  constructor(
    public detailService: DetailService,
    public ingector: Injector,
    private mediaUrlPipe: MediaUrlPipe,
    @Inject(PE_ENV) private env: EnvironmentConfigInterface,
  ) {
    super(ingector);
  }

  get fallbackImage(): string {
    return `${this.env.custom.cdn}/images/fallback.png`;
  }

  productImage(imgUrl: string) {
    return this.mediaUrlPipe.transform(imgUrl, MediaContainerType.Products)
  }
}
