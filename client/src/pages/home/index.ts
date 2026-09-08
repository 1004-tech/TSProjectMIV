import { MIVPage } from "../../shared/pages";
import "./home.css";

export class HomePage extends MIVPage {

    constructor() {
        super("page_home", "home");
    }

    OpenAsync(): Promise<void> {
        // TODO
        return Promise.resolve();
    }
    Close(): void {
        // TODO
    }

    protected ResolvePathAndNavigateAsync(path: string, samePathAsCurrent: boolean): Promise<void> {
        // TODO
        return Promise.resolve();
    }
}