import { Component, Injector } from '@angular/core';

import { BaseSectionClass } from '../../../classes/base-section.class';
import { DetailService } from '../../services/detail.service';

@Component({
  selector: 'pe-timeline-section',
  templateUrl: './timeline-section.component.html',
  styleUrls: ['./timeline-section.component.scss'],
})

export class TimelineSectionComponent extends BaseSectionClass {

  constructor(
    public detailService: DetailService,
    public injector: Injector,
  ) {
    super(injector);
  }
}
