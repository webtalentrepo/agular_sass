import { CommonModule, CurrencyPipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { WebcamModule } from 'ngx-webcam';

import { CheckoutWrapperElementsModule } from '@pe/checkout-wrapper-main';
import { WrapperAndPaymentsApiModule } from '@pe/checkout-wrapper-sdk-api';
import {
  CheckoutMicroService,
  CheckoutSharedService,
  ECMAScriptSupportService,
  MicroModule,
} from '@pe/common';
import { ConfirmationScreenModule } from '@pe/confirmation-screen';
import { FormModule } from '@pe/forms';
import { I18nModule } from '@pe/i18n';
import { SecondFactorCodeModule } from '@pe/second-factor-code';
import {
  PeAuthCodeModule,
  PebButtonModule,
  PebButtonToggleModule,
  PebCheckboxModule,
  PebDateTimePickerModule,
  PebFormBackgroundModule,
  PebFormFieldInputModule,
  PebMessagesModule,
} from '@pe/ui';


import { ApiService } from '../services/api.service';
import { SettingsService } from '../services/settings.service';
import { SharedModule } from '../shared/shared.module';
import { TokenInterceptor } from '../token.interceptor';

import { ActionSubmitComponent } from './components/actions/action-submit/action-submit.component';
import { ActionsListComponent } from './components/actions/actions-list/actions-list.component';
import { ActionAuthorizeComponent } from './components/actions/authorize/authorize.component';
import { ActionCancelTransactionComponent } from './components/actions/cancel/cancel.component';
import { ActionCaptureComponent } from './components/actions/capture/capture.component';
import { ActionChangeAmountComponent } from './components/actions/change-amount/change-amount.component';
import { ActionChangeDeliveryComponent } from './components/actions/change-delivery/change-delivery.component';
import { ActionChangeReferenceComponent } from './components/actions/change-reference/change-reference.component';
import { ActionCreditAnswerComponent } from './components/actions/credit-answer/credit-answer.component';
import { ActionDownloadSlipComponent } from './components/actions/download-slip/download-slip.component';
import { ActionEditComponent } from './components/actions/edit/edit.component';
import { MoreActionsComponent } from './components/actions/more/more.component';
import { ActionPaidComponent } from './components/actions/paid/paid.component';
import { RefundProductPickerComponent } from './components/actions/refund/product-picker/product-picker';
import { ActionRefundTransactionComponent } from './components/actions/refund/refund.component';
import { ActionShippingGoodsComponent } from './components/actions/shipping-goods/shipping-goods.component';
import { ImageCaptureComponent } from './components/actions/upload/image-capture/image-capture.component';
import { ActionUploadComponent } from './components/actions/upload/upload.component';
import { ActionVerifyByIdComponent } from './components/actions/verify/by-id/verify-by-id.component';
import { ActionVerifyDigitCodeComponent } from './components/actions/verify/digit-code/digit-code.component';
import { ActionVerifyFieldsComponent } from './components/actions/verify/fields/fields.component';
import { ActionVerifySimpleComponent } from './components/actions/verify/simple/simple.component';
import { ActionVerifyComponent } from './components/actions/verify/verify.component';
import { ActionVoidComponent } from './components/actions/void/void.component';
import { BillingSectionComponent } from './components/billing-section/billing-section-component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';
import { GeneralSectionComponent } from './components/general-section/general-section.component';
import { OrderSectionComponent } from './components/order-section/order-section.component';
import { PaymentSectionComponent } from './components/payment-section/payment-section.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';
import { SellerSectionComponent } from './components/seller-section/seller-section-component';
import { ShippingSectionComponent } from './components/shipping-section/shipping-section.component';
import { TimelineSectionComponent } from './components/timeline-section/timeline-section.component';
import { ActionsListContainerComponent, TransactionsDetailsComponent } from './containers';
import { TransactionsDetailsRoutingModule } from './details-routing.module';
import { DetailService } from './services/detail.service';
import { SectionsService } from './services/sections.service';
import { ActionContainerComponent } from './containers/action/action.component';
import { EditActionStylesComponent } from './components/actions/edit/edit-styles/edit-styles.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    TransactionsDetailsRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    SharedModule,
    WebcamModule,
    CheckoutWrapperElementsModule,
    I18nModule,
    WrapperAndPaymentsApiModule,
    SecondFactorCodeModule,
    PebFormFieldInputModule,
    PebButtonToggleModule,
    PebButtonModule,
    MatAutocompleteModule,
    MicroModule,
    PebDateTimePickerModule,
    PebFormBackgroundModule,
    PebCheckboxModule,
    PebMessagesModule,
    PeAuthCodeModule,
    NgxMaskModule.forRoot(maskConfig),
    ConfirmationScreenModule,
  ],
  declarations: [
    TransactionsDetailsComponent,
    GeneralSectionComponent,
    OrderSectionComponent,
    ShippingSectionComponent,
    BillingSectionComponent,
    PaymentSectionComponent,
    SellerSectionComponent,
    TimelineSectionComponent,
    DetailsSectionComponent,
    ProductsSectionComponent,
    ActionCancelTransactionComponent,
    ActionSubmitComponent,
    ActionsListComponent,
    ActionRefundTransactionComponent,
    RefundProductPickerComponent,
    ActionShippingGoodsComponent,
    ActionDownloadSlipComponent,
    ActionEditComponent,
    EditActionStylesComponent,
    MoreActionsComponent,
    ActionChangeAmountComponent,
    ActionChangeReferenceComponent,
    ActionCaptureComponent,
    ActionAuthorizeComponent,
    ActionCreditAnswerComponent,
    ActionPaidComponent,
    ActionVerifyComponent,
    ActionVerifyByIdComponent,
    ActionVerifySimpleComponent,
    ActionVerifyDigitCodeComponent,
    ActionVoidComponent,
    ActionUploadComponent,
    ActionChangeDeliveryComponent,
    ImageCaptureComponent,
    ActionVerifyFieldsComponent,
    ActionsListContainerComponent,
    ActionContainerComponent,
  ],
  providers: [
    ApiService,
    SettingsService,
    SectionsService,
    DetailService,
    CurrencyPipe,
    ECMAScriptSupportService,
    CheckoutMicroService,
    CheckoutSharedService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})

export class TransactionsDetailsModule {

}
