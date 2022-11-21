import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApmService } from '@elastic/apm-rum-angular';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { NgxsModule } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import moment from 'moment';
import { BehaviorSubject, of } from 'rxjs';

import { EnvService, MessageBus, PE_ENV, PeDestroyService, PeGridItemType, PePreloaderService } from '@pe/common';
import { ConfirmScreenService } from '@pe/confirmation-screen';
import { PeDataGridService, PeDataGridSidebarService } from '@pe/data-grid';
import { FolderOutputEvent, FolderService, MoveIntoRootFolderEvent } from '@pe/folders';
import { PeGridQueryParamsService, PeGridService, PeGridSidenavService, PeGridViewportService } from '@pe/grid';
import { CurrencySymbolPipe, LocaleConstantsService, TranslateService } from '@pe/i18n';
import { SimpleLocaleConstantsService } from '@pe/i18n-core';
import { MediaService, MediaUrlPipe } from '@pe/media';
import { PeOverlayWidgetService } from '@pe/overlay-widget';
import { PePlatformHeaderService } from '@pe/platform-header';
import { ProductsAppState } from '@pe/shared/products';
import { SnackbarService } from '@pe/snackbar';

import { ProductsApiService } from '../../../shared/services/api.service';
import { DefaultCountryService } from '../../../shared/services/country.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { ChannelTypeIconService } from '../../services/channel-type-icon.service';
import { DataGridService } from '../../services/data-grid/data-grid.service';
import { DialogService } from '../../services/dialog-data.service';
import { ImportApiService } from '../../services/import/import-api.service';
import { ProductsFoldersService } from '../../services/products-folder.service';
import { ProductsListService } from '../../services/products-list.service';
import { ProductsRuleService } from '../../services/products-rules.service';
import { ValuesService } from '../../services/values.service';

import { ProductsListComponent } from './products-list.component';

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  const TranslateServiceSpy = jasmine.createSpyObj<TranslateService>('TranslateService', [
    'translate',
    'hasTranslation',
  ]);
  TranslateServiceSpy.translate.and.callFake((key: string) => `${key}.translated`);
  const simpleLocaleConstantsServiceSpy = jasmine.createSpyObj<SimpleLocaleConstantsService>(
    'SimpleLocaleConstantsService',
    ['getLang'],
  );
  simpleLocaleConstantsServiceSpy.getLang.and.callFake(() => `en`);

  const pePreloaderServiceSpy = jasmine.createSpyObj<PePreloaderService>('PePreloaderService', [
    'startLoading',
    'initFinishObservers',
  ]);

  const sanitizerSpy = jasmine.createSpyObj<DomSanitizer>('DomSanitizer', {
    bypassSecurityTrustStyle: 'style.passed',
    bypassSecurityTrustResourceUrl: () => {},
  });

  const iconRegistrySpy = jasmine.createSpyObj<MatIconRegistry>('MatIconRegistry', ['addSvgIcon']);

  const productsRuleServiceSpy = jasmine.createSpyObj<ProductsRuleService>('ProductsRuleService', {
    initRuleListener: null,
  });

  const envMock = {
    custom: {
      cdn: 'cdn',
    },
    backend: {
      products: '',
    },
  };

  const peGridViewportServiceMock = {
    deviceTypeChange$: of(),
  };

  const peGridSidenavServiceMock = {
    toggleOpenStatus$: of(),
  };

  const fb = new FormBuilder();
  const fbGroup = fb.group({
    tree: [[]],
    toggle: [false],
  });

  const exampleProductData = {
    item: {
      images: [],
      currency: 'EUR',
      country: 'DE',
      language: 'de',
      id: 'c065db41-5fdd-40f4-8b02-a08d8a862113',
      title: 'test product',
      description: '',
      onSales: false,
      price: 400,
      salePrice: null,
      vatRate: 16,
      sku: 'fdsdsfds',
      barcode: '',
      type: 'physical',
      active: true,
      priceTable: [],
      collections: [],
      categories: [],
      channelSets: [
        {
          id: 'a8cd6098-065a-430a-8e9c-98ac919f865e',
          type: 'pos',
          name: 'New business',
        },
        {
          id: '3290cae4-abe4-41e4-9433-fce09136593e',
          type: 'shop',
          name: 'New business-ajyx',
        },
        {
          id: '1240fbd0-e693-4f0e-9471-1a4e56ad3550',
          type: 'dropshipping',
          name: null,
        },
      ],
      variants: [],
      shipping: {
        weight: 0,
        width: 0,
        length: 0,
        height: 0,
      },
      seo: {
        title: null,
        description: null,
      },
    },
    isEdit: false,
  };

  const dataGridServiceSpy = jasmine.createSpyObj<DataGridService>(
    'DataGridService',
    {},
    {
      duplicatedGridItem$: new BehaviorSubject<any>(null),
      updatedGridItem$: new BehaviorSubject<any>(exampleProductData),
      filtersFormGroup: fbGroup,
      allFilters$: of(),
    },
  );

  const gridQueryParamsServiceMock = {
    getQueryParamByName: () => of(),
    pageToParams: () => of(),
  };

  const messageBusMock = {
    listen: () => of(),
  };

  const peGridServiceMock = {
    selectedItems$: of(),
    restoreScroll$: {
      next: jasmine.createSpy('next'),
    },
  };

  const apmServiceMock = {
    apm: {
      captureError: () => {},
    },
  };

  let exampleFolderContent = {
    collection: [
      {
        applicationId: null,
        businessId: '44ded02d-fcb0-4686-bbd3-70d03b72f8de',
        parentFolderId: '9b5e2579-64e3-465e-8f13-97531054792b',
        scope: 'business',
        title: 'Item in folder',
        userId: null,
        apps: [],
        active: true,
        barcode: '',
        company: 'LastSeenTest',
        country: 'DE',
        createdAt: '2022-09-20T14:43:43.878Z',
        currency: 'EUR',
        imagesUrl: [],
        price: 432432,
        sku: 'sku',
        type: 'physical',
        vatRate: 16,
        videosUrl: [],
        updatedAt: '2022-09-20T15:33:01.314Z',
        isFolder: false,
        serviceEntityId: '00107ddb-a253-4970-804a-39a6c3e12a6f',
        id: '20e1a47e-77af-4580-8165-142f22c89d31',
        _id: '20e1a47e-77af-4580-8165-142f22c89d31',
      },
      {
        applicationId: null,
        businessId: '44ded02d-fcb0-4686-bbd3-70d03b72f8de',
        parentFolderId: '9b5e2579-64e3-465e-8f13-97531054792b',
        scope: 'business',
        title: 'Item created just now',
        userId: null,
        apps: [],
        active: true,
        barcode: '',
        company: 'LastSeenTest',
        country: 'DE',
        createdAt: moment(),
        currency: 'EUR',
        imagesUrl: [],
        price: 432432,
        sku: 'sku',
        type: 'physical',
        vatRate: 16,
        videosUrl: [],
        updatedAt: '2022-09-20T15:33:01.314Z',
        isFolder: false,
        serviceEntityId: '00107ddb-a253-4970-804a-39a6c3e12a6f',
        id: '20e1a47e-77af-4580-8165-142f22c89d31',
        _id: '20e1a47e-77af-4580-8165-142f22c89d31',
      },
    ],
    filters: {},
    pagination_data: {
      page: 1,
      total: 1,
    },
    usage: {},
  };

  let productsApiServiceSpy = jasmine.createSpyObj<ProductsApiService>('ProductsApiService', {
    getFolderDocuments: of(exampleFolderContent),
    moveToRoot: of(),
    deleteFolder: of(),
    getFolders: of(),
    getBusinessSetting: of(),
    getSkusStock: of(null),
  });

  let productsFoldersServiceSpy = jasmine.createSpyObj<ProductsFoldersService>('ProductsFoldersService', [
    'onDeleteFolder',
  ]);

  let exampleEvent: FolderOutputEvent = {
    data: {
      _id: '77f36ae2-6aa7-49b9-bf33-9ec038b97e85',
      name: 'test',
      isAvatar: false,
      abbrText: null,
      isHeadline: false,
      children: [],
      parentFolderId: 'dd480d78-e5dc-4622-831f-5098b7677043',
      isProtected: false,
      position: 54,
    },
  };

  const mediaUrlPipeSpy = jasmine.createSpyObj<MediaUrlPipe>('MediaUrlPipe', {
    transform: 'transformed',
  });

  const pePlatformHeaderServiceSpy = jasmine.createSpyObj<PePlatformHeaderService>('PePlatformHeaderService', {
    setFullHeader: null,
    assignConfig: null,
  });

  const currencySymbolPipeMock = {
    transform: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsListComponent, TranslatePipe, CurrencySymbolPipe],
      imports: [NgxsModule.forRoot([ProductsAppState]), NgxsSelectSnapshotModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: DataGridService, useValue: dataGridServiceSpy },
        { provide: PeDataGridSidebarService, useValue: {} },
        { provide: PeDataGridService, useValue: {} },
        { provide: ValuesService, useValue: {} },
        ProductsListService,
        { provide: ChangeDetectorRef, useValue: {} },
        { provide: CurrencyService, useValue: {} },
        { provide: MediaService, useValue: {} },
        { provide: ImportApiService, useValue: {} },
        { provide: SnackbarService, useValue: {} },
        { provide: TranslateService, useValue: TranslateServiceSpy },
        { provide: SimpleLocaleConstantsService, useValue: simpleLocaleConstantsServiceSpy },
        { provide: EnvService, useValue: {} },
        { provide: ApmService, useValue: apmServiceMock },
        { provide: PeGridService, useValue: peGridServiceMock },
        { provide: FolderService, useValue: {} },
        { provide: ProductsApiService, useValue: productsApiServiceSpy },
        { provide: ProductsFoldersService, useValue: productsFoldersServiceSpy },
        { provide: PeGridQueryParamsService, useValue: gridQueryParamsServiceMock },
        { provide: MatIconRegistry, useValue: iconRegistrySpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },
        { provide: PeOverlayWidgetService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: MessageBus, useValue: {} },
        { provide: ConfirmScreenService, useValue: {} },
        { provide: PeDestroyService, useValue: {} },
        { provide: PeGridSidenavService, useValue: peGridSidenavServiceMock },
        { provide: PeGridViewportService, useValue: peGridViewportServiceMock },
        { provide: ProductsRuleService, useValue: productsRuleServiceSpy },
        { provide: PePreloaderService, useValue: pePreloaderServiceSpy },
        { provide: PE_ENV, useValue: envMock },
        { provide: MediaUrlPipe, useValue: mediaUrlPipeSpy },
        { provide: ChannelTypeIconService, useValue: {} },
        { provide: LocaleConstantsService, useValue: {} },
        { provide: Overlay, useValue: {} },
        { provide: DialogService, useValue: {} },
        { provide: PePlatformHeaderService, useValue: pePlatformHeaderServiceSpy },
        { provide: MessageBus, useValue: messageBusMock },
        { provide: Apollo, useValue: {} },
        { provide: DefaultCountryService, useValue: {} },
        { provide: CurrencySymbolPipe, useValue: currencySymbolPipeMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should call api to delete folder', () => {
    component.onDeleteFolder(exampleEvent);
    expect(productsApiServiceSpy.deleteFolder).toHaveBeenCalled();
  });

  it('should call api when moving item to root folder', () => {
    let moveIntoRootFolderEvent: MoveIntoRootFolderEvent = {
      folder: {
        name: 'name',
      },
      moveItems: [
        {
          id: 'string',
          type: PeGridItemType.Item,
          data: {
            _id: 'testId',
          },
        },
      ],
    };
    component.moveToRootFolder(moveIntoRootFolderEvent);
    expect(productsApiServiceSpy.moveToRoot).toHaveBeenCalled();
  });

  it('should get data from api when new item is created', (done) => {
    const openFolderSpy: jasmine.Spy = spyOn(component, 'openFolder');

    component.dataGridService.updatedGridItem$.subscribe(() => {
      setTimeout(() => {
        expect(productsApiServiceSpy.getSkusStock).toHaveBeenCalled();
        expect(openFolderSpy).toHaveBeenCalled();
        done();
      }, 1000);
    });
  });

  it('should move newly created items to beginning', () => {
    const productsListService = TestBed.inject(ProductsListService);
    spyOn(productsListService, 'productToItemMapper').and.callThrough();
    component.openFolder(null);
    expect(component.gridItems[0].title).toEqual('Item created just now');
  });
});
