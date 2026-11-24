import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {

    get showMainLayout(): boolean {
        return true;
    }

    get canShowFooter(): boolean {
        return true;
    }


    get currentYear(): number {
        return new Date().getFullYear();
    }
}
