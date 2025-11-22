import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useCallback } from "react";
import MessageBox from "../components/MessageBox";
import { ModalContext } from "../context/modal";
export function useAlert() {
    const { showModal, hideModal } = useContext(ModalContext);
    const showAlert = useCallback((message, type = "ok", onOk = hideModal, onCancel = hideModal) => {
        showModal(_jsx(MessageBox, { type: type, onOk: onOk, onCancel: onCancel, children: message }));
    }, [hideModal, showModal]);
    return {
        showAlert,
        hideAlert: hideModal,
    };
}
