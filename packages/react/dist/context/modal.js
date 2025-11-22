import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useState, useMemo } from "react";
const ModalContext = React.createContext({
    component: null,
    showModal: () => { },
    hideModal: () => { },
});
const ModalProvider = ({ children, }) => {
    const [component, setComponent] = useState(null);
    const showModal = useCallback((c) => {
        setComponent(c);
    }, []);
    const hideModal = useCallback(() => {
        setComponent(null);
    }, []);
    const providerValue = useMemo(() => ({
        component: null,
        showModal,
        hideModal,
    }), [hideModal, showModal]);
    return (_jsxs(ModalContext.Provider, { value: providerValue, children: [children, component && (_jsx("div", { onMouseDown: (e) => e.stopPropagation(), onMouseMove: (e) => e.stopPropagation(), onMouseUp: (e) => e.stopPropagation(), onContextMenu: (e) => e.stopPropagation(), className: "fortune-popover-backdrop fortune-modal-container", children: component }))] }));
};
export { ModalContext, ModalProvider };
