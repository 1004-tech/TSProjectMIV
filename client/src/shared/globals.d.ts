import { MIVPage } from "..";
import { MIVClient } from "mivts";

declare global {
    interface Window {
        client: MIVClient | undefined,
        currentPage: MIVPage | undefined
    }
}

export { };