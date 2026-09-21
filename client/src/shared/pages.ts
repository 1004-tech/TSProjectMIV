import { ErrorMessage } from "@1oo4/miv";

export function handleError(error: ErrorMessage | undefined, unexpectedIfUndefined: boolean = false) {
    // TODO : hanlde each type of error
    if (error === undefined) {
        if (unexpectedIfUndefined) {
            alert("an unexpected error occurred");
        }
    } else {
        alert("error, see console logs")
        console.log(error);
    }
}

export async function runAsync<T>(task: Promise<T>): Promise<T> {
    // TODO : display an animation while the Promise is running
    return task;
}

export abstract class MIVPage {

    private static readonly ALL_PAGES: Array<MIVPage> = new Array();
    public readonly URLName: string;
    private readonly html: HTMLDivElement;
    private opening_path: string | undefined;
    private last_navigation_path: string | undefined;
    private readonly navIDs: Array<string> | undefined;

    constructor(elemID: string, urlName: string, ...navIDs: string[]) {
        this.URLName = urlName;
        this.html = document.getElementById(elemID) as HTMLDivElement
        this.html.style.display = "none";
        this.navIDs = navIDs;
        MIVPage.ALL_PAGES.push(this);
    }

    static initializePages(routes: Map<string, MIVPage>): void {
        for (let i = 0; i < this.ALL_PAGES.length; i++) {
            const page = this.ALL_PAGES[i];
            routes.set(page.URLName, page);
            page.html.style.display = "none";
        }
    }

    static currentPageChanged(current: MIVPage) {
        for (let i = 0; i < MIVPage.ALL_PAGES.length; i++) {
            const page = MIVPage.ALL_PAGES[i];
            if (page.navIDs) {
                for (let i = 0; i < page.navIDs.length; i++) {
                    const nav = document.getElementById(page.navIDs[i]) as HTMLAnchorElement;
                    if (page == current) {
                        nav.classList.add("is-selected");
                    } else {
                        nav.classList.remove("is-selected");
                    }
                }
            }
        }
    }

    private isBasePath(path: string): boolean {
        return path == "/" + this.URLName || path == "/" + this.URLName + "/";
    }
    isCurrentPathBase(): boolean {
        return this.last_navigation_path === undefined || this.isBasePath(this.last_navigation_path);
    }
    isOpeningBasePath() {
        return this.opening_path !== undefined && this.isBasePath(this.opening_path);
    }

    getSamePagePath(requiredPath: string): string {
        if (this.last_navigation_path !== undefined && this.isBasePath(requiredPath)) {
            return this.last_navigation_path;
        } else {
            return requiredPath;
        }
    }

    async openAsync_return_actual_path(requiredPath: string): Promise<string> {
        this.html.style.display = 'flex';
        if (this.last_navigation_path === undefined) {
            this.opening_path = requiredPath;
        } else {
            if (this.isBasePath(requiredPath)) {
                this.opening_path = this.last_navigation_path;
            } else {
                this.opening_path = requiredPath;
            }
        }
        await this.OpenAsync();
        return this.opening_path;
    }
    close(): void {
        this.html.style.display = "none";
        this.Close();
    }

    protected abstract OpenAsync(): Promise<void>;
    protected abstract Close(): void;

    navigatePathAsync(path: string): Promise<void> {
        const samePathAsCurrent = (this.last_navigation_path == path);
        this.last_navigation_path = path;
        return this.ResolvePathAndNavigateAsync(path, samePathAsCurrent);
    }
    protected abstract ResolvePathAndNavigateAsync(path: string, samePathAsCurrent: boolean): Promise<void>;

    protected SetCurrentPath(path: string, pushState: boolean): void {
        this.last_navigation_path = path;
        if (pushState) {
            window.history.pushState({}, '', path);
        } else {
            window.history.replaceState({}, '', path);
        }
    }
    protected RevertToCurrentPath(): void {
        if (this.last_navigation_path === undefined) {
            window.history.replaceState({}, '', "/" + this.URLName);
        } else {
            window.history.replaceState({}, '', this.last_navigation_path);
        }
    }
}