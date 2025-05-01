import {removeContext} from '../js/removeContext.js'
import {getContexts} from '../js/getContexts.js'
import {switchContext} from '../js/switchContext.js'
import {createContext} from '../js/createContext.js'
import {updateContextTitle} from '../js/updateContextTitle.js'

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
    const contextTitle = document.createElement('input')
    const contextButton = document.createElement('button')
    const removeContextButton = document.createElement('button')

    contextTitle.onkeyup = (e) => updateContextTitle(context.id, e.target.value)
    contextDiv.className = 'context'
    contextTitle.className = 'context__title'
    contextTitle.value = context.title || 'No name'
    removeContextButton.onclick = async () => {
        await removeContext(context.id)
        await updateList()
    }
    removeContextButton.className = 'context__remove'
    removeContextButton.textContent = 'x'
    contextButton.className = 'context__switch'

    context.tabs.forEach((t) => {
        const div = document.createElement('div')
        const img = document.createElement('img')
        const popover = document.createElement('div')

        popover.popover = 'manual'
        popover.textContent = t.title
        popover.className = 'popover'

        img.src = t.favIconUrl
        img.alt = t.title

        div.className = 'context__tab'
        div.append(img)
        div.append(popover)

        div.onmouseenter = () => {
            popover.showPopover()
        }

        div.onmouseleave = () => {
            popover.hidePopover()
        }

        contextButton.append(div)
    })

    contextButton.onclick = async () => {
        await switchContext(context.id)
        await updateList()
    }

    contextDiv.append(contextTitle)
    contextDiv.append(removeContextButton)
    contextDiv.append(contextButton)
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