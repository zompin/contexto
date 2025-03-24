import {getContexts} from './getContexts.js'
import {getActiveContext} from './getActiveContext.js'
import {setContexts} from './setContexts.js'

export async function switchContext(contextId) {
    const activeContext = await getActiveContext()
    const storedContexts = await getContexts()
    const contexts = storedContexts.filter(c => c.id !== contextId)
    const contextForActivate = storedContexts.find(c => c.id === contextId)

    contexts.unshift(activeContext)
    await setContexts(contexts)

    contextForActivate.tabs.forEach(({ title, favIconUrl, ...rest }) => browser.tabs.create(rest))
    activeContext.tabs.forEach(t => browser.tabs.remove(t.id))
}
