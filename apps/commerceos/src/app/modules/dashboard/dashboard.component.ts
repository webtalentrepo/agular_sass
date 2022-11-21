import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { PeAuthService } from '@pe/auth';
import { BusinessInterface, BusinessState } from '@pe/business';
import { ThemeSwitcherService } from '@pe/theme-switcher';
import { PeUser, UserState } from '@pe/user';
import { WallpaperService } from '@pe/wallpaper';

import { notificationsTransition } from '../../animations/dashboard.animation';

@Component({
  selector: 'user-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [notificationsTransition],
})
export class DashboardComponent implements OnInit {

  @Select(UserState.user) user$: Observable<PeUser>;
  @Select(UserState.loading) loading$: Observable<boolean>;
  @SelectSnapshot(BusinessState.businessData) businessData: BusinessInterface;

  get theme() {
    return this.themeSwitcherService.theme;
  }


  constructor(
    private wallpaperService: WallpaperService,
    private authService: PeAuthService,
    private themeSwitcherService: ThemeSwitcherService,
  ) {
    this.wallpaperService.backgroundImage = this.businessData?.currentWallpaper?.wallpaper
      || this.wallpaperService.defaultBackgroundImage;
  }

  ngOnInit() {
    (window as any).PayeverStatic.IconLoader.loadIcons([
      'set',
      'dashboard',
      'notification',
    ]);

    const userData = this.authService.getUserData();
    this.authService.refreshLoginData = {
      activeBusiness: this.authService.refreshLoginData.activeBusiness,
      email: userData?.email,
    };
  }
}
