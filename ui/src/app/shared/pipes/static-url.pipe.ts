import { inject, Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../../core/services';

@Pipe({
  name: 'staticUrl',
  standalone: true,
})
export class StaticUrlPipe implements PipeTransform {
  private config = inject(ConfigService);

  transform(fileName: string, folderPath?: string): string {
    console.log('.......', fileName);
    return folderPath
      ? `${this.config.staticUrl}${folderPath}${fileName}`
      : `${this.config.staticUrl}${fileName}`;
  }
}
