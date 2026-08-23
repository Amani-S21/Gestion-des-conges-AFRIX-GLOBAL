import { Component, input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }],
  template: `
    <label class="field">
      <span class="field-label">{{ label() }}</span>
      <input
        class="field-input"
        [type]="type()"
        [placeholder]="placeholder()"
        [value]="value"
        [disabled]="disabled"
        (input)="handleInput($event)"
        (blur)="onTouched()" />
    </label>
  `,
  styleUrl: './input.css'
})
export class InputComponent implements ControlValueAccessor {
  label = input('');
  type = input('text');
  placeholder = input('');

  // Valeur actuelle du champ, connectée au formulaire parent
  value = '';
  disabled = false;
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Prévient le formulaire à chaque frappe
  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}
