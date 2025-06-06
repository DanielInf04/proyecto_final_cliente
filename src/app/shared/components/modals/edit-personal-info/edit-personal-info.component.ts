import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-edit-personal-info',
  standalone: false,
  templateUrl: './edit-personal-info.component.html',
  styleUrl: './edit-personal-info.component.scss'
})
export class EditPersonalInfoComponent {
  @Input() formData: any = {
    name: '',
    apellido: ''
  };

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  saveChanges() {
    this.onSave.emit(this.formData);
  }

  cancel() {
    this.onCancel.emit();
  }
}
