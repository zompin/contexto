import { getContexts } from "./getContexts.js";
import { getCurrentContextTitle } from "./getCurrentContextTitle.js";

export const getAppData = (dispatch) =>
    Promise.all([getContexts(), getCurrentContextTitle()]).then(
        ([contexts, currentContextTitle]) => ({
            contexts,
            currentContextTitle,
        }),
    );
