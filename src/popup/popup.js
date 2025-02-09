async function getContexts() {
    const storage = await browser.storage.local.get('contexts')
    return storage.contexts || []
}

async function setContexts(data) {
    const contexts = data.reduce((acc, d) => {
        const tabs = d.tabs.reduce((acc, t) => {
            const { id, ...rest } = t

            if (rest.url.startsWith('about:')) {
                return acc
            }

            acc.push(rest)

            return acc
        }, [])

        if (!tabs.length) {
            return acc
        }

        acc.push({
            ...d,
            id: d.id || Date.now(),
            tabs
        })

        return acc
    }, [])

    await browser.storage.local.set({ contexts })
}

async function getActiveContext() {
    const currentWindow = await browser.windows.getCurrent()
    const tabs = await browser.tabs.query({ windowId: currentWindow.id })

    return {
        tabs: tabs.map(({ id, index, active, pinned, isInReaderMode, cookieStoreId, url, favIconUrl, title }) => ({
            index,
            active,
            pinned,
            cookieStoreId,
            url,
            favIconUrl,
            title,
            id,
        }))
    }
}

async function createContext() {
    const contexts = await getContexts()
    const activeContext = await getActiveContext()

    contexts.push(activeContext)

    await setContexts(contexts)
    await browser.tabs.create({}) // Если заранее не создать пустую вкладку, окно закроется и не откроется

    activeContext.tabs.forEach(t => browser.tabs.remove(t.id))
    await updateList()
}

async function switchContext(contextId) {
    const activeContext = await getActiveContext()
    const storedContexts = await getContexts()
    const contexts = storedContexts.filter(c => c.id !== contextId)
    const contextForActivate = storedContexts.find(c => c.id === contextId)

    contexts.unshift(activeContext)
    await setContexts(contexts)

    contextForActivate.tabs.forEach(({ title, favIconUrl, ...rest }) => browser.tabs.create(rest))
    activeContext.tabs.forEach(t => browser.tabs.remove(t.id))
    await updateList()
}

function getContainer() {
    return document.querySelector('.container')
}

async function updateList() {
    const container = getContainer();

    [...container.children].forEach(el => {
        el.remove()
    })

    await app()
}

function renderCreateContextButton() {
    const container = getContainer()
    const createWindowButton = document.createElement('button')

    createWindowButton.textContent = 'Blank context'
    createWindowButton.onclick = createContext
    container.append(createWindowButton)
}

function renderContextButton(context) {
    const container = getContainer()
    const contextButton = document.createElement('button')

    context.tabs.forEach((t) => {
        const img = document.createElement('img')

        img.src = t.favIconUrl
        img.alt = t.title
        img.width = 16
        img.height = 16

        contextButton.append(img)
    })

    contextButton.onclick = () => switchContext(context.id)
    container.append(contextButton)
}

async function renderStoredContexts() {
    const contexts = await getContexts()

    contexts.forEach(renderContextButton)
}

async function app() {
    await renderStoredContexts()
    renderCreateContextButton()
}

app().catch(console.error)