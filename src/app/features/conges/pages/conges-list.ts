import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-conges-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Liste des demandes de congé (à venir)</p>`,
})
export default class CongesList {}
