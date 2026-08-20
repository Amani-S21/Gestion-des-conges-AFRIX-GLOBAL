import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class.btn-secondary]="variant() === 'secondary'"
      [style.transition]="'var(--transition-smooth)'">
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.css'
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
}
