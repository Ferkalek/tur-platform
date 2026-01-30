import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SavingProfileDto, UserProfile } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { USERS_ENDPOINT } from '../const';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${USERS_ENDPOINT}/me`);
  }

  updateProfile(profile: SavingProfileDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${USERS_ENDPOINT}/me`, profile);
  }

  uploadAvatar(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<UserProfile>(
      `${USERS_ENDPOINT}/me/avatar`,
      formData
    );
  }

  deleteAvatar(): Observable<UserProfile> {
    return this.http.delete<UserProfile>(`${USERS_ENDPOINT}/me/avatar`);
  }
}
