import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (name()) {
      @case ('check') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      }
      @case ('close') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      }
      @case ('calendar') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      }
      @case ('user') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6"></path>
        </svg>
      }
      @case ('chevron') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      }
      @case ('log-in') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
      }
      @case ('arrow-down') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      }
      @case ('facebook') {
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.1c0-.87.24-1.46 1.5-1.46h1.8V3.96a24 24 0 0 0-2.63-.14c-2.6 0-4.38 1.59-4.38 4.5V10H7v3h2.79v8h3.71Z"></path>
        </svg>
      }
      @case ('instagram') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none"></circle>
        </svg>
      }
      @case ('linkedin') {
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M5.2 8.2A2.1 2.1 0 1 0 5.2 4a2.1 2.1 0 0 0 0 4.2ZM3.35 20h3.7V9.5h-3.7V20Zm5.95 0H13v-5.2c0-1.37.26-2.7 1.96-2.7 1.67 0 1.69 1.57 1.69 2.8V20h3.7v-5.75c0-2.82-.61-4.99-3.93-4.99-1.6 0-2.67.88-3.11 1.72h-.05V9.5H9.3V20Z"></path>
        </svg>
      }
      @case ('whatsapp') {
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3a9 9 0 0 0-7.76 13.56L3 21l4.58-1.2A9 9 0 1 0 12 3Zm0 16.35a7.3 7.3 0 0 1-3.72-1.02l-.27-.16-2.72.71.73-2.65-.17-.28A7.3 7.3 0 1 1 12 19.35Zm4-5.42c-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.11-.15.22-.57.71-.7.86-.13.15-.26.17-.48.06-.22-.11-.91-.34-1.73-1.07-.64-.57-1.07-1.28-1.2-1.5-.12-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.69-1.65-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85s.8 2.15.91 2.3c.11.15 1.57 2.4 3.8 3.36.53.23.95.36 1.28.46.54.17 1.03.15 1.42.09.43-.06 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.06-.09-.2-.15-.42-.26Z"></path>
        </svg>
      }
    }
  `,
  styleUrl: './icon.css'
})
export class IconComponent {
  name = input<'check' | 'close' | 'calendar' | 'user' | 'chevron' | 'log-in' | 'arrow-down' | 'facebook' | 'instagram' | 'linkedin' | 'whatsapp'>('check');
}
