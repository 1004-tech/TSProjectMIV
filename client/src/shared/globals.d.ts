import { MIVPage } from "..";
import { DocClient } from "./docclient";

declare global {
    interface Window {
        docClient: DocClient | undefined,
        currentPage: MIVPage | undefined
    }
}

export { };