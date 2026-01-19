import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly env = environment;

  get apiUrl(): string {
    return this.env.apiUrl;
  }
  
  get staticUrl(): string {
    return this.env.staticUrl;
  }

  getApiEndpoint(path: string): string {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    return `${this.apiUrl}/${cleanPath}`;
  }
}