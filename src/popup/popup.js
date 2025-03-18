async function getContexts() {
    const storage = await browser.storage.local.get('contexts')
    return storage.contexts || []
}

async function setContexts(data) {
    const contexts = data.reduce((acc, d) => {
        const tabs = d.tabs.reduce((acc, t) => {
            const { id, ...rest } = t

            if (rest.url.startsWith('about:') || rest.url.startsWith('moz-extension:')) {
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
        tabs: tabs.map(({ id, index, active, pinned, cookieStoreId, url, favIconUrl, title }) => ({
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

async function removeContext(contextId) {
    const storedContexts = await getContexts()
    const contexts = storedContexts.filter(c => c.id !== contextId)

    await setContexts(contexts)
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
    const contextDiv = document.createElement('div')
    const contextButton = document.createElement('button')
    const removeContextButton = document.createElement('button')

    contextDiv.className = 'context'
    contextButton.className = 'context__switch'
    removeContextButton.className = 'context__remove'
    removeContextButton.onclick = () => removeContext(context.id)
    removeContextButton.textContent = 'x'

    context.tabs.forEach((t) => {
        const div = document.createElement('div')
        const img = document.createElement('img')

        img.src = t.favIconUrl
        img.alt = t.title

        div.className = 'context__tab'
        div.append(img)
        contextButton.append(div)
    })

    contextButton.onclick = () => switchContext(context.id)
    contextDiv.append(contextButton)
    contextDiv.append(removeContextButton)
    container.append(contextDiv)
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