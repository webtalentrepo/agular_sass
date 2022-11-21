import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslationGuard } from '@pe/i18n-core';

import { PebBusinessGuard, SettingsAccessGuard } from './guards';
import { BusinessResolver, LoadingResolver, UserAccountResolver } from './resolvers';
import { PebSettingsComponent } from './routes/_root/settings-root.component';
import { AppearanceComponent } from './routes/appearance/appearance.component';
import { BillingComponent } from './routes/billing/billing.component';
import { BusinessDetailComponent } from './routes/business-detail/business-detail.component';
import { BusinessInfoComponent } from './routes/business-info/business-info.component';
import { GeneralComponent } from './routes/general/general.component';
import { PoliciesComponent } from './routes/policies/policies.component';
import { SettingsRoutesEnum } from './settings-routes.enum';

const routes: Routes = [
  {
    path: ``,
    component: PebSettingsComponent,
    canActivate: [TranslationGuard, PebBusinessGuard, SettingsAccessGuard],
    resolve: {
      load: LoadingResolver,
      userAccount: UserAccountResolver,
    },
    data: {
      i18nDomains: ['commerceos-settings-app'],
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: `${SettingsRoutesEnum.Info}`,
      },
      {
        path: `${SettingsRoutesEnum.Info}`,
        component: BusinessInfoComponent,
        resolve: {
          business: BusinessResolver,
        },
      },
      {
        path: `${SettingsRoutesEnum.Details}`,
        component: BusinessDetailComponent,
        resolve: {
          business: BusinessResolver,
        },
      },
      {
        path: `${SettingsRoutesEnum.Employees}`,
        loadChildren: () => import('./components/employees/employees.module').then(m => m.EmployeesModule),
      },
      {
        path: `${SettingsRoutesEnum.Wallpaper}`,
        loadChildren: () => import('./routes/wallpapers/wallpapers.module').then(m => m.WallpapersModule),
      },
      {
        path: `${SettingsRoutesEnum.Policies}`,
        component: PoliciesComponent,
      },
      {
        path: `${SettingsRoutesEnum.General}`,
        resolve: {
          business: BusinessResolver,
          user: UserAccountResolver,
        },
        component: GeneralComponent,
      },
      {
        path: `${SettingsRoutesEnum.General}/:modal`,
        component: GeneralComponent,
        resolve: {
          business: BusinessResolver,
          user: UserAccountResolver,
        },
      },
      {
        path: `${SettingsRoutesEnum.Details}/:modal`,
        component: BusinessDetailComponent,
        resolve: {
          business: BusinessResolver,
        },
      },
      {
        path: `${SettingsRoutesEnum.Appearance}`,
        component: AppearanceComponent,
      },
      {
        path: `${SettingsRoutesEnum.Billing}`,
        component: BillingComponent,
      },
    ],
  },
];
export const settingsRouterModule = RouterModule.forChild(routes);
// @dynamic
@NgModule({
  imports: [settingsRouterModule],
  exports: [RouterModule],
  providers: [
  ],
})
export class SettingsRoutingModule { }
