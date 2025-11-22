import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { defaultContext, defaultSettings, initSheetIndex, handleGlobalKeyDown, getSheetIndex, handlePaste, filterPatch, patchToOp, inverseRowColOptions, ensureSheetIndex, insertRowCol, locale, calcSelectionInfo, groupValuesRefresh, setFormulaCellInfoMap, } from "@nde-sheet/core";
import React, { useMemo, useState, useCallback, useEffect, useRef, useImperativeHandle, } from "react";
import "./index.css";
import produce, { applyPatches, enablePatches, produceWithPatches, } from "immer";
import _ from "lodash";
import Sheet from "../Sheet";
import WorkbookContext from "../../context";
import Toolbar from "../Toolbar";
import FxEditor from "../FxEditor";
import SheetTab from "../SheetTab";
import ContextMenu from "../ContextMenu";
import SVGDefines from "../SVGDefines";
import SheetTabContextMenu from "../ContextMenu/SheetTab";
import MoreItemsContaier from "../Toolbar/MoreItemsContainer";
import { generateAPIs } from "./api";
import { ModalProvider } from "../../context/modal";
import FilterMenu from "../ContextMenu/FilterMenu";
import SheetList from "../SheetList";
enablePatches();
const triggerGroupValuesRefresh = (ctx) => {
    if (ctx.groupValuesRefreshData.length > 0) {
        groupValuesRefresh(ctx);
    }
};
const concatProducer = (...producers) => {
    return (ctx) => {
        producers.forEach((producer) => {
            producer(ctx);
        });
    };
};
const Workbook = React.forwardRef(({ onChange, onOp, data: originalData, ...props }, ref) => {
    const globalCache = useRef({ undoList: [], redoList: [] });
    const cellInput = useRef(null);
    const fxInput = useRef(null);
    const canvas = useRef(null);
    const scrollbarX = useRef(null);
    const scrollbarY = useRef(null);
    const cellArea = useRef(null);
    const workbookContainer = useRef(null);
    const refs = useMemo(() => ({
        globalCache: globalCache.current,
        cellInput,
        fxInput,
        canvas,
        scrollbarX,
        scrollbarY,
        cellArea,
        workbookContainer,
    }), []);
    const [context, setContext] = useState(defaultContext(refs));
    const { formula, info } = locale(context);
    const [moreToolbarItems, setMoreToolbarItems] = useState(null);
    const [calInfo, setCalInfo] = useState({
        numberC: 0,
        count: 0,
        sum: 0,
        max: 0,
        min: 0,
        average: "",
    });
    const mergedSettings = useMemo(() => _.assign(_.cloneDeep(defaultSettings), props), 
    // props expect data, onChage, onOp
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [..._.values(props)]);
    // 计算选区的信息
    useEffect(() => {
        const selection = context.luckysheet_select_save;
        const { lang } = props;
        if (selection) {
            const re = calcSelectionInfo(context, lang);
            setCalInfo(re);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.luckysheet_select_save]);
    const initSheetData = useCallback((draftCtx, newData, index) => {
        const { celldata, row, column } = newData;
        const lastRow = _.maxBy(celldata, "r");
        const lastCol = _.maxBy(celldata, "c");
        let lastRowNum = (lastRow?.r ?? 0) + 1;
        let lastColNum = (lastCol?.c ?? 0) + 1;
        if (row != null && column != null && row > 0 && column > 0) {
            lastRowNum = Math.max(lastRowNum, row);
            lastColNum = Math.max(lastColNum, column);
        }
        else {
            lastRowNum = Math.max(lastRowNum, draftCtx.defaultrowNum);
            lastColNum = Math.max(lastColNum, draftCtx.defaultcolumnNum);
        }
        if (lastRowNum && lastColNum) {
            const expandedData = _.times(lastRowNum, () => _.times(lastColNum, () => null));
            celldata?.forEach((d) => {
                // TODO setCellValue(draftCtx, d.r, d.c, expandedData, d.v);
                expandedData[d.r][d.c] = d.v;
            });
            draftCtx.luckysheetfile = produce(draftCtx.luckysheetfile, (d) => {
                d[index].data = expandedData;
                delete d[index].celldata;
                return d;
            });
            return expandedData;
        }
        return null;
    }, []);
    const emitOp = useCallback((ctx, patches, options, undo = false) => {
        if (onOp) {
            onOp(patchToOp(ctx, patches, options, undo));
        }
    }, [onOp]);
    function reduceUndoList(ctx, ctxBefore) {
        const sheetsId = ctx.luckysheetfile.map((sheet) => sheet.id);
        const sheetDeletedByMe = globalCache.current.undoList
            .filter((undo) => undo.options?.deleteSheetOp)
            .map((item) => item.options?.deleteSheetOp?.id);
        globalCache.current.undoList = globalCache.current.undoList.filter((undo) => undo.options?.deleteSheetOp ||
            undo.options?.id === undefined ||
            _.indexOf(sheetsId, undo.options?.id) !== -1 ||
            _.indexOf(sheetDeletedByMe, undo.options?.id) !== -1);
        if (ctxBefore.luckysheetfile.length > ctx.luckysheetfile.length) {
            const sheetDeleted = ctxBefore.luckysheetfile
                .filter((oneSheet) => _.indexOf(ctx.luckysheetfile.map((item) => item.id), oneSheet.id) === -1)
                .map((item) => getSheetIndex(ctxBefore, item.id));
            const deletedIndex = sheetDeleted[0];
            globalCache.current.undoList = globalCache.current.undoList.map((oneStep) => {
                oneStep.patches = oneStep.patches.map((onePatch) => {
                    if (typeof onePatch.path[1] === "number" &&
                        onePatch.path[1] > deletedIndex) {
                        onePatch.path[1] -= 1;
                    }
                    return onePatch;
                });
                oneStep.inversePatches = oneStep.inversePatches.map((onePatch) => {
                    if (typeof onePatch.path[1] === "number" &&
                        onePatch.path[1] > deletedIndex) {
                        onePatch.path[1] -= 1;
                    }
                    return onePatch;
                });
                return oneStep;
            });
        }
    }
    function dataToCelldata(data) {
        const cellData = [];
        for (let row = 0; row < data?.length; row += 1) {
            for (let col = 0; col < data[row]?.length; col += 1) {
                if (data[row][col] !== null) {
                    cellData.push({
                        r: row,
                        c: col,
                        v: data[row][col],
                    });
                }
            }
        }
        return cellData;
    }
    const setContextWithProduce = useCallback((recipe, options = {}) => {
        setContext((ctx_) => {
            const [result, patches, inversePatches] = produceWithPatches(ctx_, concatProducer(recipe, triggerGroupValuesRefresh));
            if (patches.length > 0 && !options.noHistory) {
                if (options.logPatch) {
                    // eslint-disable-next-line no-console
                    console.info("patch", patches);
                }
                const filteredPatches = filterPatch(patches);
                let filteredInversePatches = filterPatch(inversePatches);
                if (filteredInversePatches.length > 0) {
                    options.id = ctx_.currentSheetId;
                    if (options.deleteSheetOp) {
                        const target = ctx_.luckysheetfile.filter((sheet) => sheet.id === options.deleteSheetOp?.id);
                        if (target) {
                            const index = getSheetIndex(ctx_, options.deleteSheetOp.id);
                            options.deletedSheet = {
                                id: options.deleteSheetOp.id,
                                index: index,
                                value: _.cloneDeep(ctx_.luckysheetfile[index]),
                            };
                            options.deletedSheet.value.celldata = dataToCelldata(options.deletedSheet.value.data);
                            delete options.deletedSheet.value.data;
                            options.deletedSheet.value.status = 0;
                            filteredInversePatches = [
                                {
                                    op: "add",
                                    path: ["luckysheetfile", 0],
                                    value: options.deletedSheet.value,
                                },
                            ];
                        }
                    }
                    else if (options.addSheetOp) {
                        options.addSheet = {};
                        options.addSheet.id =
                            result.luckysheetfile[result.luckysheetfile.length - 1].id;
                    }
                    globalCache.current.undoList.push({
                        patches: filteredPatches,
                        inversePatches: filteredInversePatches,
                        options,
                    });
                    globalCache.current.redoList = [];
                    emitOp(result, filteredPatches, options);
                }
            }
            else {
                if (patches?.[0]?.value?.length < ctx_?.luckysheetfile?.length) {
                    reduceUndoList(result, ctx_);
                }
            }
            return result;
        });
    }, [emitOp]);
    const handleUndo = useCallback(() => {
        const history = globalCache.current.undoList.pop();
        if (history) {
            setContext((ctx_) => {
                if (history.options?.deleteSheetOp) {
                    history.inversePatches[0].path[1] = ctx_.luckysheetfile.length;
                    const order = history.options.deletedSheet?.value?.order;
                    const sheetsRight = ctx_.luckysheetfile.filter((sheet) => sheet?.order >= order &&
                        sheet.id !== history?.options?.deleteSheetOp?.id);
                    _.forEach(sheetsRight, (sheet) => {
                        history.inversePatches.push({
                            op: "replace",
                            path: [
                                "luckysheetfile",
                                getSheetIndex(ctx_, sheet.id),
                                "order",
                            ],
                            value: sheet?.order + 1,
                        });
                    });
                }
                const newContext = applyPatches(ctx_, history.inversePatches);
                globalCache.current.redoList.push(history);
                const inversedOptions = inverseRowColOptions(history.options);
                if (inversedOptions?.insertRowColOp) {
                    inversedOptions.restoreDeletedCells = true;
                }
                if (history.options?.addSheetOp) {
                    const index = getSheetIndex(ctx_, history.options.addSheet.id);
                    inversedOptions.addSheet = {
                        id: history.options.addSheet.id,
                        index: index,
                        value: _.cloneDeep(ctx_.luckysheetfile[index]),
                    };
                    inversedOptions.addSheet.value.celldata = dataToCelldata(inversedOptions.addSheet.value?.data);
                    delete inversedOptions.addSheet.value.data;
                }
                emitOp(newContext, history.inversePatches, inversedOptions, true);
                if (history.options?.deleteRowColOp ||
                    history.options?.insertRowColOp ||
                    history.options?.restoreDeletedCells)
                    newContext.formulaCache.formulaCellInfoMap = null;
                else
                    newContext.formulaCache.updateFormulaCache(newContext, history, "undo");
                return newContext;
            });
        }
    }, [emitOp]);
    const handleRedo = useCallback(() => {
        const history = globalCache.current.redoList.pop();
        if (history) {
            setContext((ctx_) => {
                const newContext = applyPatches(ctx_, history.patches);
                globalCache.current.undoList.push(history);
                emitOp(newContext, history.patches, history.options);
                if (history.options?.deleteRowColOp ||
                    history.options?.insertRowColOp ||
                    history.options?.restoreDeletedCells)
                    newContext.formulaCache.formulaCellInfoMap = null;
                else
                    newContext.formulaCache.updateFormulaCache(newContext, history, "redo");
                return newContext;
            });
        }
    }, [emitOp]);
    useEffect(() => {
        if (context.luckysheet_select_save != null) {
            mergedSettings.hooks?.afterSelectionChange?.(context.currentSheetId, context.luckysheet_select_save[0]);
        }
    }, [
        context.currentSheetId,
        context.luckysheet_select_save,
        mergedSettings.hooks,
    ]);
    const providerValue = useMemo(() => ({
        context,
        setContext: setContextWithProduce,
        settings: mergedSettings,
        handleUndo,
        handleRedo,
        refs,
    }), [
        context,
        handleRedo,
        handleUndo,
        mergedSettings,
        refs,
        setContextWithProduce,
    ]);
    useEffect(() => {
        if (!_.isEmpty(context.luckysheetfile)) {
            onChange?.(context.luckysheetfile);
        }
    }, [context.luckysheetfile, onChange]);
    useEffect(() => {
        setContextWithProduce((draftCtx) => {
            draftCtx.defaultcolumnNum = mergedSettings.column;
            draftCtx.defaultrowNum = mergedSettings.row;
            draftCtx.defaultFontSize = mergedSettings.defaultFontSize;
            if (_.isEmpty(draftCtx.luckysheetfile)) {
                const newData = produce(originalData, (draftData) => {
                    ensureSheetIndex(draftData, mergedSettings.generateSheetId);
                });
                draftCtx.luckysheetfile = newData;
                newData.forEach((newDatum) => {
                    const index = getSheetIndex(draftCtx, newDatum.id);
                    const sheet = draftCtx.luckysheetfile?.[index];
                    const cellMatrixData = initSheetData(draftCtx, sheet, index);
                    setFormulaCellInfoMap(draftCtx, sheet.calcChain, cellMatrixData || undefined);
                });
            }
            if (mergedSettings.devicePixelRatio > 0) {
                draftCtx.devicePixelRatio = mergedSettings.devicePixelRatio;
            }
            draftCtx.lang = mergedSettings.lang;
            draftCtx.allowEdit = mergedSettings.allowEdit;
            draftCtx.hooks = mergedSettings.hooks;
            // draftCtx.fontList = mergedSettings.fontList;
            if (_.isEmpty(draftCtx.currentSheetId)) {
                initSheetIndex(draftCtx);
            }
            let sheetIdx = getSheetIndex(draftCtx, draftCtx.currentSheetId);
            if (sheetIdx == null) {
                if ((draftCtx.luckysheetfile?.length ?? 0) > 0) {
                    sheetIdx = 0;
                    draftCtx.currentSheetId = draftCtx.luckysheetfile[0].id;
                }
            }
            if (sheetIdx == null)
                return;
            const sheet = draftCtx.luckysheetfile?.[sheetIdx];
            if (!sheet)
                return;
            let { data } = sheet;
            // expand cell data
            if (_.isEmpty(data)) {
                const temp = initSheetData(draftCtx, sheet, sheetIdx);
                if (!_.isNull(temp)) {
                    data = temp;
                }
            }
            if (_.isEmpty(draftCtx.luckysheet_select_save) &&
                !_.isEmpty(sheet.luckysheet_select_save)) {
                draftCtx.luckysheet_select_save = sheet.luckysheet_select_save;
            }
            if (draftCtx.luckysheet_select_save?.length === 0) {
                if (data?.[0]?.[0]?.mc &&
                    !_.isNil(data?.[0]?.[0]?.mc?.rs) &&
                    !_.isNil(data?.[0]?.[0]?.mc?.cs)) {
                    draftCtx.luckysheet_select_save = [
                        {
                            row: [0, data[0][0].mc.rs - 1],
                            column: [0, data[0][0].mc.cs - 1],
                        },
                    ];
                }
                else {
                    draftCtx.luckysheet_select_save = [
                        {
                            row: [0, 0],
                            column: [0, 0],
                        },
                    ];
                }
            }
            draftCtx.config = _.isNil(sheet.config) ? {} : sheet.config;
            draftCtx.insertedImgs = sheet.images;
            draftCtx.currency = mergedSettings.currency || "¥";
            draftCtx.zoomRatio = _.isNil(sheet.zoomRatio) ? 1 : sheet.zoomRatio;
            draftCtx.rowHeaderWidth =
                mergedSettings.rowHeaderWidth * draftCtx.zoomRatio;
            draftCtx.columnHeaderHeight =
                mergedSettings.columnHeaderHeight * draftCtx.zoomRatio;
            if (!_.isNil(sheet.defaultRowHeight)) {
                draftCtx.defaultrowlen = Number(sheet.defaultRowHeight);
            }
            else {
                draftCtx.defaultrowlen = mergedSettings.defaultRowHeight;
            }
            if (!_.isNil(sheet.addRows)) {
                draftCtx.addDefaultRows = Number(sheet.addRows);
            }
            else {
                draftCtx.addDefaultRows = mergedSettings.addRows;
            }
            if (!_.isNil(sheet.defaultColWidth)) {
                draftCtx.defaultcollen = Number(sheet.defaultColWidth);
            }
            else {
                draftCtx.defaultcollen = mergedSettings.defaultColWidth;
            }
            if (!_.isNil(sheet.showGridLines)) {
                const { showGridLines } = sheet;
                if (showGridLines === 0 || showGridLines === false) {
                    draftCtx.showGridLines = false;
                }
                else {
                    draftCtx.showGridLines = true;
                }
            }
            else {
                draftCtx.showGridLines = true;
            }
            if (_.isNil(mergedSettings.lang)) {
                const lang = (navigator.languages && navigator.languages[0]) || // 兼容chromium内核浏览器
                    navigator.language || // 兼容剩余浏览器
                    // @ts-ignore
                    navigator.userLanguage; // 兼容IE浏览器
                draftCtx.lang = lang;
            }
        }, { noHistory: true });
    }, [
        context.currentSheetId,
        context.luckysheetfile.length,
        originalData,
        mergedSettings.defaultRowHeight,
        mergedSettings.defaultColWidth,
        mergedSettings.column,
        mergedSettings.row,
        mergedSettings.defaultFontSize,
        mergedSettings.devicePixelRatio,
        mergedSettings.lang,
        mergedSettings.allowEdit,
        mergedSettings.hooks,
        mergedSettings.generateSheetId,
        setContextWithProduce,
        initSheetData,
        mergedSettings.rowHeaderWidth,
        mergedSettings.columnHeaderHeight,
        mergedSettings.addRows,
        mergedSettings.currency,
    ]);
    const onKeyDown = useCallback((e) => {
        const { nativeEvent } = e;
        // handling undo and redo ahead because handleUndo and handleRedo
        // themselves are calling setContext, and should not be nested
        // in setContextWithProduce.
        if ((e.ctrlKey || e.metaKey) && e.code === "KeyZ") {
            if (e.shiftKey) {
                handleRedo();
            }
            else {
                handleUndo();
            }
            e.stopPropagation();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.code === "KeyY") {
            handleRedo();
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        setContextWithProduce((draftCtx) => {
            handleGlobalKeyDown(draftCtx, cellInput.current, fxInput.current, nativeEvent, globalCache.current, handleUndo, // still passing handleUndo and handleRedo here to satisfy API
            handleRedo, canvas.current.getContext("2d"));
        });
    }, [handleRedo, handleUndo, setContextWithProduce]);
    const onPaste = useCallback((e) => {
        // deal with multi instance case, only the focused sheet handles the paste
        if (cellInput.current === document.activeElement ||
            document.activeElement?.className === "fortune-sheet-overlay") {
            let { clipboardData } = e;
            if (!clipboardData) {
                // @ts-ignore
                // for IE
                clipboardData = window.clipboardData;
            }
            const txtdata = clipboardData.getData("text/html") ||
                clipboardData.getData("text/plain");
            const ele = document.createElement("div");
            ele.innerHTML = txtdata;
            const trList = ele.querySelectorAll("table tr");
            const maxRow = trList.length + context.luckysheet_select_save[0].row[0];
            const rowToBeAdded = maxRow -
                context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].data.length;
            const range = context.luckysheet_select_save;
            if (rowToBeAdded > 0) {
                const insertRowColOp = {
                    type: "row",
                    index: context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].data.length - 1,
                    count: rowToBeAdded,
                    direction: "rightbottom",
                    id: context.currentSheetId,
                };
                setContextWithProduce((draftCtx) => {
                    insertRowCol(draftCtx, insertRowColOp);
                    draftCtx.luckysheet_select_save = range;
                }, {
                    insertRowColOp,
                });
            }
            setContextWithProduce((draftCtx) => {
                try {
                    handlePaste(draftCtx, e);
                }
                catch (err) {
                    console.error(err);
                }
            });
        }
    }, [context, setContextWithProduce]);
    const onMoreToolbarItemsClose = useCallback(() => {
        setMoreToolbarItems(null);
    }, []);
    useEffect(() => {
        document.addEventListener("paste", onPaste);
        return () => {
            document.removeEventListener("paste", onPaste);
        };
    }, [onPaste]);
    // expose APIs
    useImperativeHandle(ref, () => generateAPIs(context, setContextWithProduce, handleUndo, handleRedo, mergedSettings, cellInput.current, scrollbarX.current, scrollbarY.current), [context, setContextWithProduce, handleUndo, handleRedo, mergedSettings]);
    const i = getSheetIndex(context, context.currentSheetId);
    if (i == null) {
        return null;
    }
    const sheet = context.luckysheetfile?.[i];
    if (!sheet) {
        return null;
    }
    return (_jsx(WorkbookContext.Provider, { value: providerValue, children: _jsx(ModalProvider, { children: _jsxs("div", { className: "fortune-container", ref: workbookContainer, onKeyDown: onKeyDown, children: [_jsxs("section", { "aria-labelledby": "shortcuts-heading", id: "shortcut-list", className: "sr-only", tabIndex: 0, "aria-live": "polite", children: [_jsx("h2", { id: "shortcuts-heading", children: info.shortcuts }), _jsxs("ul", { children: [_jsx("li", { children: info.toggleSheetFocusShortcut }), _jsx("li", { children: info.selectRangeShortcut }), _jsx("li", { children: info.autoFillDownShortcut }), _jsx("li", { children: info.autoFillRightShortcut }), _jsx("li", { children: info.boldTextShortcut }), _jsx("li", { children: info.copyShortcut }), _jsx("li", { children: info.pasteShortcut }), _jsx("li", { children: info.undoShortcut }), _jsx("li", { children: info.redoShortcut }), _jsx("li", { children: info.deleteCellContentShortcut }), _jsx("li", { children: info.confirmCellEditShortcut }), _jsx("li", { children: info.moveRightShortcut }), _jsx("li", { children: info.moveLeftShortcut })] })] }), _jsx(SVGDefines, { currency: mergedSettings.currency }), _jsxs("div", { className: "fortune-workarea", children: [mergedSettings.showToolbar && (_jsx(Toolbar, { moreItemsOpen: moreToolbarItems !== null, setMoreItems: setMoreToolbarItems })), mergedSettings.showFormulaBar && _jsx(FxEditor, {})] }), _jsx(Sheet, { sheet: sheet }), mergedSettings.showSheetTabs && _jsx(SheetTab, {}), _jsx(ContextMenu, {}), _jsx(FilterMenu, {}), _jsx(SheetTabContextMenu, {}), context.showSheetList && _jsx(SheetList, {}), moreToolbarItems && (_jsx(MoreItemsContaier, { onClose: onMoreToolbarItemsClose, children: moreToolbarItems })), !_.isEmpty(context.contextMenu) && (_jsx("div", { onMouseDown: () => {
                            setContextWithProduce((draftCtx) => {
                                draftCtx.contextMenu = {};
                                draftCtx.filterContextMenu = undefined;
                                draftCtx.showSheetList = undefined;
                            });
                        }, onMouseMove: (e) => e.stopPropagation(), onMouseUp: (e) => e.stopPropagation(), onContextMenu: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }, className: "fortune-popover-backdrop" })), _jsx("div", { className: "fortune-stat-area", children: _jsxs("div", { className: "luckysheet-sheet-selection-calInfo", children: [!!calInfo.count && (_jsxs("div", { style: { width: "60px" }, children: [formula.count, ": ", calInfo.count] })), !!calInfo.numberC && !!calInfo.sum && (_jsxs("div", { children: [formula.sum, ": ", calInfo.sum] })), !!calInfo.numberC && !!calInfo.average && (_jsxs("div", { children: [formula.average, ": ", calInfo.average] })), !!calInfo.numberC && !!calInfo.max && (_jsxs("div", { children: [formula.max, ": ", calInfo.max] })), !!calInfo.numberC && !!calInfo.min && (_jsxs("div", { children: [formula.min, ": ", calInfo.min] }))] }) })] }) }) }));
});
export default Workbook;
