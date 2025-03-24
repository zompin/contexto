import {removeContext} from '../js/removeContext.js'
import {getContexts} from '../js/getContexts.js'
import {switchContext} from '../js/switchContext.js'
import {createContext} from '../js/createContext.js'

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
    createWindowButton.onclick = async () => {
        await createContext()
        await updateList()
    }
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
    removeContextButton.onclick = async () => {
        await removeContext(context.id)
        await updateList()
    }
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

    contextButton.onclick = async () => {
        await switchContext(context.id)
        await updateList()
    }

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