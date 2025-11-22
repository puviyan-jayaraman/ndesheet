import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { colLocation, colLocationByIndex, selectTitlesMap, selectTitlesRange, handleColSizeHandleMouseDown, handleColumnHeaderMouseDown, handleContextMenu, isAllowEdit, getFlowdata, fixColumnStyleOverflowInFreeze, handleColFreezeHandleMouseDown, getSheetIndex, fixPositionOnFrozenCells, } from "@nde-sheet/core";
import _ from "lodash";
import { useContext, useState, useRef, useCallback, useEffect, useMemo, } from "react";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
const ColumnHeader = () => {
    const { context, setContext, settings, refs } = useContext(WorkbookContext);
    const containerRef = useRef(null);
    const colChangeSizeRef = useRef(null);
    const [hoverLocation, setHoverLocation] = useState({
        col: -1,
        col_pre: -1,
        col_index: -1,
    });
    const [hoverInFreeze, setHoverInFreeze] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const allowEditRef = useRef(true);
    const sheetIndex = getSheetIndex(context, context.currentSheetId);
    const sheet = sheetIndex == null ? null : context.luckysheetfile[sheetIndex];
    const freezeHandleLeft = useMemo(() => {
        if (sheet?.frozen?.type === "column" ||
            sheet?.frozen?.type === "rangeColumn" ||
            sheet?.frozen?.type === "rangeBoth" ||
            sheet?.frozen?.type === "both") {
            return (colLocationByIndex(sheet?.frozen?.range?.column_focus || 0, context.visibledatacolumn)[1] -
                2 +
                context.scrollLeft);
        }
        return context.scrollLeft;
    }, [context.visibledatacolumn, sheet?.frozen, context.scrollLeft]);
    const onMouseMove = useCallback((e) => {
        if (context.luckysheet_cols_change_size) {
            return;
        }
        const mouseX = e.pageX -
            containerRef.current.getBoundingClientRect().left -
            window.scrollX;
        const _x = mouseX + containerRef.current.scrollLeft;
        const freeze = refs.globalCache.freezen?.[context.currentSheetId];
        const { x, inVerticalFreeze } = fixPositionOnFrozenCells(freeze, _x, 0, mouseX, 0);
        const col_location = colLocation(x, context.visibledatacolumn);
        const [col_pre, col, col_index] = col_location;
        if (col_index !== hoverLocation.col_index) {
            setHoverLocation({ col_pre, col, col_index });
            setHoverInFreeze(inVerticalFreeze);
        }
        const flowdata = getFlowdata(context);
        if (!_.isNil(flowdata))
            allowEditRef.current =
                isAllowEdit(context) &&
                    isAllowEdit(context, [
                        {
                            row: [0, flowdata.length - 1],
                            column: col_location,
                        },
                    ]);
    }, [context, hoverLocation.col_index, refs.globalCache.freezen]);
    const onMouseDown = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleColumnHeaderMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.cellInput.current, refs.fxInput.current);
        });
    }, [refs.globalCache, refs.cellInput, refs.fxInput, setContext]);
    const onMouseLeave = useCallback(() => {
        if (context.luckysheet_cols_change_size) {
            return;
        }
        setHoverLocation({ col: -1, col_pre: -1, col_index: -1 });
    }, [context.luckysheet_cols_change_size]);
    const onColSizeHandleMouseDown = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleColSizeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    const onColFreezeHandleMouseDown = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleColFreezeHandleMouseDown(draftCtx, refs.globalCache, nativeEvent, containerRef.current, refs.workbookContainer.current, refs.cellArea.current);
        });
        e.stopPropagation();
    }, [refs.cellArea, refs.globalCache, refs.workbookContainer, setContext]);
    const onContextMenu = useCallback((e) => {
        const { nativeEvent } = e;
        setContext((draftCtx) => {
            handleContextMenu(draftCtx, settings, nativeEvent, refs.workbookContainer.current, refs.cellArea.current, "columnHeader");
        });
    }, [refs.workbookContainer, setContext, settings, refs.cellArea]);
    useEffect(() => {
        const s = context.luckysheet_select_save;
        if (_.isNil(s))
            return;
        let columnTitleMap = {};
        for (let i = 0; i < s.length; i += 1) {
            const c1 = s[i].column[0];
            const c2 = s[i].column[1];
            columnTitleMap = selectTitlesMap(columnTitleMap, c1, c2);
        }
        const columnTitleRange = selectTitlesRange(columnTitleMap);
        const selects = [];
        for (let j = 0; j < columnTitleRange.length; j += 1) {
            const c1 = columnTitleRange[j][0];
            const c2 = columnTitleRange[j][columnTitleRange[j].length - 1];
            const col = colLocationByIndex(c2, context.visibledatacolumn)[1];
            const col_pre = colLocationByIndex(c1, context.visibledatacolumn)[0];
            if (_.isNumber(col) && _.isNumber(col_pre)) {
                selects.push({ col, col_pre, c1, c2 });
            }
        }
        setSelectedLocation(selects);
    }, [context.luckysheet_select_save, context.visibledatacolumn]);
    useEffect(() => {
        containerRef.current.scrollLeft = context.scrollLeft;
    }, [context.scrollLeft]);
    return (_jsxs("div", { ref: containerRef, className: "fortune-col-header", style: {
            height: context.columnHeaderHeight - 1.5,
        }, onMouseMove: onMouseMove, onMouseDown: onMouseDown, onMouseLeave: onMouseLeave, onContextMenu: onContextMenu, children: [_jsx("div", { className: "fortune-cols-freeze-handle", onMouseDown: onColFreezeHandleMouseDown, style: {
                    left: freezeHandleLeft || 0,
                } }), _jsx("div", { className: "fortune-cols-change-size", ref: colChangeSizeRef, id: "fortune-cols-change-size", onMouseDown: onColSizeHandleMouseDown, style: {
                    left: hoverLocation.col - 5 + (hoverInFreeze ? context.scrollLeft : 0),
                    opacity: context.luckysheet_cols_change_size ? 1 : 0,
                } }), !context.luckysheet_cols_change_size && hoverLocation.col_index >= 0 ? (_jsx("div", { className: "fortune-col-header-hover", style: _.assign({
                    left: hoverLocation.col_pre,
                    width: hoverLocation.col - hoverLocation.col_pre - 1,
                    display: "block",
                }, fixColumnStyleOverflowInFreeze(context, hoverLocation.col_index, hoverLocation.col_index, refs.globalCache.freezen?.[context.currentSheetId])), children: allowEditRef.current && (_jsx("span", { className: "header-arrow", onClick: (e) => {
                        setContext((ctx) => {
                            ctx.contextMenu = {
                                x: e.pageX,
                                y: 90,
                                headerMenu: true,
                            };
                        });
                    }, tabIndex: 0, children: _jsx(SVGIcon, { name: "headDownArrow", width: 12 }) })) })) : null, selectedLocation.map(({ col, col_pre, c1, c2 }, i) => (_jsx("div", { className: "fortune-col-header-selected", style: _.assign({
                    left: col_pre,
                    width: col - col_pre - 1,
                    display: "block",
                    backgroundColor: "rgba(76, 76, 76, 0.1)",
                }, fixColumnStyleOverflowInFreeze(context, c1, c2, refs.globalCache.freezen?.[context.currentSheetId])) }, i))), _jsx("div", { className: "luckysheet-cols-h-cells luckysheetsheetchange", id: "luckysheet-cols-h-cells_0", style: { width: context.ch_width, height: 1 }, children: _jsx("div", { className: "luckysheet-cols-h-cells-c", children: _jsx("div", { className: "luckysheet-grdblkpush" }) }) })] }));
};
export default ColumnHeader;
