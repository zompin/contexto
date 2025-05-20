import { getCurrentContextTitle } from "./getCurrentContextTitle.js";

export async function getActiveContext() {
    const currentWindow = await browser.windows.getCurrent();
    const tabs = await browser.tabs.query({ windowId: currentWindow.id });
    const title = await getCurrentContextTitle();
    const preparedTabs = tabs.reduce(
        (
            acc,
            {
                id,
                index,
                active,
                pinned,
                cookieStoreId,
                url,
                favIconUrl,
                title,
                audible,
            },
        ) => {
            if (audible) {
                return acc;
            }

            acc.push({
                id,
                index,
                active,
                pinned,
                cookieStoreId,
                url,
                favIconUrl,
                title,
            });

            return acc;
        },
        [],
    );

    return {
        title,
        tabs: preparedTabs,
    };
}
