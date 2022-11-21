import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ActionTypeEnum } from '../../../../shared';
import { AbstractAction } from '../../../../shared/abstractions/action.abstract';
import { ActionRequestInterface } from '../../../../shared/interfaces/detail.interface';

@Component({
  selector: 'pe-capture-action',
  templateUrl: './capture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ActionCaptureComponent extends AbstractAction implements OnInit {
  form: FormGroup = null;

  constructor(
    public injector: Injector,
    private formBuilder: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getData();
  }

  onSubmit(): void {
    const data: ActionRequestInterface = {};
    const amount: number = this.form.get('amount').value;
    if (amount) {
      data.amount = amount;
    }
    this.sendAction(
      data,
      ActionTypeEnum.Capture,
      'capture_funds',
      false
    );
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      amount: '',
    });
  }
}
