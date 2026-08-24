import { HomePage } from "./pages/home";
import { OtherPage } from "./pages/other";
import { MIVPage, runAsync } from "./shared/pages";
import "./styles/global.css";

const routes = new Map<string, MIVPage>();
const regx = new RegExp("^/([a-z]|[A-Z])+/?");

const pageHome = new HomePage();
const pageOther = new OtherPage();
MIVPage.initializePages(routes);

function getPageName(withSlashes: string | undefined | null): string {
    if (withSlashes === undefined || withSlashes == null || withSlashes.length <= 0) {
        return "";
    }
    if (withSlashes[0] == "/") {
        if (withSlashes.length <= 1) return "";
        withSlashes = withSlashes.substring(1);
    }
    if (withSlashes[withSlashes.length - 1] == "/") {
        if (withSlashes.length <= 1) return "";
        withSlashes = withSlashes.substring(0, withSlashes.length - 1);
    }
    return withSlashes;
}

async function navigateAsync(path: string, highlightTarget: boolean): Promise<void> {
    const result = regx.exec(path);
    let page: MIVPage;
    if (result === undefined || result == null || result.length <= 0) {
        page = pageHome;
    } else {
        page = routes.get(getPageName(result[0])) ?? pageHome;
    }
    let actualPath: string;
    if (page == window.currentPage) {
        actualPath = path;
    } else {
        window.currentPage?.close();
        window.currentPage = page;
        actualPath = await page.openAsync_return_actual_path(path);
    }
    window.history.pushState({}, "", actualPath);
    await page.navigatePathAsync(actualPath, highlightTarget);
}

// Handle back/forward browser buttons
window.addEventListener("popstate", (evt) => navigateAsync(window.location.pathname, true));

// Intercept all <a> clicks to use client-side navigation
document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;
    if (target.hasAttribute('prevent-navigation')) {
        e.preventDefault();
    } else {
        const href = target.getAttribute("href");
        if ((!href) || href.startsWith("http") || href.startsWith("//") || href.startsWith("www")) return;
        e.preventDefault();
        navigateAsync(href, true);
    }
});
export function preventNavigation(a: HTMLAnchorElement): void {
    a.toggleAttribute('prevent-navigation');
}

// Resolve the current URL on startup
runAsync(navigateAsync(window.location.pathname, true));