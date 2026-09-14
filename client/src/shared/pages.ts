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
    private last_navigation_path: string | undefined;

    constructor(elemID: string, urlName: string) {
        this.URLName = urlName;
        this.html = document.getElementById(elemID) as HTMLDivElement
        this.html.style.display = "none";
        MIVPage.ALL_PAGES.push(this);
    }

    static initializePages(routes: Map<string, MIVPage>): void {
        for (let i = 0; i < this.ALL_PAGES.length; i++) {
            const page = this.ALL_PAGES[i];
            routes.set(page.URLName, page);
            page.html.style.display = "none";
        }
    }

    private isBasePath(path: string): boolean {
        return path == "/" + this.URLName || path == "/" + this.URLName + "/";
    }

    getSamePagePath(requiredPath: string): string {
        if (this.last_navigation_path !== undefined && this.isBasePath(requiredPath)) {
            return this.last_navigation_path;
        } else {
            return requiredPath;
        }
    }

    async openAsync_return_actual_path(requiredPath: string): Promise<string> {
        this.html.style.display = "flex";
        await this.OpenAsync();
        if (this.last_navigation_path === undefined) {
            return requiredPath;
        } else {
            if (this.isBasePath(requiredPath)) {
                return this.last_navigation_path;
            } else {
                return requiredPath;
            }
        }
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