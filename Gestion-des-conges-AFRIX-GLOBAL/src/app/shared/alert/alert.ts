import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="alert" [class]="'alert-' + type()">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './alert.css'
})
export class AlertComponent {
  type = input<'success' | 'warning' | 'danger'>('success');
}
