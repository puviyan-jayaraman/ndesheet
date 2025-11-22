import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLayoutEffect, useRef, useState, useContext, } from "react";
import { locale } from "@nde-sheet/core";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import SVGIcon from "../SVGIcon";
import WorkbookContext from "../../context";
const Combo = ({ tooltip, onClick, text, iconId, children }) => {
    const { context } = useContext(WorkbookContext);
    const style = { userSelect: "none" };
    const [open, setOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ left: 0 });
    const popupRef = useRef(null);
    const buttonRef = useRef(null);
    const { info } = locale(context);
    useOutsideClick(popupRef, () => {
        setOpen(false);
    });
    useLayoutEffect(() => {
        // re-position the popup menu if it overflows the window
        if (!popupRef.current) {
            return;
        }
        if (!open) {
            setPopupPosition({ left: 0 });
        }
        const winW = window.innerWidth;
        const rect = popupRef.current.getBoundingClientRect();
        const menuW = rect.width;
        const { left } = rect;
        if (left + menuW > winW) {
            setPopupPosition({ left: -rect.width + buttonRef.current.clientWidth });
        }
    }, [open]);
    return (_jsxs("div", { className: "fortune-toobar-combo-container fortune-toolbar-item", children: [_jsxs("div", { ref: buttonRef, className: "fortune-toolbar-combo", children: [_jsx("div", { className: "fortune-toolbar-combo-button", onClick: (e) => {
                            if (onClick)
                                onClick(e);
                            else
                                setOpen(!open);
                        }, tabIndex: 0, "data-tips": tooltip, role: "button", "aria-label": `${tooltip}: ${text !== undefined ? text : ""}`, style: style, children: iconId ? (_jsx(SVGIcon, { name: iconId })) : (_jsx("span", { className: "fortune-toolbar-combo-text", children: text !== undefined ? text : "" })) }), _jsx("div", { className: "fortune-toolbar-combo-arrow", onClick: () => setOpen(!open), tabIndex: 0, "data-tips": tooltip, role: "button", "aria-label": `${tooltip}: ${info.Dropdown}`, style: style, children: _jsx(SVGIcon, { name: "combo-arrow", width: 10 }) }), tooltip && _jsx("div", { className: "fortune-tooltip", children: tooltip })] }), open && (_jsx("div", { ref: popupRef, className: "fortune-toolbar-combo-popup", style: popupPosition, children: children?.(setOpen) }))] }));
};
export default Combo;
