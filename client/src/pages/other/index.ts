import { MIVPage } from "../../shared/pages";
import "./other.css";

export class OtherPage extends MIVPage {

    constructor() {
        super("page_other", "other", "nav_other");
    }

    OpenAsync(): Promise<void> {
        // TODO
        // Called when this page is opened.
        // Here you should prepare anything required by your page, like initializing a MIV Client if it is not done already.
        return Promise.resolve();
    }
    Close(): void {
        // TODO
        // Called when this page is closed, as another page will be opened instead.
        // Here you should perform any necessary cleanup.
        // But be warned : this Page could be re-opened later, so you must not completely destroy the elements it might need, you just have to hide them or temporarily deactivate them.
    }

    protected ResolvePathAndNavigateAsync(path: string, samePathAsCurrent: boolean): Promise<void> {
        // TODO
        // Here you can analyze the required URL (in the "path" argument) and compose your page accordingly, depending on the URL's parameters. For example, if the path targets a specific element in this page, you can highlight it.
        // The "samePathAsCurrent" parameter indicates, when true, that the requested path is the same as the last path that was requested for this page (regardless of whether it is because the user remained on the same page or re-opened the page after closing it earlier).
        // If "samePathAsCurrent" is true, you may not want to highlight the element targeted in the "path".
        return Promise.resolve();
    }
}