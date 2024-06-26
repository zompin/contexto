function getActiveTab() {
    return browser.tabs.query({ active: true }).then(([t]) => t || {})
}

function generateIcon(color) {
    color ||= 'currentColor'

    let svg = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" rx="3" ry="3" width="16" height="16" fill="${color}" />
    </svg>`

    svg = svg.replaceAll('<', '%3C').replaceAll('>', '%3E').replaceAll('#', '%23')

    return `data:image/svg+xml,${svg}`
}

async function generateProfilesMenu(_, tmp) {
    const identities = await browser.contextualIdentities.query({})

    browser.menus.create({
        title: 'Tab profile',
        id: 'default-profile',
    })

    browser.menus.create({
        title: 'Профиль по умолчанию',
        id: "firefox-default",
        parentId: 'default-profile',
        icons: {
            16: generateIcon(),
        },
    })

    identities.forEach(el => {
        browser.menus.create({
            title: el.name,
            id: el.cookieStoreId,
            parentId: 'default-profile',
            icons: {
                16: generateIcon(el.colorCode)
            },
        })
    })
}

getActiveTab().then(() => generateProfilesMenu())

browser.menus.onShown.addListener(generateProfilesMenu)

browser.menus.onClicked.addListener(async (data, tab) => {
    const {
        id: tabId,
        discarded,
        index,
        mutedInfo,
        openerTabId,
        pinned,
        url
    } = tab || {}

    await browser.tabs.remove(tabId)
    await browser.tabs.create({
        active: true,
        cookieStoreId: String(data.menuItemId),
        discarded,
        index,
        muted: mutedInfo.muted,
        openerTabId,
        pinned,
        url: /^abot:/.test(url) ? url : undefined,
    })
})