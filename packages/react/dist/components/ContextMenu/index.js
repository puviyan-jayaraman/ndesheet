import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { locale, handleCopy, handlePasteByClick, deleteRowCol, insertRowCol, removeActiveImage, deleteSelectedCellText, sortSelection, createFilter, showImgChooser, handleLink, hideSelected, showSelected, getSheetIndex, api, isAllowEdit, jfrefreshgrid, } from "@nde-sheet/core";
import _ from "lodash";
import { useContext, useRef, useCallback, useLayoutEffect } from "react";
import regeneratorRuntime from "regenerator-runtime";
import WorkbookContext from "../../context";
import { useAlert } from "../../hooks/useAlert";
import { useDialog } from "../../hooks/useDialog";
import Divider from "./Divider";
import "./index.css";
import Menu from "./Menu";
import CustomSort from "../CustomSort";
const ContextMenu = () => {
    const { showDialog } = useDialog();
    const containerRef = useRef(null);
    const { context, setContext, settings, refs } = useContext(WorkbookContext);
    const { contextMenu } = context;
    const { showAlert } = useAlert();
    const { rightclick, drag, generalDialog, info } = locale(context);
    const getMenuElement = useCallback((name, i) => {
        const selection = context.luckysheet_select_save?.[0];
        if (name === "|") {
            return _jsx(Divider, {}, `divider-${i}`);
        }
        if (name === "copy") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        if (draftCtx.luckysheet_select_save?.length > 1) {
                            showAlert(rightclick.noMulti, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        handleCopy(draftCtx);
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.copy }, name));
        }
        if (name === "paste" && regeneratorRuntime) {
            return (_jsx(Menu, { onClick: async () => {
                    let clipboardText = "";
                    const sessionClipboardText = sessionStorage.getItem("localClipboard") || "";
                    try {
                        clipboardText = await navigator.clipboard.readText();
                    }
                    catch (err) {
                        console.warn("Clipboard access blocked. Attempting to use sessionStorage fallback.");
                    }
                    const finalText = clipboardText || sessionClipboardText;
                    setContext((draftCtx) => {
                        handlePasteByClick(draftCtx, finalText);
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.paste }, name));
        }
        if (name === "insert-column") {
            return selection?.row_select
                ? null
                : ["left", "right"].map((dir) => (_jsx(Menu, { onClick: (e) => {
                        const position = context.luckysheet_select_save?.[0]?.column?.[0];
                        if (position == null)
                            return;
                        const countStr = e.target.querySelector("input")?.value;
                        if (countStr == null)
                            return;
                        const count = parseInt(countStr, 10);
                        if (count < 1)
                            return;
                        const direction = dir === "left" ? "lefttop" : "rightbottom";
                        const insertRowColOp = {
                            type: "column",
                            index: position,
                            count,
                            direction,
                            id: context.currentSheetId,
                        };
                        setContext((draftCtx) => {
                            try {
                                insertRowCol(draftCtx, insertRowColOp);
                                draftCtx.contextMenu = {};
                            }
                            catch (err) {
                                if (err.message === "maxExceeded")
                                    showAlert(rightclick.columnOverLimit, "ok");
                                else if (err.message === "readOnly")
                                    showAlert(rightclick.cannotInsertOnColumnReadOnly, "ok");
                                draftCtx.contextMenu = {};
                            }
                        }, {
                            insertRowColOp,
                        });
                    }, children: _jsxs(_Fragment, { children: [_.startsWith(context.lang ?? "", "zh") && (_jsxs(_Fragment, { children: [rightclick.to, _jsx("span", { className: `luckysheet-cols-rows-shift-${dir}`, children: rightclick[dir] })] })), `${rightclick.insert}  `, _jsx("input", { onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), tabIndex: 0, type: "text", className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: "1" }), _jsx("span", { className: "luckysheet-cols-rows-shift-word luckysheet-mousedown-cancel", children: `${rightclick.column}  ` }), !_.startsWith(context.lang ?? "", "zh") && (_jsx("span", { className: `luckysheet-cols-rows-shift-${dir}`, children: rightclick[dir] }))] }) }, `add-col-${dir}`)));
        }
        if (name === "insert-row") {
            return selection?.column_select
                ? null
                : ["top", "bottom"].map((dir) => (_jsx(Menu, { onClick: (e, container) => {
                        const position = context.luckysheet_select_save?.[0]?.row?.[0];
                        if (position == null)
                            return;
                        const countStr = container.querySelector("input")?.value;
                        if (countStr == null)
                            return;
                        const count = parseInt(countStr, 10);
                        if (count < 1)
                            return;
                        const direction = dir === "top" ? "lefttop" : "rightbottom";
                        const insertRowColOp = {
                            type: "row",
                            index: position,
                            count,
                            direction,
                            id: context.currentSheetId,
                        };
                        setContext((draftCtx) => {
                            try {
                                insertRowCol(draftCtx, insertRowColOp);
                                draftCtx.contextMenu = {};
                            }
                            catch (err) {
                                if (err.message === "maxExceeded")
                                    showAlert(rightclick.rowOverLimit, "ok");
                                else if (err.message === "readOnly")
                                    showAlert(rightclick.cannotInsertOnRowReadOnly, "ok");
                                draftCtx.contextMenu = {};
                            }
                        }, { insertRowColOp });
                    }, children: _jsxs(_Fragment, { children: [_.startsWith(context.lang ?? "", "zh") && (_jsxs(_Fragment, { children: [rightclick.to, _jsx("span", { className: `luckysheet-cols-rows-shift-${dir}`, children: rightclick[dir] })] })), `${rightclick.insert}  `, _jsx("input", { onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), tabIndex: 0, type: "text", className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: "1" }), _jsx("span", { className: "luckysheet-cols-rows-shift-word luckysheet-mousedown-cancel", children: `${rightclick.row}  ` }), !_.startsWith(context.lang ?? "", "zh") && (_jsx("span", { className: `luckysheet-cols-rows-shift-${dir}`, children: rightclick[dir] }))] }) }, `add-row-${dir}`)));
        }
        if (name === "delete-column") {
            return (selection?.column_select && (_jsxs(Menu, { onClick: () => {
                    if (!selection)
                        return;
                    const [st_index, ed_index] = selection.column;
                    const deleteRowColOp = {
                        type: "column",
                        start: st_index,
                        end: ed_index,
                        id: context.currentSheetId,
                    };
                    setContext((draftCtx) => {
                        if (draftCtx.luckysheet_select_save?.length > 1) {
                            showAlert(rightclick.noMulti, "ok");
                            draftCtx.contextMenu = {};
                            draftCtx.dataVerificationDropDownList = false;
                            return;
                        }
                        const slen = ed_index - st_index + 1;
                        const index = getSheetIndex(draftCtx, context.currentSheetId);
                        if (draftCtx.luckysheetfile[index].data?.[0]?.length <= slen) {
                            showAlert(rightclick.cannotDeleteAllColumn, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        try {
                            deleteRowCol(draftCtx, deleteRowColOp);
                        }
                        catch (e) {
                            if (e.message === "readOnly") {
                                showAlert(rightclick.cannotDeleteColumnReadOnly, "ok");
                            }
                        }
                        draftCtx.contextMenu = {};
                    }, { deleteRowColOp });
                }, children: [rightclick.deleteSelected, rightclick.column] }, "delete-col")));
        }
        if (name === "delete-row") {
            return (selection?.row_select && (_jsxs(Menu, { onClick: () => {
                    if (!selection)
                        return;
                    const [st_index, ed_index] = selection.row;
                    const deleteRowColOp = {
                        type: "row",
                        start: st_index,
                        end: ed_index,
                        id: context.currentSheetId,
                    };
                    setContext((draftCtx) => {
                        if (draftCtx.luckysheet_select_save?.length > 1) {
                            showAlert(rightclick.noMulti, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        const slen = ed_index - st_index + 1;
                        const index = getSheetIndex(draftCtx, context.currentSheetId);
                        if (draftCtx.luckysheetfile[index].data?.length <= slen) {
                            showAlert(rightclick.cannotDeleteAllRow, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        try {
                            deleteRowCol(draftCtx, deleteRowColOp);
                        }
                        catch (e) {
                            if (e.message === "readOnly") {
                                showAlert(rightclick.cannotDeleteRowReadOnly, "ok");
                            }
                        }
                        draftCtx.contextMenu = {};
                    }, { deleteRowColOp });
                }, children: [rightclick.deleteSelected, rightclick.row] }, "delete-row")));
        }
        if (name === "hide-row") {
            return (selection?.row_select === true &&
                ["hideSelected", "showHide"].map((item) => (_jsx(Menu, { onClick: () => {
                        setContext((draftCtx) => {
                            let msg = "";
                            if (item === "hideSelected") {
                                msg = hideSelected(draftCtx, "row");
                            }
                            else if (item === "showHide") {
                                showSelected(draftCtx, "row");
                            }
                            if (msg === "noMulti") {
                                showDialog(drag.noMulti);
                            }
                            draftCtx.contextMenu = {};
                        });
                    }, children: rightclick[item] + rightclick.row }, item))));
        }
        if (name === "hide-column") {
            return (selection?.column_select === true &&
                ["hideSelected", "showHide"].map((item) => (_jsx(Menu, { onClick: () => {
                        setContext((draftCtx) => {
                            let msg = "";
                            if (item === "hideSelected") {
                                msg = hideSelected(draftCtx, "column");
                            }
                            else if (item === "showHide") {
                                showSelected(draftCtx, "column");
                            }
                            if (msg === "noMulti") {
                                showDialog(drag.noMulti);
                            }
                            draftCtx.contextMenu = {};
                        });
                    }, children: rightclick[item] + rightclick.column }, item))));
        }
        if (name === "set-row-height") {
            const rowHeight = selection?.height || context.defaultrowlen;
            const shownRowHeight = context.luckysheet_select_save?.some((section) => section.height_move !==
                (rowHeight + 1) * (section.row[1] - section.row[0] + 1) - 1)
                ? ""
                : rowHeight;
            return context.luckysheet_select_save?.some((section) => section.row_select) ? (_jsxs(Menu, { onClick: (e, container) => {
                    const targetRowHeight = container.querySelector("input")?.value;
                    setContext((draftCtx) => {
                        if (_.isUndefined(targetRowHeight) ||
                            targetRowHeight === "" ||
                            parseInt(targetRowHeight, 10) <= 0 ||
                            parseInt(targetRowHeight, 10) > 545) {
                            showAlert(info.tipRowHeightLimit, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        const numRowHeight = parseInt(targetRowHeight, 10);
                        const rowHeightList = {};
                        _.forEach(draftCtx.luckysheet_select_save, (section) => {
                            for (let rowNum = section.row[0]; rowNum <= section.row[1]; rowNum += 1) {
                                rowHeightList[rowNum] = numRowHeight;
                            }
                        });
                        api.setRowHeight(draftCtx, rowHeightList, {}, true);
                        draftCtx.contextMenu = {};
                    });
                }, children: [rightclick.row, rightclick.height, _jsx("input", { onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), tabIndex: 0, type: "number", min: 1, max: 545, className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: shownRowHeight, style: { width: "40px" } }), "px"] }, "set-row-height")) : null;
        }
        if (name === "set-column-width") {
            const colWidth = selection?.width || context.defaultcollen;
            const shownColWidth = context.luckysheet_select_save?.some((section) => section.width_move !==
                (colWidth + 1) * (section.column[1] - section.column[0] + 1) - 1)
                ? ""
                : colWidth;
            return context.luckysheet_select_save?.some((section) => section.column_select) ? (_jsxs(Menu, { onClick: (e, container) => {
                    const targetColWidth = container.querySelector("input")?.value;
                    setContext((draftCtx) => {
                        if (_.isUndefined(targetColWidth) ||
                            targetColWidth === "" ||
                            parseInt(targetColWidth, 10) <= 0 ||
                            parseInt(targetColWidth, 10) > 2038) {
                            showAlert(info.tipColumnWidthLimit, "ok");
                            draftCtx.contextMenu = {};
                            return;
                        }
                        const numColWidth = parseInt(targetColWidth, 10);
                        const colWidthList = {};
                        _.forEach(draftCtx.luckysheet_select_save, (section) => {
                            for (let colNum = section.column[0]; colNum <= section.column[1]; colNum += 1) {
                                colWidthList[colNum] = numColWidth;
                            }
                        });
                        api.setColumnWidth(draftCtx, colWidthList, {}, true);
                        draftCtx.contextMenu = {};
                    });
                }, children: [rightclick.column, rightclick.width, _jsx("input", { onClick: (e) => e.stopPropagation(), onKeyDown: (e) => e.stopPropagation(), tabIndex: 0, type: "number", min: 1, max: 545, className: "luckysheet-mousedown-cancel", placeholder: rightclick.number, defaultValue: shownColWidth, style: { width: "40px" } }), "px"] }, "set-column-width")) : null;
        }
        if (name === "clear") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        const allowEdit = isAllowEdit(draftCtx);
                        if (!allowEdit)
                            return;
                        if (draftCtx.activeImg != null) {
                            removeActiveImage(draftCtx);
                        }
                        else {
                            const msg = deleteSelectedCellText(draftCtx);
                            if (msg === "partMC") {
                                showDialog(generalDialog.partiallyError, "ok");
                            }
                            else if (msg === "allowEdit") {
                                showDialog(generalDialog.readOnlyError, "ok");
                            }
                            else if (msg === "dataNullError") {
                                showDialog(generalDialog.dataNullError, "ok");
                            }
                        }
                        draftCtx.contextMenu = {};
                        jfrefreshgrid(draftCtx, null, undefined);
                    });
                }, children: rightclick.clearContent }, name));
        }
        if (name === "orderAZ") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        sortSelection(draftCtx, true);
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.orderAZ }, name));
        }
        if (name === "orderZA") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        sortSelection(draftCtx, false);
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.orderZA }, name));
        }
        if (name === "sort") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        showDialog(_jsx(CustomSort, {}));
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.sortSelection }, name));
        }
        if (name === "filter") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        createFilter(draftCtx);
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.filterSelection }, name));
        }
        if (name === "image") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        showImgChooser();
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.image }, name));
        }
        if (name === "link") {
            return (_jsx(Menu, { onClick: () => {
                    setContext((draftCtx) => {
                        handleLink(draftCtx);
                        draftCtx.contextMenu = {};
                    });
                }, children: rightclick.link }, name));
        }
        return null;
    }, [
        context.currentSheetId,
        context.lang,
        context.luckysheet_select_save,
        context.defaultrowlen,
        context.defaultcollen,
        rightclick,
        info,
        setContext,
        showAlert,
        showDialog,
        drag,
        generalDialog,
    ]);
    useLayoutEffect(() => {
        // re-position the context menu if it overflows the window
        if (!containerRef.current) {
            return;
        }
        const winH = window.innerHeight;
        const winW = window.innerWidth;
        const rect = containerRef.current.getBoundingClientRect();
        const workbookRect = refs.workbookContainer.current?.getBoundingClientRect();
        if (!workbookRect) {
            return;
        }
        const menuW = rect.width;
        const menuH = rect.height;
        let top = contextMenu.y || 0;
        let left = contextMenu.x || 0;
        let hasOverflow = false;
        if (workbookRect.left + left + menuW > winW) {
            left -= menuW;
            hasOverflow = true;
        }
        if (workbookRect.top + top + menuH > winH) {
            top -= menuH;
            hasOverflow = true;
        }
        if (top < 0) {
            top = 0;
            hasOverflow = true;
        }
        if (hasOverflow) {
            setContext((draftCtx) => {
                draftCtx.contextMenu.x = left;
                draftCtx.contextMenu.y = top;
            });
        }
    }, [contextMenu.x, contextMenu.y, refs.workbookContainer, setContext]);
    if (_.isEmpty(context.contextMenu))
        return null;
    return (_jsx("div", { className: "fortune-context-menu luckysheet-cols-menu", ref: containerRef, onContextMenu: (e) => e.stopPropagation(), style: { left: contextMenu.x, top: contextMenu.y }, children: context.contextMenu.headerMenu === true
            ? settings.headerContextMenu.map((menu, i) => getMenuElement(menu, i))
            : settings.cellContextMenu.map((menu, i) => getMenuElement(menu, i)) }));
};
export default ContextMenu;
