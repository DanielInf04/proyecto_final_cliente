import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: false,
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss'
})
export class ScrollToTopComponent {
  windowScrolled: boolean = false;

  @HostListener("window:scroll", [])
  onWindowsScroll() {
    const yOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.windowScrolled = yOffset > 100;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
