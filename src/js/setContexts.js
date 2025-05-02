export async function setContexts(data) {
    const contexts = data.reduce((acc, d) => {
        const tabs = d.tabs.reduce((acc, t) => {
            const { id, ...rest } = t;

            if (
                rest.url.startsWith("about:") ||
                rest.url.startsWith("moz-extension:")
            ) {
                return acc;
            }

            acc.push(rest);

            return acc;
        }, []);

        if (!tabs.length) {
            return acc;
        }

        acc.push({
            ...d,
            id: d.id || Date.now(),
            tabs,
        });

        return acc;
    }, []);

    await browser.storage.local.set({ contexts });
}
