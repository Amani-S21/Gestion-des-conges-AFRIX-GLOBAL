import { Component, ChangeDetectionStrategy, inject, signal, computed, ViewChild, ElementRef, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/button/button';
import { InputComponent } from '../../../shared/input/input';
import { IconComponent } from '../../../shared/icon/icon';
import { CongeService } from '../services/conge.service';

@Component({
  selector: 'app-conge-form',
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conge-form.html',
  styleUrl: './conge-form.css',
})
export default class CongeForm {
  private fb = inject(FormBuilder);
  private congeService = inject(CongeService);

  submitted = signal(false);

  // Référence vers l'icône de succès, pour lui donner le focus dès qu'elle apparaît
  @ViewChild('successIcon') successIcon?: ElementRef<HTMLElement>;

  form = this.fb.group(
    {
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      comment: [''],
    },
    { validators: this.dateRangeValidator },
  );

  // Reflète le formulaire en signal : la durée se recalcule à CHAQUE frappe, sans attendre de perdre le focus
  private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  duration = computed(() => {
    const { startDate, endDate } = this.formValue();
    if (!startDate || !endDate) return null;
    const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    return days >= 0 ? days + 1 : null;
  });

  constructor() {
    // Dès que "submitted" passe à true, on met le focus sur le check (accessibilité + confirmation visuelle nette)
    effect(() => {
      if (this.submitted()) {
        setTimeout(() => this.successIcon?.nativeElement.focus());
      }
    });
  }

  private dateRangeValidator(group: any) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && end < start) return { dateRangeInvalid: true };
    return null;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.congeService.createLeaveRequest(this.form.value as any);
    this.submitted.set(true);
    this.form.reset();
  }

  onCancel() {
    this.form.reset();
    this.submitted.set(false);
  }
}
