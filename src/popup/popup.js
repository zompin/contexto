import { getContexts } from "../js/getContexts.js";
import { createContext } from "../js/createContext.js";
import { getCurrentContextTitle } from "../js/getCurrentContextTitle.js";
import { setCurrentContextTitle } from "../js/setCurrentContextTitle.js";
import { getAppData } from "../js/getAppData.js";
import { Context } from "./context.js";
import { app, h, text } from "../js/hyperapp.js";

const getDataEffect = async (dispatch) => dispatch(await getAppData());

app({
    init: [{ contexts: [], currentContextTitle: "" }, getDataEffect],
    view: (state) => {
        const onBlankContext = (state) => [
            state,
            async (dispatch) => {
                await createContext();
                const contexts = await getContexts();
                dispatch({ contexts });
                await setCurrentContextTitle("");
            },
        ];

        const onCurrentContextChange = (state, e) => [
            state,
            async () => setCurrentContextTitle(e.target.value),
        ];

        return h("div", {}, [
            h("input", {
                type: "text",
                value: state.currentContextTitle || "New context",
                onkeyup: onCurrentContextChange,
            }),
            ...(state.contexts.length
                ? state.contexts.map(Context)
                : [h("div", {}, [text("No contexts")])]),
            h("button", { onclick: onBlankContext }, [text("Blank context")]),
        ]);
    },
    node: document.querySelector(".container"),
});
