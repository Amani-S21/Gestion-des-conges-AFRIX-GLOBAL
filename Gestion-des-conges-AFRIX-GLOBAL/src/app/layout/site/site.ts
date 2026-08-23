import { Component } from '@angular/core';
import { Navbar } from "../../navbar/navbar";
import { Footer } from "../../footer/footer";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-site',
  imports: [Navbar, Footer, RouterOutlet],
  template: `
  <div class="flex min-h-screen flex-col bg-(--color-bg)">
    <app-navbar />

    <main class="flex-1 pt-20">
      <router-outlet />
    </main>

    <app-footer />
  </div>
  `,
  styles: ``,
})
export class Site {}
