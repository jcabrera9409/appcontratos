import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-conocenos',
  standalone: true,
  imports: [BannerComponent, FooterComponent],
  templateUrl: './conocenos.component.html',
  styleUrl: './conocenos.component.css'
})
export class ConocenosComponent {

}
