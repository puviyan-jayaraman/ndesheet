import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useCallback } from "react";
import Dialog from "../components/Dialog";
import { ModalContext } from "../context/modal";
export function useDialog() {
    const { showModal, hideModal } = useContext(ModalContext);
    const showDialog = useCallback((content, type, onOk = hideModal, onCancel = hideModal) => {
        showModal(_jsx(Dialog, { type: type, onOk: onOk, onCancel: onCancel, children: content }));
    }, [hideModal, showModal]);
    return {
        showDialog,
        hideDialog: hideModal,
    };
}
