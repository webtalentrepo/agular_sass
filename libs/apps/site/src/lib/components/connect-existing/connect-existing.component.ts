import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { TranslateService } from '@pe/i18n-core';
import { PeOverlayWidgetService, PE_OVERLAY_CONFIG, PE_OVERLAY_DATA } from '@pe/overlay-widget';

import { PebSitesApi } from '../../services/site/abstract.sites.api';

@Component({
  selector: 'peb-connect-existing',
  templateUrl: './connect-existing.component.html',
  styleUrls: ['./connect-existing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeSettingsConnectExistingComponent {
  domainName: string;
  domainId: string;
  errorMsg: string;
  isConnected: boolean;
  domainInfo = {
    currentIp: '',
    requiredIp: '',
    currentValue: '',
    requiredValue: '',
  };

  step = 1;

  constructor(
    private apiSite: PebSitesApi,
    private translateService: TranslateService,
    @Inject(PE_OVERLAY_DATA) private appData: any,
    @Inject(PE_OVERLAY_CONFIG) public config: any,
    private overlay: PeOverlayWidgetService,
    private cdr: ChangeDetectorRef,
  ) {
    this.config.doneBtnCallback = () => {
      this.resetDomain()
    }
    appData.closeEvent.subscribe((closed) => {
      if(closed) {
        this.resetDomain();
      }
    })
  }

  private resetDomain() {
    if (!this.domainId || this.isConnected) {
      this.overlay.close();

      return;
    }
    this.apiSite.deleteDomain(this.appData.id, this.domainId).subscribe(data => this.overlay.close());
  }

  verify() {
    if (!this.domainName) {return;}
    this.apiSite.addDomain(this.appData.id, this.domainName).pipe(
      switchMap((data) => {
        this.domainId = data.id;

        return this.apiSite.checkDomain(this.appData.id, data.id);
      }),
    ).subscribe(
      (info) => {
        this.step = 2;
        this.domainInfo.currentIp = info.currentIp;
        this.domainInfo.requiredIp = info.requiredIp;
        this.domainInfo.currentValue = info.currentCname;
        this.domainInfo.requiredValue = info.requiredCname;
        this.isConnected = info.isConnected;
        this.cdr.detectChanges();
      },
      (error) => {
        this.errorMsg = error.error.message;
        this.cdr.detectChanges();
      },
    )

  }

  connect() {
    this.overlay.close();
  }

  getfields(info) {
    let fields = '';
    if (info.currentIp !== info.requiredIp) { fields = fields + 'A ' }
    (info.currentValue !== info.requiredValue) ?
      fields.length ? fields = fields + '& CNAME' : fields = fields + 'CNAME' : null;

    return fields;

  }
}
