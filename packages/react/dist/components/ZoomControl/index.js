import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useContext, useRef, useState } from "react";
import { MAX_ZOOM_RATIO, MIN_ZOOM_RATIO, getSheetIndex, locale, } from "@nde-sheet/core";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import "./index.css";
const presets = [
    {
        text: "10%",
        value: 0.1,
    },
    {
        text: "30%",
        value: 0.3,
    },
    {
        text: "50%",
        value: 0.5,
    },
    {
        text: "70%",
        value: 0.7,
    },
    {
        text: "100%",
        value: 1,
    },
    {
        text: "150%",
        value: 1.5,
    },
    {
        text: "200%",
        value: 2,
    },
    {
        text: "300%",
        value: 3,
    },
    {
        text: "400%",
        value: 4,
    },
];
const ZoomControl = () => {
    const { context, setContext } = useContext(WorkbookContext);
    const menuRef = useRef(null);
    const [radioMenuOpen, setRadioMenuOpen] = useState(false);
    const { info } = locale(context);
    useOutsideClick(menuRef, () => {
        setRadioMenuOpen(false);
    }, []);
    const zoomTo = useCallback((val) => {
        val = parseFloat(val.toFixed(1));
        if (val > MAX_ZOOM_RATIO || val < MIN_ZOOM_RATIO) {
            return;
        }
        setContext((ctx) => {
            const index = getSheetIndex(ctx, ctx.currentSheetId);
            if (index == null) {
                return;
            }
            ctx.luckysheetfile[index].zoomRatio = val;
            ctx.zoomRatio = val;
        }, { noHistory: true });
    }, [setContext]);
    return (_jsxs("aside", { title: "Zoom settings", className: "fortune-zoom-container", children: [_jsx("div", { className: "fortune-zoom-button", "aria-label": info.zoomOut, onClick: (e) => {
                    zoomTo(context.zoomRatio - 0.1);
                    e.stopPropagation();
                }, tabIndex: 0, role: "button", children: _jsx(SVGIcon, { name: "minus", width: 16, height: 16 }) }), _jsxs("div", { className: "fortune-zoom-ratio", children: [_jsxs("div", { className: "fortune-zoom-ratio-current fortune-zoom-button", onClick: () => setRadioMenuOpen(true), tabIndex: 0, children: [(context.zoomRatio * 100).toFixed(0), "%"] }), radioMenuOpen && (_jsx("div", { className: "fortune-zoom-ratio-menu", ref: menuRef, children: presets.map((v) => (_jsx("div", { className: "fortune-zoom-ratio-item", onClick: (e) => {
                                zoomTo(v.value);
                                e.preventDefault();
                            }, tabIndex: 0, children: _jsx("div", { className: "fortune-zoom-ratio-text", children: v.text }) }, v.text))) }))] }), _jsx("div", { className: "fortune-zoom-button", "aria-label": info.zoomIn, onClick: (e) => {
                    zoomTo(context.zoomRatio + 0.1);
                    e.stopPropagation();
                }, tabIndex: 0, role: "button", children: _jsx(SVGIcon, { name: "plus", width: 16, height: 16 }) })] }));
};
export default ZoomControl;
