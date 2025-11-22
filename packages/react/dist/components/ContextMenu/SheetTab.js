import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { locale, deleteSheet, api } from "@nde-sheet/core";
import _ from "lodash";
import React, { useContext, useRef, useState, useLayoutEffect, useCallback, } from "react";
import WorkbookContext from "../../context";
import { useAlert } from "../../hooks/useAlert";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ChangeColor } from "../ChangeColor";
import SVGIcon from "../SVGIcon";
import Divider from "./Divider";
import "./index.css";
import Menu from "./Menu";
const SheetTabContextMenu = () => {
    const { context, setContext, settings } = useContext(WorkbookContext);
    const { x, y, sheet, onRename } = context.sheetTabContextMenu;
    const { sheetconfig } = locale(context);
    const [position, setPosition] = useState({ x: -1, y: -1 });
    const [isShowChangeColor, setIsShowChangeColor] = useState(false);
    const [isShowInputColor, setIsShowInputColor] = useState(false);
    const { showAlert, hideAlert } = useAlert();
    const containerRef = useRef(null);
    const close = useCallback(() => {
        setContext((ctx) => {
            ctx.sheetTabContextMenu = {};
        });
    }, [setContext]);
    useLayoutEffect(() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect && x != null && y != null) {
            setPosition({ x, y: y - rect.height });
        }
    }, [x, y]);
    useOutsideClick(containerRef, close, [close]);
    const moveSheet = useCallback((delta) => {
        if (context.allowEdit === false)
            return;
        if (!sheet)
            return;
        setContext((ctx) => {
            let currentOrder = -1;
            _.sortBy(ctx.luckysheetfile, ["order"]).forEach((_sheet, i) => {
                _sheet.order = i;
                if (_sheet.id === sheet.id) {
                    currentOrder = i;
                }
            });
            api.setSheetOrder(ctx, { [sheet.id]: currentOrder + delta });
        });
    }, [context.allowEdit, setContext, sheet]);
    const hideSheet = useCallback(() => {
        if (context.allowEdit === false)
            return;
        if (!sheet)
            return;
        setContext((ctx) => {
            const shownSheets = ctx.luckysheetfile.filter((oneSheet) => _.isUndefined(oneSheet.hide) || oneSheet?.hide !== 1);
            if (shownSheets.length > 1) {
                api.hideSheet(ctx, sheet.id);
            }
            else {
                showAlert(sheetconfig.noMoreSheet, "ok");
            }
        });
    }, [context.allowEdit, setContext, sheet, showAlert, sheetconfig]);
    const copySheet = useCallback(() => {
        if (context.allowEdit === false)
            return;
        if (!sheet?.id)
            return;
        setContext((ctx) => {
            api.copySheet(ctx, sheet.id);
        }, { addSheetOp: true });
    }, [context.allowEdit, setContext, sheet?.id]);
    const updateShowInputColor = useCallback((state) => {
        setIsShowInputColor(state);
    }, []);
    const focusSheet = useCallback(() => {
        if (context.allowEdit === false)
            return;
        if (!sheet?.id)
            return;
        setContext((ctx) => {
            _.forEach(ctx.luckysheetfile, (sheetfile) => {
                sheetfile.status = sheet.id === sheetfile.id ? 1 : 0;
            });
        });
    }, [context.allowEdit, setContext, sheet?.id]);
    if (!sheet || x == null || y == null)
        return null;
    return (_jsx("div", { className: "fortune-context-menu luckysheet-cols-menu", onContextMenu: (e) => e.stopPropagation(), style: { left: position.x, top: position.y, overflow: "visible" }, ref: containerRef, children: settings.sheetTabContextMenu?.map((name, i) => {
            if (name === "delete") {
                return (_jsx(Menu, { onClick: () => {
                        const shownSheets = context.luckysheetfile.filter((singleSheet) => _.isUndefined(singleSheet.hide) || singleSheet.hide !== 1);
                        if (context.luckysheetfile.length > 1 &&
                            shownSheets.length > 1) {
                            showAlert(sheetconfig.confirmDelete, "yesno", () => {
                                setContext((ctx) => {
                                    deleteSheet(ctx, sheet.id);
                                }, {
                                    deleteSheetOp: {
                                        id: sheet.id,
                                    },
                                });
                                hideAlert();
                            });
                        }
                        else {
                            showAlert(sheetconfig.noMoreSheet, "ok");
                        }
                        close();
                    }, children: sheetconfig.delete }, name));
            }
            if (name === "rename") {
                return (_jsx(Menu, { onClick: () => {
                        onRename?.();
                        close();
                    }, children: sheetconfig.rename }, name));
            }
            if (name === "move") {
                return (_jsxs(React.Fragment, { children: [_jsx(Menu, { onClick: () => {
                                moveSheet(-1.5);
                                close();
                            }, children: sheetconfig.moveLeft }), _jsx(Menu, { onClick: () => {
                                moveSheet(1.5);
                                close();
                            }, children: sheetconfig.moveRight })] }, name));
            }
            if (name === "hide") {
                return (_jsx(Menu, { onClick: () => {
                        hideSheet();
                        close();
                    }, children: sheetconfig.hide }, name));
            }
            if (name === "copy") {
                return (_jsx(Menu, { onClick: () => {
                        copySheet();
                        close();
                    }, children: sheetconfig.copy }, name));
            }
            if (name === "color") {
                return (_jsxs(Menu, { onMouseEnter: () => {
                        setIsShowChangeColor(true);
                    }, onMouseLeave: () => {
                        if (!isShowInputColor) {
                            setIsShowChangeColor(false);
                        }
                    }, children: [sheetconfig.changeColor, _jsx("span", { className: "change-color-triangle", children: _jsx(SVGIcon, { name: "rightArrow", width: 18 }) }), isShowChangeColor && context.allowEdit && (_jsx(ChangeColor, { triggerParentUpdate: updateShowInputColor }))] }, name));
            }
            if (name === "focus") {
                return (_jsx(Menu, { onClick: () => {
                        focusSheet();
                        close();
                    }, children: sheetconfig.focus }, name));
            }
            if (name === "|") {
                return _jsx(Divider, {}, `divide-${i}`);
            }
            return null;
        }) }));
};
export default SheetTabContextMenu;
