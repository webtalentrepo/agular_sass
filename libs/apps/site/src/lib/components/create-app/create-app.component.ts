import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { PeAlertDialogService } from '@pe/alert-dialog';
import { PebEditorApi } from '@pe/builder-api';
import { PebShopContainer } from '@pe/builder-core';
import { PeDestroyService } from '@pe/common';
import { EnvService } from '@pe/common';
import { TranslateService } from '@pe/i18n';
import { PeOverlayWidgetService, PE_OVERLAY_CONFIG, PE_OVERLAY_DATA } from '@pe/overlay-widget';

import { SiteEnvService } from '../../services/site-env.service';
import { PebSitesApi } from '../../services/site/abstract.sites.api';

@Component({
  selector: 'peb-create-app',
  templateUrl: './create-app.component.html',
  styleUrls: ['./create-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PeDestroyService],
})
export class PeSettingsCreateAppComponent {
  siteId: string;
  errorMsg: string;
  isImageLoading: boolean;

  siteConfig = {
    siteName: '',
    siteImage: '',
  }

  constructor(
    private destroy$: PeDestroyService,
    private apiSite: PebSitesApi,
    @Inject(PE_OVERLAY_DATA) public appData: any,
    @Inject(PE_OVERLAY_CONFIG) public config: any,
    private overlay: PeOverlayWidgetService,
    @Inject(EnvService) protected envService: SiteEnvService,
    private cdr: ChangeDetectorRef,
    private api: PebEditorApi,
    private alertDialog: PeAlertDialogService,
    private translateService: TranslateService,
  ) {

    if (this.appData.id) {
      this.config.doneBtnTitle = 'Open';
      this.config.title = this.appData.name;
      this.siteConfig.siteName = this.appData.name;
      this.siteConfig.siteImage = this.appData.picture;
      this.siteId = appData.id;
      this.config.doneBtnCallback = () => {
        const paylod: {
          name?: string,
          picture?: string,
        } = {}
        if (this.siteConfig.siteName !== this.appData.name) {
          paylod.name = this.siteConfig.siteName;
        }
        if (this.siteConfig.siteImage !== this.appData.picture) {
          paylod.picture = this.siteConfig.siteImage;
        }
        if (!this.errorMsg) {
          if (!paylod.picture && !paylod.name) {
            this.appData.isDefault ?
              this.openDashboard(this.appData) :
              this.apiSite.markSiteAsDefault(this.appData.id).subscribe((data) => {
                this.openDashboard(data);
              });
          }
          else {
            this.apiSite.updateSite(this.appData.id, paylod).pipe(
              switchMap((site) => {
                return this.appData.isDefault ?
                  of(this.openDashboard(site)) :
                  this.apiSite.markSiteAsDefault(this.appData.id)
                    .pipe(tap(data => this.openDashboard(data)));
              }),
            ).subscribe((data) => { }, (error) => {
              this.errorMsg = error.error.errors;
              this.cdr.markForCheck();
            })
          }
        }
      }

      return;
    }
    this.config.doneBtnTitle = 'Create';
    this.config.doneBtnCallback = () => {
      const payload: { name: string, picture?: string } = {
        name: this.siteConfig.siteName,
      }
      if (this.siteConfig.siteImage) {
        payload.picture = this.siteConfig.siteImage;
      }
      if (!this.errorMsg) {
        this.apiSite.createSite(payload).pipe(
          switchMap((data) => {
            this.appData.id = data.id;

            return this.apiSite.markSiteAsDefault(data.id);
          }),
          tap((data) => {
            this.openDashboard(data);
          }),
        ).subscribe()
      }
    }
  }

  openDashboard(site) {
    this.envService.applicationId = this.appData.id;
    this.appData.onSaved$.next({ openSite: true, site });
    this.overlay.close();
  }

  validateSite(value) {
    this.siteConfig.siteName = value;
    if (!this.validateName(value)) {
      this.errorMsg = value.length < 3 ? 'Name should have at least 3 characters' : 'Name is not correct';
      this.cdr.markForCheck();

      return;
    }
    this.apiSite.validateSiteName(value).subscribe((data) => {
      this.errorMsg = data.message ? data.message : null;
      this.cdr.markForCheck();
    })
  }

  validateName(name: string) {
    return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/.test(name);
  }

  removeSite() {
    this.alertDialog.open({
      data: {
        title: this.translateService.translate('site-app.dialogs.window_exit.title'),
        subtitle: this.translateService.translate('site-app.dialogs.delete_site.label'),
        actions: [
          {
            label: this.translateService.translate('site-app.dialogs.window_exit.confirm'),
            bgColor: '#eb4653',
            callback: () => this.apiSite.deleteSite(this.appData.id).pipe(
              tap(() => this.appData.onSaved$.next({ updateSiteList: true })),
              catchError(() => of(undefined)),
              finalize(() => this.overlay.close()),
            ).toPromise(),
          },
          {
            label: this.translateService.translate('site-app.dialogs.window_exit.decline'),
            callback: () => Promise.resolve(),
          },
        ],
      },
    });
  }

  onLogoUpload($event: any) {
    this.isImageLoading = true;
    const files = $event;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.api.uploadImageWithProgress(PebShopContainer.Images, file).pipe(
          takeUntil(this.destroy$),
          tap((event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress: {
                this.cdr.detectChanges();
                break;
              }
              case HttpEventType.Response: {
                this.siteConfig.siteImage = (event?.body?.blobName || reader.result as string);
                this.isImageLoading = false;
                this.cdr.detectChanges();
                break;
              }
              default:
                break;
            }
          }),
        ).subscribe();
      };
    }
  }

}
