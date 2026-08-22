import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="card-header">
        <ng-content select="[card-title]"></ng-content>
        <span class="badge" [class]="'badge-' + status()">{{ statusLabel() }}</span>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './card.css'
})
export class CardComponent {
  status = input<'success' | 'warning' | 'danger'>('warning');
  statusLabel = input('En attente');
}
