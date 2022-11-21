import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, skip, takeUntil, tap } from 'rxjs/operators';
import moment from 'moment';

import { TranslateService } from '@pe/i18n-core';
import { MediaService } from '@pe/media';
import {
  OverlayHeaderConfig,
  PE_OVERLAY_CONFIG,
  PE_OVERLAY_DATA,
  PE_OVERLAY_SAVE,
  PeOverlayRef,
} from '@pe/overlay-widget';
import { PeDateTimePickerService } from '@pe/ui';

import { ApiService, CoreConfigService } from '../../services';
import { ImagesUploaderService } from '../../services/images-uploader.service';
import { AbstractComponent } from '../abstract';

@Component({
  selector: 'peb-edit-personal',
  templateUrl: './edit-personal-info.component.html',
  styleUrls: ['./edit-personal-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditPersonalInfoComponent extends AbstractComponent implements OnInit {
  @ViewChild('filePicker') filePicker;
  salutation = [
    { label: this.translateService.translate('form.create_form.personal_information.salutation.mr'), value: 'mr' },
    { label: this.translateService.translate('form.create_form.personal_information.salutation.mrs'), value: 'mrs' },
  ];

  filename: string;
  theme;
  data;
  contactForm: FormGroup;
  get previewImageUrl(): string {
    return this.mediaService.getMediaUrl(this.filename, 'images');
  }

  constructor(
    @Inject(PE_OVERLAY_DATA) public overlayData: any,
    @Inject(PE_OVERLAY_CONFIG) public overlayConfig: OverlayHeaderConfig,
    @Inject(PE_OVERLAY_SAVE) public overlaySaveSubject: BehaviorSubject<any>,
    private formBuilder: FormBuilder,
    private peOverlayRef: PeOverlayRef,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private coreConfigService: CoreConfigService,
    private dateTimePicker: PeDateTimePickerService,
    private imageUpload: ImagesUploaderService,
    private mediaService: MediaService,
    private translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.theme = this.overlayConfig.theme;

    this.contactForm =  this.formBuilder.group({
      salutation: [this.salutation],
      firstName: [''],
      lastName: [''],
      phone: [''],
      email: [{ value: '', disabled: !!this.overlayData.data?.user?.email }],
      logo: [''],
      birthday: [''],
    });
    if (this.overlayData.data.user) {
      this.data = this.overlayData.data.user;
      const details = { ...this.overlayData.data.user };
      details.salutation = details.salutation || '';
      details.birthday =  moment(details.birthday).format('DD.MM.YYYY');
      this.filename = details?.logo || null;
      this.contactForm.patchValue(details);
    }
    this.overlaySaveSubject.pipe(skip(1)).subscribe((dialogRef) => {
      this.onCheckValidity();
    });
  }

  onCheckValidity() {
    const value = this.contactForm.controls;

    value.lastName.setValidators([Validators.required]);
    value.lastName.updateValueAndValidity();

    value.firstName.setValidators([Validators.required]);
    value.firstName.updateValueAndValidity();

    value.phone.setValidators([Validators.pattern(/^\+[0-9]{6,10}/g)]);
    value.phone.updateValueAndValidity();

    value.email.setValidators([
      Validators.pattern(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      )]);
    value.email.updateValueAndValidity();

    this.cdr.detectChanges();

    if (this.contactForm.valid) {
      this.onSave();
    }
  }

  onSave() {
    if (this.contactForm.valid) {
      const newData = {
        salutation: this.contactForm.controls['salutation'].value,
        firstName: this.contactForm.controls['firstName'].value,
        lastName: this.contactForm.controls['lastName'].value,
        phone: this.contactForm.controls['phone'].value,
        email: this.contactForm.controls['email'].value,
        birthday: moment(this.contactForm.controls['birthday'].value , 'DD.MM.YYYY').toISOString(),
        logo: this.contactForm.controls['logo'].value,
      };
      this.overlayConfig.doneBtnTitle = this.translateService.translate('actions.onload');
      this.overlayConfig.isLoading = true;

      this.apiService.updateUserAccount(newData)
        .pipe(tap(() => {
          this.overlayConfig.doneBtnTitle = this.translateService.translate('actions.save');
          this.overlayConfig.isLoading = false;
          this.peOverlayRef.close({ data: newData });
        }), takeUntil(this.destroyed$), catchError(error => {
          this.overlayConfig.doneBtnTitle = this.translateService.translate('actions.save');
          this.overlayConfig.isLoading = false;
          return EMPTY;
        })).subscribe();
    }
  }

  openDatepicker(event, controlName: string): void {
    let name = '';
    if (controlName === 'dateTimeFrom') {
      name = this.translateService.translate('form.create_form.personal_information.date_time.label');
    } else {
      name = this.translateService.translate('form.create_form.personal_information.birthday.label');
    }

    const minDate = moment().toDate();
    minDate.setFullYear(moment().year() - 100);

    const dialogRef = this.dateTimePicker.open(event, {
      theme: this.theme,
      config: { headerTitle: name, range: false, minDate  },
    });
    dialogRef.afterClosed.subscribe((date) => {
      if (date?.start) {
        const formatedDate = moment(date.start).format('DD.MM.YYYY');
        this.contactForm.get(controlName).patchValue(formatedDate);
      }
    });
  }

  uploadImage($event) {
    const file = $event[0];
    if (!file) {
      return;
    }

    this.imageUpload.uploadImages([file]).subscribe((res: any) => {
      if (res.type === 'data') {
        this.filename = res.data.uploadedImages[0].url;
        this.contactForm.controls.logo.patchValue(this.filename);
        this.cdr.detectChanges();
      }
    });
  }
}
