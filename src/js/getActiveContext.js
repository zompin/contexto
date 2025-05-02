import { getCurrentContextTitle } from "./getCurrentContextTitle.js";

export async function getActiveContext() {
    const currentWindow = await browser.windows.getCurrent();
    const tabs = await browser.tabs.query({ windowId: currentWindow.id });
    const title = await getCurrentContextTitle();

    return {
        title,
        tabs: tabs.map(
            ({
                id,
                index,
                active,
                pinned,
                cookieStoreId,
                url,
                favIconUrl,
                title,
            }) => ({
                index,
                active,
                pinned,
                cookieStoreId,
                url,
                favIconUrl,
                title,
                id,
            }),
        ),
    };
}
