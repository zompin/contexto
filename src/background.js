function generateIcon(color) {
    color ||= 'currentColor'

    let svg = `<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" rx="3" ry="3" width="16" height="16" fill="${color}" />
    </svg>`

    svg = svg.replaceAll('<', '%3C').replaceAll('>', '%3E').replaceAll('#', '%23')

    return `data:image/svg+xml,${svg}`
}

const MENU_ID = 'contexto-menu'

function createMenuItem({ name, cookieStoreId, colorCode }) {
    return {
        title: name,
        id: cookieStoreId,
        parentId: MENU_ID,
        icons: {
            16: generateIcon(colorCode),
        },
    }
}

function getMenuItems(identities) {
    const menuItems = [{
        title: 'Contexto',
        id: MENU_ID,
    }, createMenuItem({
        name: 'Профиль по умолчанию',
        cookieStoreId: 'firefox-default'
    })]

    identities.forEach(el => menuItems.push(createMenuItem(el)))

    return menuItems
}

async function onContainerSelect({ menuItemId, linkUrl }, tab) {
    const {
        id: tabId,
        discarded,
        index,
        mutedInfo,
        openerTabId,
        pinned,
        url
    } = tab || {}
    const isNewTab = Boolean(linkUrl)

    await browser.tabs.create({
        active: true,
        cookieStoreId: String(menuItemId),
        discarded,
        index: linkUrl ? index + 1 : index,
        muted: mutedInfo.muted,
        openerTabId,
        pinned,
        url: isNewTab || (/^about:/.test(url) ? undefined : url),
    })

    if (!isNewTab) {
        await browser.tabs.remove(tabId)
    }
}

async function appendMenu() {
    const identities = await browser.contextualIdentities.query({})
    const menuItems = getMenuItems(identities)

    menuItems.forEach(item => {
        browser.menus.create(item)
    })
}

browser.contextualIdentities.onCreated.addListener(({contextualIdentity}) => {
    browser.menus.create(createMenuItem(contextualIdentity))
})

browser.contextualIdentities.onUpdated.addListener(({contextualIdentity}) => {
    browser.menus.update(contextualIdentity.cookieStoreId, {
        title: contextualIdentity.name,
        icons: {
            16: generateIcon(contextualIdentity.colorCode)
        }
    })
})

browser.contextualIdentities.onRemoved.addListener(({contextualIdentity}) => {
    browser.menus.remove(contextualIdentity.cookieStoreId)
})

browser.menus.onClicked.addListener(onContainerSelect)

appendMenu()