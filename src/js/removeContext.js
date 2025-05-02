import { getContexts } from "./getContexts.js";
import { setContexts } from "./setContexts.js";

export async function removeContext(contextId) {
    const storedContexts = await getContexts();
    const contexts = storedContexts.filter((c) => c.id !== contextId);

    await setContexts(contexts);
}
