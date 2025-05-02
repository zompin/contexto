export async function getContexts() {
    const storage = await browser.storage.local.get("contexts");
    return storage.contexts || [];
}
