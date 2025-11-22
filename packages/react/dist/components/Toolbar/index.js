import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useCallback, useRef, useEffect, useState, } from "react";
import { toolbarItemClickHandler, handleTextBackground, handleTextColor, handleTextSize, normalizedCellAttr, getFlowdata, newComment, editComment, deleteComment, showHideComment, showHideAllComments, autoSelectionFormula, handleSum, locale, handleMerge, handleBorder, toolbarItemSelectedFunc, handleFreeze, insertImage, showImgChooser, updateFormat, handleSort, handleHorizontalAlign, handleVerticalAlign, handleScreenShot, createFilter, clearFilter, applyLocation, } from "@nde-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import "./index.css";
import Button from "./Button";
import Divider, { MenuDivider } from "./Divider";
import Combo from "./Combo";
import Select, { Option } from "./Select";
import SVGIcon from "../SVGIcon";
import { useDialog } from "../../hooks/useDialog";
import { FormulaSearch } from "../FormulaSearch";
import { SplitColumn } from "../SplitColumn";
import { LocationCondition } from "../LocationCondition";
import DataVerification from "../DataVerification";
import ConditionalFormat from "../ConditionFormat";
import CustomButton from "./CustomButton";
import { CustomColor } from "./CustomColor";
import CustomBorder from "./CustomBorder";
import { FormatSearch } from "../FormatSearch";
const Toolbar = ({ setMoreItems, moreItemsOpen }) => {
    const { context, setContext, refs, settings, handleUndo, handleRedo } = useContext(WorkbookContext);
    const contextRef = useRef(context);
    const containerRef = useRef(null);
    const [toolbarWrapIndex, setToolbarWrapIndex] = useState(-1); // -1 means pending for item location calculation
    const [itemLocations, setItemLocations] = useState([]);
    const { showDialog, hideDialog } = useDialog();
    const firstSelection = context.luckysheet_select_save?.[0];
    const flowdata = getFlowdata(context);
    contextRef.current = context;
    const row = firstSelection?.row_focus;
    const col = firstSelection?.column_focus;
    const cell = flowdata && row != null && col != null ? flowdata?.[row]?.[col] : undefined;
    const { toolbar, merge, border, freezen, defaultFmt, formula, sort, align, textWrap, rotation, screenshot, filter, splitText, findAndReplace, comment, fontarray, } = locale(context);
    const toolbarFormat = locale(context).format;
    const sheetWidth = context.luckysheetTableContentHW[0];
    const { currency } = settings;
    const defaultFormat = defaultFmt(currency);
    const [customColor, setcustomColor] = useState("#000000");
    const [customStyle, setcustomStyle] = useState("1");
    const showSubMenu = useCallback((e, className) => {
        const target = e.target;
        const menuItem = target.className === "fortune-toolbar-menu-line"
            ? target.parentElement
            : target;
        const menuItemRect = menuItem.getBoundingClientRect();
        const workbookContainerRect = refs.workbookContainer.current.getBoundingClientRect();
        const subMenu = menuItem.querySelector(`.${className}`);
        if (_.isNil(subMenu))
            return;
        const menuItemStyle = window.getComputedStyle(menuItem);
        const menuItemPaddingRight = parseFloat(menuItemStyle.getPropertyValue("padding-right").replace("px", ""));
        if (workbookContainerRect.right - menuItemRect.right <
            parseFloat(subMenu.style.width.replace("px", ""))) {
            subMenu.style.display = "block";
            subMenu.style.right = `${menuItemRect.width - menuItemPaddingRight}px`;
        }
        else {
            subMenu.style.display = "block";
            subMenu.style.right =
                className === "more-format"
                    ? `${-(parseFloat(subMenu.style.width.replace("px", "")) + 0)}px`
                    : `${-(parseFloat(subMenu.style.width.replace("px", "")) +
                        menuItemPaddingRight)}px`;
        }
    }, [refs.workbookContainer]);
    const hideSubMenu = useCallback((e, className) => {
        const target = e.target;
        if (target.className === `${className}`) {
            target.style.display = "none";
            return;
        }
        const subMenu = (target.className === "condition-format-item"
            ? target.parentElement
            : target.querySelector(`.${className}`));
        if (_.isNil(subMenu))
            return;
        subMenu.style.display = "none";
    }, []);
    // rerenders the entire toolbar and trigger recalculation of item locations
    useEffect(() => {
        setToolbarWrapIndex(-1);
    }, [settings.toolbarItems, settings.customToolbarItems]);
    // recalculate item locations
    useEffect(() => {
        if (toolbarWrapIndex === -1) {
            const container = containerRef.current;
            if (!container)
                return;
            const items = container.querySelectorAll(".fortune-toolbar-item");
            if (!items)
                return;
            const locations = [];
            const containerRect = container.getBoundingClientRect();
            for (let i = 0; i < items.length; i += 1) {
                const item = items[i];
                const itemRect = item.getBoundingClientRect();
                locations.push(itemRect.left - containerRect.left + itemRect.width);
            }
            setItemLocations(locations);
        }
    }, [toolbarWrapIndex, sheetWidth]);
    // calculate the position after which items should be wrapped
    useEffect(() => {
        if (itemLocations.length === 0)
            return;
        const container = containerRef.current;
        if (!container)
            return;
        const moreButtonWidth = 50;
        for (let i = itemLocations.length - 1; i >= 0; i -= 1) {
            const loc = itemLocations[i];
            if (loc + moreButtonWidth < container.clientWidth) {
                setToolbarWrapIndex(i - itemLocations.length + settings.toolbarItems.length);
                if (i === itemLocations.length - 1) {
                    setMoreItems(null);
                }
                break;
            }
        }
    }, [itemLocations, setMoreItems, settings.toolbarItems.length, sheetWidth]);
    const getToolbarItem = useCallback((name, i) => {
        // @ts-ignore
        const tooltip = toolbar[name];
        if (name === "|") {
            return _jsx(Divider, {}, i);
        }
        if (["font-color", "background"].includes(name)) {
            const pick = (color) => {
                setContext((draftCtx) => (name === "font-color" ? handleTextColor : handleTextBackground)(draftCtx, refs.cellInput.current, color));
                if (name === "font-color") {
                    refs.globalCache.recentTextColor = color;
                }
                else {
                    refs.globalCache.recentBackgroundColor = color;
                }
            };
            return (_jsxs("div", { style: { position: "relative" }, children: [_jsx("div", { style: {
                            width: 17,
                            height: 2,
                            backgroundColor: name === "font-color"
                                ? refs.globalCache.recentTextColor
                                : refs.globalCache.recentBackgroundColor,
                            position: "absolute",
                            bottom: 8,
                            left: 9,
                            zIndex: 100,
                        } }), _jsx(Combo, { iconId: name, tooltip: tooltip, onClick: () => {
                            const color = name === "font-color"
                                ? refs.globalCache.recentTextColor
                                : refs.globalCache.recentBackgroundColor;
                            if (color)
                                pick(color);
                        }, children: (setOpen) => (_jsx(CustomColor, { onCustomPick: (color) => {
                                pick(color);
                                setOpen(false);
                            }, onColorPick: pick })) })] }, name));
        }
        if (name === "format") {
            let currentFmt = defaultFormat[0].text;
            if (cell) {
                const curr = normalizedCellAttr(cell, "ct");
                const format = _.find(defaultFormat, (v) => v.value === curr?.fa);
                if (curr?.fa != null) {
                    if (format != null) {
                        currentFmt = format.text;
                    }
                    else {
                        currentFmt = defaultFormat[defaultFormat.length - 1].text;
                    }
                }
            }
            return (_jsx(Combo, { text: currentFmt, tooltip: tooltip, children: (setOpen) => (_jsx(Select, { children: defaultFormat.map(({ text, value, example }, ii) => {
                        if (value === "split") {
                            return _jsx(MenuDivider, {}, ii);
                        }
                        if (value === "fmtOtherSelf") {
                            return (_jsxs(Option, { onMouseEnter: (e) => showSubMenu(e, "more-format"), onMouseLeave: (e) => hideSubMenu(e, "more-format"), children: [_jsxs("div", { className: "fortune-toolbar-menu-line", children: [_jsx("div", { children: text }), _jsx(SVGIcon, { name: "rightArrow", width: 14 })] }), _jsx("div", { className: "more-format toolbar-item-sub-menu fortune-toolbar-select", style: {
                                            display: "none",
                                            width: 150,
                                            bottom: 10,
                                            top: undefined,
                                        }, children: [
                                            {
                                                text: toolbarFormat.moreCurrency,
                                                onclick: () => {
                                                    showDialog(_jsx(FormatSearch, { onCancel: hideDialog, type: "currency" }));
                                                    setOpen(false);
                                                },
                                            },
                                            {
                                                text: toolbarFormat.moreNumber,
                                                onclick: () => {
                                                    showDialog(_jsx(FormatSearch, { onCancel: hideDialog, type: "number" }));
                                                    setOpen(false);
                                                },
                                            },
                                        ].map((v) => (_jsx("div", { className: "set-background-item fortune-toolbar-select-option", onClick: () => {
                                                v.onclick();
                                                setOpen(false);
                                            }, tabIndex: 0, children: v.text }, v.text))) })] }, value));
                        }
                        return (_jsx(Option, { onClick: () => {
                                setOpen(false);
                                setContext((ctx) => {
                                    const d = getFlowdata(ctx);
                                    if (d == null)
                                        return;
                                    updateFormat(ctx, refs.cellInput.current, d, "ct", value);
                                });
                            }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [_jsx("div", { children: text }), _jsx("div", { className: "fortune-toolbar-subtext", children: example })] }) }, value));
                    }) })) }, name));
        }
        if (name === "font") {
            let current = fontarray[0];
            if (cell?.ff != null) {
                if (_.isNumber(cell.ff)) {
                    current = fontarray[cell.ff];
                }
                else {
                    current = cell.ff;
                }
            }
            return (_jsx(Combo, { text: current, tooltip: tooltip, children: (setOpen) => (_jsx(Select, { children: fontarray.map((o) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                current = o;
                                const d = getFlowdata(ctx);
                                if (!d)
                                    return;
                                updateFormat(ctx, refs.cellInput.current, d, "ff", o);
                            });
                            setOpen(false);
                        }, children: o }, o))) })) }, name));
        }
        if (name === "font-size") {
            return (_jsx(Combo, { text: cell
                    ? normalizedCellAttr(cell, "fs", context.defaultFontSize)
                    : context.defaultFontSize.toString(), tooltip: tooltip, children: (setOpen) => (_jsx(Select, { children: [
                        9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
                    ].map((num) => (_jsx(Option, { onClick: () => {
                            setContext((draftContext) => handleTextSize(draftContext, refs.cellInput.current, num, refs.canvas.current.getContext("2d")));
                            setOpen(false);
                        }, children: num }, num))) })) }, name));
        }
        if (name === "horizontal-align") {
            const items = [
                {
                    title: "align-left",
                    text: align.left,
                    value: 1,
                },
                {
                    title: "align-center",
                    text: align.center,
                    value: 0,
                },
                {
                    title: "align-right",
                    text: align.right,
                    value: 2,
                },
            ];
            return (_jsx(Combo, { iconId: _.find(items, (item) => `${item.value}` === `${cell?.ht}`)
                    ?.title || "align-left", tooltip: toolbar.horizontalAlign, children: (setOpen) => (_jsx(Select, { children: items.map(({ text, title }) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                handleHorizontalAlign(ctx, refs.cellInput.current, title.replace("align-", ""));
                            });
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: title })] }) }, title))) })) }, name));
        }
        if (name === "vertical-align") {
            const items = [
                {
                    title: "align-top",
                    text: align.top,
                    value: 1,
                },
                {
                    title: "align-middle",
                    text: align.middle,
                    value: 0,
                },
                {
                    title: "align-bottom",
                    text: align.bottom,
                    value: 2,
                },
            ];
            return (_jsx(Combo, { iconId: _.find(items, (item) => `${item.value}` === `${cell?.vt}`)
                    ?.title || "align-top", tooltip: toolbar.verticalAlign, children: (setOpen) => (_jsx(Select, { children: items.map(({ text, title }) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                handleVerticalAlign(ctx, refs.cellInput.current, title.replace("align-", ""));
                            });
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: title })] }) }, title))) })) }, name));
        }
        if (name === "undo") {
            return (_jsx(Button, { iconId: name, tooltip: tooltip, disabled: refs.globalCache.undoList.length === 0, onClick: () => handleUndo() }, name));
        }
        if (name === "redo") {
            return (_jsx(Button, { iconId: name, tooltip: tooltip, disabled: refs.globalCache.redoList.length === 0, onClick: () => handleRedo() }, name));
        }
        if (name === "screenshot") {
            return (_jsx(Button, { iconId: name, tooltip: tooltip, onClick: () => {
                    const imgsrc = handleScreenShot(contextRef.current);
                    if (imgsrc) {
                        showDialog(_jsxs("div", { children: [_jsx("div", { children: screenshot.screenshotTipSuccess }), _jsx("img", { src: imgsrc, alt: "", style: { maxWidth: "100%", maxHeight: "100%" } })] }));
                    }
                } }, name));
        }
        if (name === "splitColumn") {
            return (_jsx(Button, { iconId: name, tooltip: tooltip, onClick: () => {
                    if (context.allowEdit === false)
                        return;
                    if (_.isUndefined(context.luckysheet_select_save)) {
                        showDialog(splitText.tipNoSelect, "ok");
                    }
                    else {
                        const currentColumn = context.luckysheet_select_save[context.luckysheet_select_save.length - 1].column;
                        if (context.luckysheet_select_save.length > 1) {
                            showDialog(splitText.tipNoMulti, "ok");
                        }
                        else if (currentColumn[0] !== currentColumn[1]) {
                            showDialog(splitText.tipNoMultiColumn, "ok");
                        }
                        else {
                            showDialog(_jsx(SplitColumn, {}));
                        }
                    }
                } }, name));
        }
        if (name === "dataVerification") {
            return (_jsx(Button, { iconId: name, tooltip: tooltip, onClick: () => {
                    if (context.allowEdit === false)
                        return;
                    showDialog(_jsx(DataVerification, {}));
                } }, name));
        }
        if (name === "locationCondition") {
            const items = [
                {
                    text: findAndReplace.location,
                    value: "location",
                },
                {
                    text: findAndReplace.locationFormula,
                    value: "locationFormula",
                },
                {
                    text: findAndReplace.locationDate,
                    value: "locationDate",
                },
                {
                    text: findAndReplace.locationDigital,
                    value: "locationDigital",
                },
                {
                    text: findAndReplace.locationString,
                    value: "locationString",
                },
                {
                    text: findAndReplace.locationError,
                    value: "locationError",
                },
                // TODO 条件格式
                // {
                //   text: findAndReplace.locationCondition,
                //   value: "locationCondition",
                // },
                {
                    text: findAndReplace.locationRowSpan,
                    value: "locationRowSpan",
                },
                {
                    text: findAndReplace.columnSpan,
                    value: "locationColumnSpan",
                },
            ];
            return (_jsx(Combo, { iconId: "locationCondition", tooltip: findAndReplace.location, children: (setOpen) => (_jsx(Select, { children: items.map(({ text, value }) => (_jsx(Option, { onClick: () => {
                            if (context.luckysheet_select_save == null) {
                                showDialog(freezen.noSeletionError, "ok");
                                return;
                            }
                            const last = context.luckysheet_select_save[0];
                            let range;
                            let rangeArr = [];
                            if (context.luckysheet_select_save?.length === 0 ||
                                (context.luckysheet_select_save?.length === 1 &&
                                    last.row[0] === last.row[1] &&
                                    last.column[0] === last.column[1])) {
                                // 当选中的是一个单元格，则变为全选
                                range = [
                                    {
                                        row: [0, flowdata.length - 1],
                                        column: [0, flowdata[0].length - 1],
                                    },
                                ];
                            }
                            else {
                                range = _.assignIn([], context.luckysheet_select_save);
                            }
                            if (value === "location") {
                                showDialog(_jsx(LocationCondition, {}));
                            }
                            else if (value === "locationFormula") {
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationFormula", "all", ctx);
                                });
                            }
                            else if (value === "locationDate") {
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationConstant", "d", ctx);
                                });
                            }
                            else if (value === "locationDigital") {
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationConstant", "n", ctx);
                                });
                            }
                            else if (value === "locationString") {
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationConstant", "s,g", ctx);
                                });
                            }
                            else if (value === "locationError") {
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationConstant", "e", ctx);
                                });
                            }
                            else if (value === "locationCondition") {
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationCF", undefined, ctx);
                                });
                            }
                            else if (value === "locationRowSpan") {
                                if (context.luckysheet_select_save?.length === 0 ||
                                    (context.luckysheet_select_save?.length === 1 &&
                                        context.luckysheet_select_save[0].row[0] ===
                                            context.luckysheet_select_save[0].row[1])) {
                                    showDialog(findAndReplace.locationTiplessTwoRow, "ok");
                                    return;
                                }
                                range = _.assignIn([], context.luckysheet_select_save);
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationRowSpan", undefined, ctx);
                                });
                            }
                            else if (value === "locationColumnSpan") {
                                if (context.luckysheet_select_save?.length === 0 ||
                                    (context.luckysheet_select_save?.length === 1 &&
                                        context.luckysheet_select_save[0].column[0] ===
                                            context.luckysheet_select_save[0].column[1])) {
                                    showDialog(findAndReplace.locationTiplessTwoColumn, "ok");
                                    return;
                                }
                                range = _.assignIn([], context.luckysheet_select_save);
                                setContext((ctx) => {
                                    rangeArr = applyLocation(range, "locationColumnSpan", undefined, ctx);
                                });
                            }
                            if (rangeArr.length === 0 && value !== "location")
                                showDialog(findAndReplace.locationTipNotFindCell, "ok");
                            setOpen(false);
                        }, children: _jsx("div", { className: "fortune-toolbar-menu-line", children: text }) }, value))) })) }, name));
        }
        if (name === "conditionFormat") {
            const items = [
                "highlightCellRules",
                "itemSelectionRules",
                // "dataBar",
                // "colorGradation",
                // "icons",
                "-",
                // "newFormatRule",
                "deleteRule",
                // "manageRules",
            ];
            return (_jsx(Combo, { iconId: "conditionFormat", tooltip: toolbar.conditionalFormat, children: (setOpen) => _jsx(ConditionalFormat, { items: items, setOpen: setOpen }) }, name));
        }
        if (name === "image") {
            return (_jsx(Button, { iconId: name, tooltip: toolbar.insertImage, onClick: () => {
                    if (context.allowEdit === false)
                        return;
                    showImgChooser();
                }, children: _jsx("input", { id: "fortune-img-upload", type: "file", accept: "image/*", style: { display: "none" }, onChange: (e) => {
                        const file = e.currentTarget.files?.[0];
                        if (!file)
                            return;
                        const render = new FileReader();
                        render.readAsDataURL(file);
                        render.onload = (event) => {
                            if (event.target == null)
                                return;
                            const src = event.target?.result;
                            const image = new Image();
                            image.onload = () => {
                                setContext((draftCtx) => {
                                    insertImage(draftCtx, image);
                                });
                            };
                            image.src = src;
                        };
                        e.currentTarget.value = "";
                    } }) }, name));
        }
        if (name === "comment") {
            const last = context.luckysheet_select_save?.[context.luckysheet_select_save.length - 1];
            let row_index = last?.row_focus;
            let col_index = last?.column_focus;
            if (!last) {
                row_index = 0;
                col_index = 0;
            }
            else {
                if (row_index == null) {
                    [row_index] = last.row;
                }
                if (col_index == null) {
                    [col_index] = last.column;
                }
            }
            let itemData;
            if (flowdata?.[row_index]?.[col_index]?.ps != null) {
                itemData = [
                    { key: "edit", text: comment.edit, onClick: editComment },
                    { key: "delete", text: comment.delete, onClick: deleteComment },
                    {
                        key: "showOrHide",
                        text: comment.showOne,
                        onClick: showHideComment,
                    },
                    {
                        key: "showOrHideAll",
                        text: comment.showAll,
                        onClick: showHideAllComments,
                    },
                ];
            }
            else {
                itemData = [
                    { key: "new", text: comment.insert, onClick: newComment },
                    {
                        key: "showOrHideAll",
                        text: comment.showAll,
                        onClick: showHideAllComments,
                    },
                ];
            }
            return (_jsx(Combo, { iconId: name, tooltip: tooltip, children: (setOpen) => (_jsx(Select, { children: itemData.map(({ key, text, onClick }) => (_jsx(Option, { onClick: () => {
                            setContext((draftContext) => onClick(draftContext, refs.globalCache, row_index, col_index));
                            setOpen(false);
                        }, children: text }, key))) })) }, name));
        }
        if (name === "quick-formula") {
            const itemData = [
                { text: formula.sum, value: "SUM" },
                { text: formula.average, value: "AVERAGE" },
                { text: formula.count, value: "COUNT" },
                { text: formula.max, value: "MAX" },
                { text: formula.min, value: "MIN" },
            ];
            return (_jsx(Combo, { iconId: "formula-sum", tooltip: toolbar.autoSum, onClick: () => setContext((ctx) => {
                    handleSum(ctx, refs.cellInput.current, refs.fxInput.current, refs.globalCache);
                }), children: (setOpen) => (_jsxs(Select, { children: [itemData.map(({ value, text }) => (_jsx(Option, { onClick: () => {
                                setContext((ctx) => {
                                    autoSelectionFormula(ctx, refs.cellInput.current, refs.fxInput.current, value, refs.globalCache);
                                });
                                setOpen(false);
                            }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [_jsx("div", { children: text }), _jsx("div", { className: "fortune-toolbar-subtext", children: value })] }) }, value))), _jsx(MenuDivider, {}), _jsx(Option, { onClick: () => {
                                showDialog(_jsx(FormulaSearch, { onCancel: hideDialog }));
                                setOpen(false);
                            }, children: `${formula.find}...` }, "formula")] })) }, name));
        }
        if (name === "merge-cell") {
            const itemdata = [
                { text: merge.mergeAll, value: "merge-all" },
                { text: merge.mergeV, value: "merge-vertical" },
                { text: merge.mergeH, value: "merge-horizontal" },
                { text: merge.mergeCancel, value: "merge-cancel" },
            ];
            return (_jsx(Combo, { iconId: "merge-all", tooltip: tooltip, text: "\u5408\u5E76\u5355\u5143\u683C", onClick: () => setContext((ctx) => {
                    handleMerge(ctx, "merge-all");
                }), children: (setOpen) => (_jsx(Select, { children: itemdata.map(({ text, value }) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                handleMerge(ctx, value);
                            });
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [_jsx(SVGIcon, { name: value, style: { marginRight: 4 } }), text] }) }, value))) })) }, name));
        }
        if (name === "border") {
            const items = [
                {
                    text: border.borderTop,
                    value: "border-top",
                },
                {
                    text: border.borderBottom,
                    value: "border-bottom",
                },
                {
                    text: border.borderLeft,
                    value: "border-left",
                },
                {
                    text: border.borderRight,
                    value: "border-right",
                },
                { text: "", value: "divider" },
                {
                    text: border.borderNone,
                    value: "border-none",
                },
                {
                    text: border.borderAll,
                    value: "border-all",
                },
                {
                    text: border.borderOutside,
                    value: "border-outside",
                },
                { text: "", value: "divider" },
                {
                    text: border.borderInside,
                    value: "border-inside",
                },
                {
                    text: border.borderHorizontal,
                    value: "border-horizontal",
                },
                {
                    text: border.borderVertical,
                    value: "border-vertical",
                },
                {
                    text: border.borderSlash,
                    value: "border-slash",
                },
                { text: "", value: "divider" },
            ];
            return (_jsx(Combo, { iconId: "border-all", tooltip: tooltip, text: "\u8FB9\u6846\u8BBE\u7F6E", onClick: () => setContext((ctx) => {
                    handleBorder(ctx, "border-all", customColor, customStyle);
                }), children: (setOpen) => (_jsxs(Select, { children: [items.map(({ text, value }, ii) => value !== "divider" ? (_jsx(Option, { onClick: () => {
                                setContext((ctx) => {
                                    handleBorder(ctx, value, customColor, customStyle);
                                });
                                setOpen(false);
                            }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: value })] }) }, value)) : (_jsx(MenuDivider, {}, ii))), _jsx(CustomBorder, { onPick: (color, style) => {
                                setcustomColor(color);
                                setcustomStyle(style);
                            } })] })) }, name));
        }
        if (name === "freeze") {
            const items = [
                {
                    text: freezen.freezenRowRange,
                    value: "freeze-row",
                },
                {
                    text: freezen.freezenColumnRange,
                    value: "freeze-col",
                },
                {
                    text: freezen.freezenRCRange,
                    value: "freeze-row-col",
                },
                {
                    text: freezen.freezenCancel,
                    value: "freeze-cancel",
                },
            ];
            return (_jsx(Combo, { iconId: "freeze-row-col", tooltip: tooltip, onClick: () => setContext((ctx) => {
                    handleFreeze(ctx, "freeze-row-col");
                }), children: (setOpen) => (_jsx(Select, { children: items.map(({ text, value }) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                handleFreeze(ctx, value);
                            });
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: value })] }) }, value))) })) }, name));
        }
        if (name === "text-wrap") {
            const items = [
                {
                    text: textWrap.clip,
                    iconId: "text-clip",
                    value: "clip",
                },
                {
                    text: textWrap.overflow,
                    iconId: "text-overflow",
                    value: "overflow",
                },
                {
                    text: textWrap.wrap,
                    iconId: "text-wrap",
                    value: "wrap",
                },
            ];
            let curr = items[0];
            if (cell?.tb != null) {
                curr = _.get(items, cell.tb);
            }
            return (_jsx(Combo, { iconId: curr.iconId, tooltip: toolbar.textWrap, children: (setOpen) => (_jsx(Select, { children: items.map(({ text, iconId, value }) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                const d = getFlowdata(ctx);
                                if (d == null)
                                    return;
                                updateFormat(ctx, refs.cellInput.current, d, "tb", value);
                            });
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: iconId })] }) }, value))) })) }, name));
        }
        if (name === "text-rotation") {
            const items = [
                { text: rotation.none, iconId: "text-rotation-none", value: "none" },
                {
                    text: rotation.angleup,
                    iconId: "text-rotation-angleup",
                    value: "angleup",
                },
                {
                    text: rotation.angledown,
                    iconId: "text-rotation-angledown",
                    value: "angledown",
                },
                {
                    text: rotation.vertical,
                    iconId: "text-rotation-vertical",
                    value: "vertical",
                },
                {
                    text: rotation.rotationUp,
                    iconId: "text-rotation-up",
                    value: "rotation-up",
                },
                {
                    text: rotation.rotationDown,
                    iconId: "text-rotation-down",
                    value: "rotation-down",
                },
            ];
            let curr = items[0];
            if (cell?.tr != null) {
                curr = _.get(items, cell.tr);
            }
            return (_jsx(Combo, { iconId: curr.iconId, tooltip: toolbar.textRotate, children: (setOpen) => (_jsx(Select, { children: items.map(({ text, iconId, value }) => (_jsx(Option, { onClick: () => {
                            setContext((ctx) => {
                                const d = getFlowdata(ctx);
                                if (d == null)
                                    return;
                                updateFormat(ctx, refs.cellInput.current, d, "tr", value);
                            });
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: iconId })] }) }, value))) })) }, name));
        }
        if (name === "filter") {
            const items = [
                {
                    iconId: "sort-asc",
                    value: "sort-asc",
                    text: sort.asc,
                    onClick: () => {
                        setContext((ctx) => {
                            handleSort(ctx, true);
                        });
                    },
                },
                {
                    iconId: "sort-desc",
                    value: "sort-desc",
                    text: sort.desc,
                    onClick: () => {
                        setContext((ctx) => {
                            handleSort(ctx, false);
                        });
                    },
                },
                // { iconId: "sort", value: "sort", text: sort.custom },
                { iconId: "", value: "divider" },
                {
                    iconId: "filter1",
                    value: "filter",
                    text: filter.filter,
                    onClick: () => setContext((draftCtx) => {
                        createFilter(draftCtx);
                    }),
                },
                {
                    iconId: "eraser",
                    value: "eraser",
                    text: filter.clearFilter,
                    onClick: () => setContext((draftCtx) => {
                        clearFilter(draftCtx);
                    }),
                },
            ];
            return (_jsx(Combo, { iconId: "filter", tooltip: toolbar.sortAndFilter, children: (setOpen) => (_jsx(Select, { children: items.map(({ text, iconId, value, onClick }, index) => value !== "divider" ? (_jsx(Option, { onClick: () => {
                            onClick?.();
                            setOpen(false);
                        }, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [text, _jsx(SVGIcon, { name: iconId })] }) }, value)) : (_jsx(MenuDivider, {}, `divider-${index}`))) })) }, name));
        }
        return (_jsx(Button, { iconId: name, tooltip: tooltip, selected: toolbarItemSelectedFunc(name)?.(cell), onClick: () => setContext((draftCtx) => {
                toolbarItemClickHandler(name)?.(draftCtx, refs.cellInput.current, refs.globalCache);
            }) }, name));
    }, [
        toolbar,
        cell,
        setContext,
        refs.cellInput,
        refs.fxInput,
        refs.globalCache,
        defaultFormat,
        align,
        handleUndo,
        handleRedo,
        flowdata,
        formula,
        showDialog,
        hideDialog,
        merge,
        border,
        freezen,
        screenshot,
        sort,
        textWrap,
        rotation,
        filter,
        splitText,
        findAndReplace,
        context.luckysheet_select_save,
        context.defaultFontSize,
        context.allowEdit,
        comment,
        fontarray,
        hideSubMenu,
        showSubMenu,
        refs.canvas,
        customColor,
        customStyle,
        toolbarFormat.moreCurrency,
        toolbarFormat.moreNumber,
    ]);
    return (_jsx("header", { children: _jsxs("div", { ref: containerRef, className: "fortune-toolbar", role: "toolbar", "aria-label": toolbar.toolbar, children: [settings.customToolbarItems.map((n) => {
                    return (_jsx(CustomButton, { tooltip: n.tooltip, onClick: n.onClick, icon: n.icon, iconName: n.iconName, children: n.children }, n.key));
                }), settings.customToolbarItems?.length > 0 ? (_jsx(Divider, {}, "customDivider")) : null, (toolbarWrapIndex === -1
                    ? settings.toolbarItems
                    : settings.toolbarItems.slice(0, toolbarWrapIndex + 1)).map((name, i) => getToolbarItem(name, i)), toolbarWrapIndex !== -1 &&
                    toolbarWrapIndex < settings.toolbarItems.length - 1 ? (_jsx(Button, { iconId: "more", tooltip: toolbar.toolMore, onClick: () => {
                        if (moreItemsOpen) {
                            setMoreItems(null);
                        }
                        else {
                            setMoreItems(settings.toolbarItems
                                .slice(toolbarWrapIndex + 1)
                                .map((name, i) => getToolbarItem(name, i)));
                        }
                    } })) : null] }) }));
};
export default Toolbar;
