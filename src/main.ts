import { environment } from './environments/environment';
import { platformBrowser } from "@angular/platform-browser";


const fetchConfig = async () => {
    try {
        const res = await fetch('/assets/config/config.json?t=' + Date.now());
        if (!res.ok) return {};
        return await res.json();
    } catch {
        return {};
    }
};

fetchConfig()
    .then((cfg) => Object.assign(environment, cfg))
    .then(() => import('./app/app-module'))
    .then((m) => platformBrowser().bootstrapModule(m.AppModule))
    .catch((err) => console.error('Старт приложения невозможен:', err));
