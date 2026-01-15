import { FormControl } from '@angular/forms';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  socialLink: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileFormType {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  bio: FormControl<string | null>;
}

export interface SavingProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  socialLink?: string;
}
