import { removeContext } from "../js/removeContext.js";
import { switchContext } from "../js/switchContext.js";
import { getAppData } from "../js/getAppData.js";
import { h, text } from "../js/hyperapp.js";

export const Context = (data) => {
    const onSwitch = (state, id) => [
        state,
        async (dispatch) => {
            await switchContext(id);
            dispatch(await getAppData());
        },
    ];

    const onRemove = (state, id) => [
        state,
        async (dispatch) => {
            await removeContext(id);
            dispatch(await getAppData());
        },
    ];

    const onPopoverShow = (state, e) => (
        e.target.previousSibling?.showPopover(), state
    );

    const onPopoverHide = (state, e) => (
        e.target.previousSibling?.hidePopover(), state
    );

    const tabs = data.tabs.map((tab) =>
        h("div", { class: "context__tab" }, [
            h("div", { class: "popover", popover: "manual" }, [
                text(tab.title),
                h("br", {}),
                text(decodeURIComponent(tab.url)),
            ]),
            h("img", {
                src: tab.favIconUrl,
                alt: tab.title,
                onmouseenter: onPopoverShow,
                onmouseleave: onPopoverHide,
            }),
        ]),
    );

    return h("div", { class: "context" }, [
        h("div", { class: "context__title" }, [
            text(data.title || "New context"),
        ]),
        h(
            "button",
            { class: "context__switch", onclick: [onSwitch, data.id] },
            tabs,
        ),
        h(
            "button",
            { class: "context__remove", onclick: [onRemove, data.id] },
            [text("x")],
        ),
    ]);
};
