import { removeContext } from "../js/removeContext.js";
import { getContexts } from "../js/getContexts.js";
import { switchContext } from "../js/switchContext.js";
import { createContext } from "../js/createContext.js";
import { updateContextTitle } from "../js/updateContextTitle.js";
import { app, h, text } from "../js/hyperapp.js";

const getContextsEffect = (dispatch) =>
  getContexts().then((contexts) => dispatch({ contexts }));

const Context = (data) => {
  const onSwitch = (state, id) => [
    state,
    async (dispatch) => {
      await switchContext(id);
      dispatch({ contexts: await getContexts() });
    },
  ];

  const onRemove = (state, id) => [
    state,
    async (dispatch) => {
      await removeContext(id);
      dispatch({ contexts: await getContexts() });
    },
  ];

  const onChange = (id) => (state, e) => [
    state,
    async (dispatch) => {
      await updateContextTitle(id, e.target.value);
      dispatch({ contexts: await getContexts() });
    },
  ];

  const onPopoverShow = (state, e) => (
    e.target.nextSibling?.showPopover(), state
  );

  const onPopoverHide = (state, e) => (
    e.target.nextSibling?.hidePopover(), state
  );

  const tabs = data.tabs.map((tab) =>
    h("div", { class: "context__tab" }, [
      h("img", {
        src: tab.favIconUrl,
        alt: tab.title,
        onmouseenter: onPopoverShow,
        onmouseleave: onPopoverHide,
      }),
      h("div", { class: "popover", popover: "manual" }, [text(tab.title)]),
    ]),
  );

  return h("div", { class: "context" }, [
    h("input", {
      class: "context__title",
      onkeyup: onChange(data.id),
      value: data.title,
    }),
    h("button", { class: "context__remove", onclick: [onRemove, data.id] }, [
      text("x"),
    ]),
    h(
      "button",
      { class: "context__switch", onclick: [onSwitch, data.id] },
      tabs,
    ),
  ]);
};

app({
  init: [{ contexts: [] }, getContextsEffect],
  view: (state) => {
    const onBlankContext = (state) => [
      state,
      async (dispatch) => {
        await createContext();
        const contexts = await getContexts();
        dispatch({ contexts });
      },
    ];

    return h("div", {}, [
      ...state.contexts.map(Context),
      h("button", { onclick: onBlankContext }, [text("Blank context")]),
    ]);
  },
  node: document.querySelector(".container"),
});
