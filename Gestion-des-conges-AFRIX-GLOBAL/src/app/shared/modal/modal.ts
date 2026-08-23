import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-modal',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="modal-backdrop">
        <div class="modal-box" role="dialog" aria-modal="true" [attr.aria-label]="title()">
          <div class="modal-header">
            <span class="modal-title">{{ title() }}</span>
            <button class="modal-close" type="button" (click)="closed.emit()" aria-label="Fermer">
              <app-icon name="close" />
            </button>
          </div>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './modal.css'
})
export class ModalComponent {
  open = input(false);
  title = input('');
  closed = output<void>();
}
