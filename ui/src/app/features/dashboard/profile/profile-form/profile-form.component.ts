import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ProfileFormType, UserProfile } from '../../../../core/models';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputText,
    TextareaModule,
    MessageModule,
  ],
})
export class ProfileFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group<ProfileFormType>({
    firstName: new FormControl('', [Validators.required],),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    bio: new FormControl(''),
  });
  isSaving = false;

  @Input() set profile(value: UserProfile) {
    if (value) {
      const { firstName, lastName, email, phone, bio } = value;

      this.form.patchValue({
        firstName,
        lastName,
        email,
        phone,
        bio,
      });
    }
  }

  @Output() savingProfile = new EventEmitter<Partial<UserProfile>>();

  get firstNameControl(): AbstractControl<string | null> | null {
    return this.form.get('firstName');
  }
  get lastNameControl(): AbstractControl<string | null> | null {
    return this.form.get('lastName');
  }
  get emailControl(): AbstractControl<string | null> | null {
    return this.form.get('email');
  }

  sendData(): void {
    if (this.form.value) {
      this.savingProfile.emit(this.form.value as Partial<UserProfile>);
    }
  }
}