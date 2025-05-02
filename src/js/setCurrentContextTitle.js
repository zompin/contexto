export async function setCurrentContextTitle(title) {
    await browser.storage.local.set({ currentTitle: title });
}
