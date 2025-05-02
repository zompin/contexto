export async function getCurrentContextTitle() {
    const { currentTitle } = await browser.storage.local.get("currentTitle");

    return currentTitle;
}
