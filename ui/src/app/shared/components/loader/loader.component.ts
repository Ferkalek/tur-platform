import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    <div class="align-items-center fixed flex h-full left-0 top-0 w-full z-1 bg-black-alpha-30">
			<p-progress-spinner ariaLabel="loading" />
		</div>
  `,
  imports: [
    ProgressSpinnerModule,
  ]
})

export class LoaderComponent {}
