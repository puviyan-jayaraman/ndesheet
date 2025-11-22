import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { editSheetName, cancelNormalSelected, cancelActiveImgItem, locale, } from "@nde-sheet/core";
import _ from "lodash";
import { useContext, useState, useEffect, useRef, useCallback, } from "react";
import WorkbookContext from "../../context";
import { useAlert } from "../../hooks/useAlert";
import SVGIcon from "../SVGIcon";
const SheetItem = ({ sheet, isDropPlaceholder }) => {
    const { context, setContext, refs } = useContext(WorkbookContext);
    const [editing, setEditing] = useState(false);
    const containerRef = useRef(null);
    const editable = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [svgColor, setSvgColor] = useState("#c3c3c3");
    const { showAlert } = useAlert();
    const { info } = locale(context);
    useEffect(() => {
        setContext((draftCtx) => {
            const r = context.sheetScrollRecord[draftCtx?.currentSheetId];
            if (r) {
                draftCtx.scrollLeft = r.scrollLeft ?? 0;
                draftCtx.scrollTop = r.scrollTop ?? 0;
                draftCtx.luckysheet_select_status = r.luckysheet_select_status ?? false;
                draftCtx.luckysheet_select_save = r.luckysheet_select_save ?? undefined;
            }
            else {
                draftCtx.scrollLeft = 0;
                draftCtx.scrollTop = 0;
                draftCtx.luckysheet_select_status = false;
                draftCtx.luckysheet_select_save = undefined;
            }
            draftCtx.luckysheet_selection_range = [];
        });
    }, [context.currentSheetId, context.sheetScrollRecord, setContext]);
    useEffect(() => {
        if (!editable.current)
            return;
        if (editing) {
            // select all when enter editing mode
            if (window.getSelection) {
                const range = document.createRange();
                range.selectNodeContents(editable.current);
                if (range.startContainer &&
                    document.body.contains(range.startContainer)) {
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
                // @ts-ignore
            }
            else if (document.selection) {
                // @ts-ignore
                const range = document.body.createTextRange();
                range.moveToElementText(editable.current);
                range.select();
            }
        }
        // store the current text
        editable.current.dataset.oldText = editable.current.innerText;
    }, [editing]);
    const onBlur = useCallback(() => {
        setContext((draftCtx) => {
            try {
                editSheetName(draftCtx, editable.current);
            }
            catch (e) {
                showAlert(e.message);
            }
        });
        setEditing(false);
    }, [setContext, showAlert]);
    const onKeyDown = useCallback((e) => {
        if (e.key === "Enter") {
            editable.current?.blur();
        }
        e.stopPropagation();
    }, []);
    const onDragStart = useCallback((e) => {
        if (context.allowEdit === true)
            e.dataTransfer.setData("sheetId", `${sheet.id}`);
        e.stopPropagation();
    }, [context.allowEdit, sheet.id]);
    const onDrop = useCallback((e) => {
        if (context.allowEdit === false)
            return;
        const draggingId = e.dataTransfer.getData("sheetId");
        setContext((draftCtx) => {
            const droppingId = sheet.id;
            let draggingSheet;
            let droppingSheet;
            _.sortBy(draftCtx.luckysheetfile, ["order"]).forEach((f, i) => {
                f.order = i;
                if (f.id === draggingId) {
                    draggingSheet = f;
                }
                else if (f.id === droppingId) {
                    droppingSheet = f;
                }
            });
            if (draggingSheet && droppingSheet) {
                draggingSheet.order = droppingSheet.order - 0.1;
                // re-order all sheets
                _.sortBy(draftCtx.luckysheetfile, ["order"]).forEach((f, i) => {
                    f.order = i;
                });
            }
            else if (draggingSheet && isDropPlaceholder) {
                draggingSheet.order = draftCtx.luckysheetfile.length;
            }
        });
        setDragOver(false);
        e.stopPropagation();
    }, [context.allowEdit, isDropPlaceholder, setContext, sheet.id]);
    return (_jsxs("div", { role: "button", onDragOver: (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, onDragEnter: (e) => {
            setDragOver(true);
            e.stopPropagation();
        }, onDragLeave: (e) => {
            setDragOver(false);
            e.stopPropagation();
        }, onDragEnd: (e) => {
            setDragOver(false);
            e.stopPropagation();
        }, onDrop: onDrop, onDragStart: onDragStart, draggable: context.allowEdit && !editing, ref: containerRef, className: isDropPlaceholder
            ? "fortune-sheettab-placeholder"
            : `luckysheet-sheets-item${context.currentSheetId === sheet.id
                ? " luckysheet-sheets-item-active"
                : ""}`, onClick: () => {
            if (isDropPlaceholder)
                return;
            setContext((draftCtx) => {
                draftCtx.sheetScrollRecord[draftCtx.currentSheetId] = {
                    scrollLeft: draftCtx.scrollLeft,
                    scrollTop: draftCtx.scrollTop,
                    luckysheet_select_status: draftCtx.luckysheet_select_status,
                    luckysheet_select_save: draftCtx.luckysheet_select_save,
                    luckysheet_selection_range: draftCtx.luckysheet_selection_range,
                };
                draftCtx.dataVerificationDropDownList = false;
                draftCtx.currentSheetId = sheet.id;
                draftCtx.zoomRatio = sheet.zoomRatio || 1;
                cancelActiveImgItem(draftCtx, refs.globalCache);
                cancelNormalSelected(draftCtx);
            });
        }, tabIndex: 0, onContextMenu: (e) => {
            if (isDropPlaceholder)
                return;
            const rect = refs.workbookContainer.current.getBoundingClientRect();
            const { pageX, pageY } = e;
            setContext((ctx) => {
                // 右击的时候先进行跳转
                ctx.dataVerificationDropDownList = false;
                ctx.currentSheetId = sheet.id;
                ctx.zoomRatio = sheet.zoomRatio || 1;
                ctx.sheetTabContextMenu = {
                    x: pageX - rect.left - window.scrollX,
                    y: pageY - rect.top - window.scrollY,
                    sheet,
                    onRename: () => setEditing(true),
                };
            });
        }, style: {
            borderLeft: dragOver ? "2px solid #0188fb" : "",
            display: sheet.hide === 1 ? "none" : "",
        }, children: [_jsx("span", { className: "luckysheet-sheets-item-name", spellCheck: "false", suppressContentEditableWarning: true, contentEditable: isDropPlaceholder ? false : editing, onDoubleClick: () => setEditing(true), onBlur: onBlur, onKeyDown: onKeyDown, ref: editable, style: dragOver ? { pointerEvents: "none" } : {}, children: sheet.name }), _jsx("span", { className: "luckysheet-sheets-item-function", onMouseEnter: () => setSvgColor("#5c5c5c"), onMouseLeave: () => setSvgColor("#c3c3c3"), onClick: (e) => {
                    if (isDropPlaceholder || context.allowEdit === false)
                        return;
                    const rect = refs.workbookContainer.current.getBoundingClientRect();
                    const { pageX, pageY } = e;
                    setContext((ctx) => {
                        // 右击的时候先进行跳转
                        ctx.currentSheetId = sheet.id;
                        ctx.sheetTabContextMenu = {
                            x: pageX - rect.left - window.scrollX,
                            y: pageY - rect.top - window.scrollY,
                            sheet,
                            onRename: () => setEditing(true),
                        };
                    });
                }, tabIndex: 0, "aria-label": info.sheetOptions, children: _jsx(SVGIcon, { name: "downArrow", width: 12, style: { fill: svgColor } }) }), !!sheet.color && (_jsx("div", { className: "luckysheet-sheets-item-color", style: { background: sheet.color } }))] }, sheet.id));
};
export default SheetItem;
