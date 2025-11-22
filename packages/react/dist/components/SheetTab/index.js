import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import _ from "lodash";
import { useCallback, useContext, useEffect, useRef, useState, } from "react";
import { updateCell, addSheet, locale } from "@nde-sheet/core";
// @ts-ignore
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import "./index.css";
import SheetItem from "./SheetItem";
import ZoomControl from "../ZoomControl";
const SheetTab = () => {
    const { context, setContext, settings, refs } = useContext(WorkbookContext);
    const tabContainerRef = useRef(null);
    const leftScrollRef = useRef(null);
    const rightScrollRef = useRef(null);
    const [isShowScrollBtn, setIsShowScrollBtn] = useState(false);
    const [isShowBoundary, setIsShowBoundary] = useState(true);
    const { info } = locale(context);
    const scrollDelta = 150;
    const scrollBy = useCallback((amount) => {
        if (tabContainerRef.current == null ||
            tabContainerRef.current.scrollLeft == null) {
            return;
        }
        const { scrollLeft } = tabContainerRef.current;
        if (scrollLeft + amount <= 0)
            setIsShowBoundary(true);
        else if (scrollLeft > 0)
            setIsShowBoundary(false);
        tabContainerRef.current?.scrollBy({
            left: amount,
            behavior: "smooth",
        });
    }, []);
    useEffect(() => {
        const tabCurrent = tabContainerRef.current;
        if (!tabCurrent)
            return;
        setIsShowScrollBtn(tabCurrent.scrollWidth - 2 > tabCurrent.clientWidth);
    }, [context.luckysheetfile]);
    const onAddSheetClick = useCallback(() => setTimeout(() => {
        setContext((draftCtx) => {
            if (draftCtx.luckysheetCellUpdate.length > 0) {
                updateCell(draftCtx, draftCtx.luckysheetCellUpdate[0], draftCtx.luckysheetCellUpdate[1], refs.cellInput.current);
            }
            addSheet(draftCtx, settings);
        }, { addSheetOp: true });
        const tabCurrent = tabContainerRef.current;
        setIsShowScrollBtn(tabCurrent.scrollWidth > tabCurrent.clientWidth);
    }), [refs.cellInput, setContext, settings]);
    return (_jsxs("div", { className: "luckysheet-sheet-area luckysheet-noselected-text", onContextMenu: (e) => e.preventDefault(), id: "luckysheet-sheet-area", children: [_jsxs("div", { id: "luckysheet-sheet-content", children: [context.allowEdit && (_jsx("div", { className: "fortune-sheettab-button", onClick: onAddSheetClick, tabIndex: 0, "aria-label": info.newSheet, role: "button", children: _jsx(SVGIcon, { name: "plus", width: 16, height: 16 }) })), context.allowEdit && (_jsx("div", { className: "sheet-list-container", children: _jsx("div", { id: "all-sheets", className: "fortune-sheettab-button", ref: tabContainerRef, onMouseDown: (e) => {
                                e.stopPropagation();
                                setContext((ctx) => {
                                    ctx.showSheetList = _.isUndefined(ctx.showSheetList)
                                        ? true
                                        : !ctx.showSheetList;
                                    ctx.sheetTabContextMenu = {};
                                });
                            }, children: _jsx(SVGIcon, { name: "all-sheets", width: 16, height: 16 }) }) })), _jsx("div", { id: "luckysheet-sheets-m", className: "luckysheet-sheets-m lucky-button-custom", children: _jsx("i", { className: "iconfont luckysheet-iconfont-caidan2" }) }), _jsxs("div", { className: "fortune-sheettab-container", id: "fortune-sheettab-container", children: [!isShowBoundary && _jsx("div", { className: "boundary boundary-left" }), _jsx("div", { className: "fortune-sheettab-container-c", id: "fortune-sheettab-container-c", ref: tabContainerRef, children: _.sortBy(context.luckysheetfile, (s) => Number(s.order)).map((sheet) => {
                                    return _jsx(SheetItem, { sheet: sheet }, sheet.id);
                                }) }), isShowBoundary && isShowScrollBtn && (_jsx("div", { className: "boundary boundary-right" }))] }), isShowScrollBtn && (_jsx("div", { id: "fortune-sheettab-leftscroll", className: "fortune-sheettab-scroll", ref: leftScrollRef, onClick: () => {
                            scrollBy(-scrollDelta);
                        }, tabIndex: 0, children: _jsx(SVGIcon, { name: "arrow-doubleleft", width: 12, height: 12 }) })), isShowScrollBtn && (_jsx("div", { id: "fortune-sheettab-rightscroll", className: "fortune-sheettab-scroll", ref: rightScrollRef, onClick: () => {
                            scrollBy(scrollDelta);
                        }, tabIndex: 0, children: _jsx(SVGIcon, { name: "arrow-doubleright", width: 12, height: 12 }) }))] }), _jsx("div", { className: "fortune-sheet-area-right", children: _jsx(ZoomControl, {}) })] }));
};
export default SheetTab;
