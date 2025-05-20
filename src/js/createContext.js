import { getContexts } from "./getContexts.js";
import { setContexts } from "./setContexts.js";
import { getActiveContext } from "./getActiveContext.js";
import { setCurrentContextTitle } from "./setCurrentContextTitle.js";

export async function createContext() {
    const contexts = await getContexts();
    const activeContext = await getActiveContext();

    contexts.push(activeContext);

    await setContexts(contexts);
    await browser.tabs.create({}); // Если заранее не создать пустую вкладку, окно закроется и не откроется

    activeContext.tabs.forEach((t) => browser.tabs.remove(t.id));
}
