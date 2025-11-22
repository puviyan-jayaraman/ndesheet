import { jsx as _jsx } from "react/jsx-runtime";
import _ from "lodash";
import { useContext, useRef, useCallback } from "react";
import WorkbookContext from "../../context";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import "./index.css";
import SheetListItem from "./SheetListItem";
const SheetList = () => {
    const { context, setContext } = useContext(WorkbookContext);
    const containerRef = useRef(null);
    const close = useCallback(() => {
        setContext((ctx) => {
            ctx.showSheetList = false;
        });
    }, [setContext]);
    useOutsideClick(containerRef, close, [close]);
    return (_jsx("div", { className: "fortune-context-menu luckysheet-cols-menu fortune-sheet-list", ref: containerRef, children: _.sortBy(context.luckysheetfile, (s) => Number(s.order)).map((singleSheet) => {
            return _jsx(SheetListItem, { sheet: singleSheet }, singleSheet.id);
        }) }));
};
export default SheetList;
