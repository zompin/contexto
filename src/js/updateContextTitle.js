import { getContexts } from "./getContexts.js";
import { setContexts } from "./setContexts.js";

export async function updateContextTitle(contextId, contextTitle) {
    const contexts = await getContexts();

    const tmp = contexts.map((context) => {
        if (context.id === contextId) {
            return {
                ...context,
                title: contextTitle,
            };
        }

        return context;
    });

    await setContexts(tmp);
}
