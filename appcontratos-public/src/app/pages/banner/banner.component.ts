import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  @Input() backgroundImage: string = '';
  @Input() breadcrumb: string = '';
  @Input() title: string = '';
  @Input() title2: string = '';
  @Input() description: string = '';
}
