import { MIVPage } from "..";
import { MIVClient } from "@1oo4/miv";

declare global {
    interface Window {
        client: MIVClient | undefined,
        currentPage: MIVPage | undefined
    }
}

export { };