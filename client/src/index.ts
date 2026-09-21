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

export async function navigateAsync(path: string, pushState: boolean = true): Promise<void> {
    const result = regx.exec(path);
    let page: MIVPage;
    if (result === undefined || result == null || result.length <= 0) {
        page = pageHome;
    } else {
        page = routes.get(getPageName(result[0])) ?? pageHome;
    }
    let actualPath: string;
    if (page == window.currentPage) {
        actualPath = page.getSamePagePath(path);
    } else {
        window.currentPage?.close();
        window.currentPage = page;
        actualPath = await page.openAsync_return_actual_path(path);
        MIVPage.currentPageChanged(page);
    }
    if (pushState) window.history.pushState({}, "", actualPath);
    await page.navigatePathAsync(actualPath);
}

// Handle back/forward browser buttons
window.addEventListener("popstate", (evt) =>
    runAsync(navigateAsync(window.location.pathname))
);

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
        runAsync(navigateAsync(href));
    }
});
export function preventNavigation(a: HTMLAnchorElement): void {
    // this technique will not work correctly if you use stopPropagation in another click handler for this <a>, because the "click" handler above may not be triggered
    a.toggleAttribute('prevent-navigation');
}

runAsync(navigateAsync(window.location.pathname));

// ********************************
// -- HOW TO ADD AN IMAGE --
/*
// put the image in the "client/public" folder, then :

// option 1 in a TS file
import imgUrl from "../public/myimage.png"; (or "../../../public/myimage.png" if used in a "/pages/xxx/index.ts")
(document.getElementById("my_image") as HTMLImageElement).src = imgUrl;

// option 2 in a page's CSS
.some_div {
  background-image: url("../../../public/myimage.png");
}

// option 3 in the main "index.html"
<img src="/myimage.png" alt="My Image" />

*/