import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { rowLocation, rowLocationByIndex, selectTitlesMap, selectTitlesRange, handleContextMenu, handleRowHeaderMouseDown, handleRowSizeHandleMouseDown, fixRowStyleOverflowInFreeze, handleRowFreezeHandleMouseDown, getSheetIndex, fixPositionOnFrozenCells, } from "@nde-sheet/core";
import _ from "lodash";
import { useContext, useState, useRef, useCallback, useEffect, useMemo, } from "react";
import WorkbookContext from "../../context";
const RowHeader = () => {
    const { context, setContext, settings, refs } = useContext(WorkbookContext);
    const rowChangeSizeRef = useRef(null);
    const containerRef = useRef(null);
    const [hoverLocation, setHoverLocation] = useState({
        row: -1,
        row_pre: -1,
        row_index: -1,
    });
    const [hoverInFreeze, setHoverInFreeze] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const sheetIndex = getSheetIndex(context, context.currentSheetId);
    const sheet = sheetIndex == null ? null : context.luckysheetfile[sheetIndex];
    const freezeHandleTop = useMemo(() => {
        if (sheet?.frozen?.type === "row" ||
            sheet?.frozen?.type === "rangeRow" ||
            sheet?.frozen?.type === "rangeBoth" ||
            sheet?.frozen?.type === "both") {
            return (rowLocationByIndex(sheet?.frozen?.range?.row_focus || 0, context.visibledatarow)[1] + context.scrollTop);
        }
        return context.scrollTop;
    }, [context.visibledatarow, sheet?.frozen, context.scrollTop]);
    const onMouseMove = useCallback((e) => {
        if (context.luckysheet_rows_change_size) {
            return;
        }
        const mouseY = e.pageY -
            containerRef.current.getBoundingClientRect().top -
            window.scrollY;
        const _y = mouseY + containerRef.current.scrollTop;
        const freeze = refs.globalCache.freezen?.[context.currentSheetId];
        const { y, inHorizontalFreeze } = fixPositionOnFrozenCells(freeze, 0, _y, 0, mouseY);
        const row_location = rowLocation(y, context.visibledatarow);
        const [row_pre, row, row_index] = row_location;
        if (row_pre !== hoverLocation.row_pre || row !== hoverLocation.row) {
            setHoverLocation({ row_pre, row, row_index });
            setHoverInFreeze(inHorizontalFreeze);
        }
    }, [
        context.luckysheet_rows_change_size,
        context.visibledatarow,
        hoverLocation.row,
        hoverLocation.row_pre,
        refs.globalCache.freezen,
        context.currentSheetId,
    ]);
    const onMouseDown = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleRowHeaderMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.cellInput.current, refs.fxInput.current);
        });
    }, [refs.globalCache, refs.cellInput, refs.fxInput, setContext]);
    const onMouseLeave = useCallback(() => {
        if (context.luckysheet_rows_change_size) {
            return;
        }
        setHoverLocation({ row: -1, row_pre: -1, row_index: -1 });
    }, [context.luckysheet_rows_change_size]);
    const onRowSizeHandleMouseDown = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleRowSizeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    const onRowFreezeHandleMouseDown = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleRowFreezeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    const onContextMenu = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleContextMenu(draftCtx, settings, nativeEvent, refs.workbookContainer.current, refs.cellArea.current, "rowHeader");
        });
    }, [refs.workbookContainer, setContext, settings, refs.cellArea]);
    useEffect(() => {
        const s = context.luckysheet_select_save || [];
        let rowTitleMap = {};
        for (let i = 0; i < s.length; i += 1) {
            const r1 = s[i].row[0];
            const r2 = s[i].row[1];
            rowTitleMap = selectTitlesMap(rowTitleMap, r1, r2);
        }
        const rowTitleRange = selectTitlesRange(rowTitleMap);
        const selects = [];
        for (let i = 0; i < rowTitleRange.length; i += 1) {
            const r1 = rowTitleRange[i][0];
            const r2 = rowTitleRange[i][rowTitleRange[i].length - 1];
            const row = rowLocationByIndex(r2, context.visibledatarow)[1];
            const row_pre = rowLocationByIndex(r1, context.visibledatarow)[0];
            if (_.isNumber(row_pre) && _.isNumber(row)) {
                selects.push({ row, row_pre, r1, r2 });
            }
        }
        setSelectedLocation(selects);
    }, [context.luckysheet_select_save, context.visibledatarow]);
    useEffect(() => {
        containerRef.current.scrollTop = context.scrollTop;
    }, [context.scrollTop]);
    return (_jsxs("div", { ref: containerRef, className: "fortune-row-header", style: {
            width: context.rowHeaderWidth - 1.5,
            height: context.cellmainHeight,
        }, onMouseMove: onMouseMove, onMouseDown: onMouseDown, onMouseLeave: onMouseLeave, onContextMenu: onContextMenu, children: [_jsx("div", { className: "fortune-rows-freeze-handle", onMouseDown: onRowFreezeHandleMouseDown, style: {
                    top: freezeHandleTop || 0,
                } }), _jsx("div", { className: "fortune-rows-change-size", ref: rowChangeSizeRef, onMouseDown: onRowSizeHandleMouseDown, style: {
                    top: hoverLocation.row - 3 + (hoverInFreeze ? context.scrollTop : 0),
                    opacity: context.luckysheet_rows_change_size ? 1 : 0,
                } }), !context.luckysheet_rows_change_size && hoverLocation.row_index >= 0 ? (_jsx("div", { className: "fortune-row-header-hover", style: _.assign({
                    top: hoverLocation.row_pre,
                    height: hoverLocation.row - hoverLocation.row_pre - 1,
                    display: "block",
                }, fixRowStyleOverflowInFreeze(context, hoverLocation.row_index, hoverLocation.row_index, refs.globalCache.freezen?.[context.currentSheetId])) })) : null, selectedLocation.map(({ row, row_pre, r1, r2 }, i) => (_jsx("div", { className: "fortune-row-header-selected", style: _.assign({
                    top: row_pre,
                    height: row - row_pre - 1,
                    display: "block",
                    backgroundColor: "rgba(76, 76, 76, 0.1)",
                }, fixRowStyleOverflowInFreeze(context, r1, r2, refs.globalCache.freezen?.[context.currentSheetId])) }, i))), _jsx("div", { style: { height: context.rh_height, width: 1 }, id: "luckysheetrowHeader_0", className: "luckysheetsheetchange" })] }));
};
export default RowHeader;
