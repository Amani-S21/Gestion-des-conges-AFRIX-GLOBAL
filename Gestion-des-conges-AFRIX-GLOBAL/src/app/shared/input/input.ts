import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="field">
      <span class="field-label">{{ label() }}</span>
      <input
        class="field-input"
        [type]="type()"
        [placeholder]="placeholder()" />
    </label>
  `,
  styleUrl: './input.css'
})
export class InputComponent {
  label = input('');
  type = input('text');
  placeholder = input('');
}
