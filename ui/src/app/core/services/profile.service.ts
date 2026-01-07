import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getProfile(): Observable<UserProfile | null> {
    const user = this.authService.currentUser();

    if (user) {
      const { id, firstName, lastName, email } = user;

      // TODO: Replace with real API call
      return of({ id, firstName, lastName, email, phone: '', bio: '' }).pipe(delay(500));
    } else {
      return of(null);
    }
  }

  updateProfile(profile: UserProfile): Observable<UserProfile | null> {
    return of(null);
  }
}
