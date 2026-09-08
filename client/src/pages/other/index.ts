import { MIVPage } from "../../shared/pages";
import "./other.css";

export class OtherPage extends MIVPage {

    constructor() {
        super("page_other", "other");
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