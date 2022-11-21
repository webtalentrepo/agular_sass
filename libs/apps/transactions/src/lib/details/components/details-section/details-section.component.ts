import { Component, Injector } from '@angular/core';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-details-section',
  templateUrl: './details-section.component.html',
  styleUrls: ['./details-section.component.scss'],
})

export class DetailsSectionComponent extends BaseSectionClass {

  constructor(
    public detailSevrice: DetailService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
