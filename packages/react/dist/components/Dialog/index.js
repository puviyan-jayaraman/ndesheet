import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { locale } from "@nde-sheet/core";
import { useContext } from "react";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import "./index.css";
const Dialog = ({ type, onOk, onCancel, children, containerStyle, contentStyle, }) => {
    const { context } = useContext(WorkbookContext);
    const { button } = locale(context);
    return (_jsxs("div", { className: "fortune-dialog", style: containerStyle, children: [_jsx("div", { className: "fortune-modal-dialog-header", children: _jsx("div", { className: "fortune-modal-dialog-icon-close", onClick: onCancel, tabIndex: 0, children: _jsx(SVGIcon, { name: "close", style: { padding: 7, cursor: "pointer" } }) }) }), _jsx("div", { className: "fortune-dialog-box-content", style: contentStyle, children: children }), type != null && (_jsx("div", { className: "fortune-dialog-box-button-container", children: type === "ok" ? (_jsx("div", { className: "fortune-message-box-button button-default", onClick: onOk, tabIndex: 0, children: button.confirm })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "fortune-message-box-button button-primary", onClick: onOk, tabIndex: 0, children: button.confirm }), _jsx("div", { className: "fortune-message-box-button button-default", onClick: onCancel, tabIndex: 0, children: button.cancel })] })) }))] }));
};
export default Dialog;
