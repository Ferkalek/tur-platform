import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SavingProfileDto, UserProfile } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, USERS_ENDPOINT } from '../const';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  getProfile(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${API_BASE_URL}${USERS_ENDPOINT}/me`);
  }

  updateProfile(profile: SavingProfileDto): Observable<UserProfile | null> {
    return this.http.put<UserProfile>(`${API_BASE_URL}${USERS_ENDPOINT}/me`, profile);
  }
}
