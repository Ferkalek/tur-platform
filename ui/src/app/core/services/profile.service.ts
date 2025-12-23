import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private mockProfile: UserProfile = {
    id: '1',
    name: 'Іван Петренко',
    email: 'ivan.petrenko@example.com',
    phone: '+380 50 123 4567',
    bio: 'Frontend розробник з досвідом роботи в Angular та TypeScript.',
  };

  getProfile(): Observable<UserProfile> {
    return of(this.mockProfile).pipe(delay(500));
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    this.mockProfile = { ...profile };
    return of(this.mockProfile).pipe(delay(800));
  }
}
