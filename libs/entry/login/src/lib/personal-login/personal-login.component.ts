import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'pe-personal-login',
  templateUrl: './personal-login.component.html',
  styleUrls: ['./personal-login.component.scss'],
})
export class PersonalLoginComponent implements OnInit {

  private returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  onSuccessLogin(): void {
    const invitationRedirectUrl = this.route.snapshot.queryParams.invitationRedirectUrl;
    const queryParams = invitationRedirectUrl ? { queryParams: { invitationRedirectUrl } } : undefined;
    this.router.navigate([this.returnUrl || 'switcher'], queryParams);
  }

  onSecondFactorCode(): void {
    const invitationRedirectUrl = this.route.snapshot.queryParams.invitationRedirectUrl;
    const queryParams = invitationRedirectUrl ? { queryParams: { invitationRedirectUrl } }
      : { queryParams: { returnUrl: this.returnUrl } };
    this.router.navigate(['second-factor-code'], queryParams);
  }

  onRegister(): void {
    const invitationRedirectUrl = this.route.snapshot.queryParams.invitationRedirectUrl;
    const queryParams = invitationRedirectUrl ? { queryParams: { invitationRedirectUrl } } : undefined;
    this.router.navigate(['registration'], queryParams );
  }
}
