import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { clearFilter, locale, getFilterColumnValues, getFilterColumnColors, orderbydatafiler, saveFilter, } from "@nde-sheet/core";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, } from "react";
import _ from "lodash";
import produce from "immer";
import WorkbookContext from "../../context";
import Divider from "./Divider";
import Menu from "./Menu";
import SVGIcon from "../SVGIcon";
import { useAlert } from "../../hooks/useAlert";
import { useOutsideClick } from "../../hooks/useOutsideClick";
const SelectItem = ({ item, isChecked, onChange, isItemVisible }) => {
    const checked = useMemo(() => isChecked(item.key), [isChecked, item.key]);
    return isItemVisible(item) ? (_jsxs("div", { className: "select-item", children: [_jsx("input", { className: "filter-checkbox", type: "checkbox", checked: checked, onChange: () => {
                    onChange(item, !checked);
                } }), _jsx("div", { children: item.text }), _jsx("span", { className: "count", children: `( ${item.rows.length} )` })] })) : null;
};
const DateSelectTreeItem = ({ item, depth = 0, initialExpand, onExpand, isChecked, onChange, isItemVisible, }) => {
    const [expand, setExpand] = useState(initialExpand(item.key));
    const checked = useMemo(() => isChecked(item.key), [isChecked, item.key]);
    return isItemVisible(item) ? (_jsxs("div", { children: [_jsxs("div", { className: "select-item", style: { marginLeft: -2 + depth * 20 }, onClick: () => {
                    onExpand?.(item.key, !expand);
                    setExpand(!expand);
                }, tabIndex: 0, children: [_.isEmpty(item.children) ? (_jsx("div", { style: { width: 10 } })) : (_jsx("div", { className: `filter-caret ${expand ? "down" : "right"}`, style: { cursor: "pointer" } })), _jsx("input", { className: "filter-checkbox", type: "checkbox", checked: checked, onChange: () => {
                            onChange(item, !checked);
                        }, onClick: (e) => e.stopPropagation(), tabIndex: 0 }), _jsx("div", { children: item.text }), _jsx("span", { className: "count", children: `( ${item.rows.length} )` })] }), expand &&
                item.children.map((v) => (_jsx(DateSelectTreeItem, { item: v, depth: depth + 1, initialExpand, onExpand, isChecked, onChange, isItemVisible }, v.key)))] })) : null;
};
const DateSelectTree = ({ dates, initialExpand, onExpand, isChecked, onChange, isItemVisible }) => {
    return (_jsx(_Fragment, { children: dates.map((v) => (_jsx(DateSelectTreeItem, { item: v, initialExpand, onExpand, isChecked, onChange, isItemVisible }, v.key))) }));
};
const FilterMenu = () => {
    const { context, setContext, settings, refs } = useContext(WorkbookContext);
    const containerRef = useRef(null);
    const contextRef = useRef(context);
    const byColorMenuRef = useRef(null);
    const subMenuRef = useRef(null);
    const { filterContextMenu } = context;
    const { startRow, startCol, endRow, endCol, col, listBoxMaxHeight } = filterContextMenu || {
        startRow: null,
        startCol: null,
        endRow: null,
        endCol: null,
        col: null,
        listBoxMaxHeight: 400,
    };
    const { filter } = locale(context);
    const [data, setData] = useState({
        dates: [],
        dateRowMap: {},
        values: [],
        valueRowMap: {},
        visibleRows: [],
        flattenValues: [],
    });
    const [datesUncheck, setDatesUncheck] = useState([]);
    const [valuesUncheck, setValuesUncheck] = useState([]);
    const dateTreeExpandState = useRef({});
    const hiddenRows = useRef([]);
    const [showValues, setShowValues] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [subMenuPos, setSubMenuPos] = useState();
    const [filterColors, setFilterColors] = useState({ bgColors: [], fcColors: [] });
    const [showSubMenu, setShowSubMenu] = useState(false);
    const { showAlert } = useAlert();
    const mouseHoverSubMenu = useRef(false);
    contextRef.current = context;
    // 点击其他区域的时候关闭FilterMenu
    const close = useCallback(() => {
        setContext((ctx) => {
            ctx.filterContextMenu = undefined;
        });
    }, [setContext]);
    useOutsideClick(containerRef, close, [close]);
    const initialExpand = useCallback((key) => {
        const expand = dateTreeExpandState.current[key];
        if (expand == null) {
            dateTreeExpandState.current[key] = true;
            return true;
        }
        return expand;
    }, []);
    const onExpand = useCallback((key, expand) => {
        dateTreeExpandState.current[key] = expand;
    }, []);
    const searchValues = useMemo(() => _.debounce((text) => {
        setShowValues(_.filter(data.flattenValues, (v) => v.toLowerCase().indexOf(text.toLowerCase()) > -1));
    }, 300), [data.flattenValues]);
    const selectAll = useCallback(() => {
        setDatesUncheck([]);
        setValuesUncheck([]);
        hiddenRows.current = [];
    }, []);
    const clearAll = useCallback(() => {
        setDatesUncheck(_.keys(data.dateRowMap));
        setValuesUncheck(_.keys(data.valueRowMap));
        hiddenRows.current = data.visibleRows;
    }, [data.dateRowMap, data.valueRowMap, data.visibleRows]);
    const inverseSelect = useCallback(() => {
        setDatesUncheck(produce((draft) => _.xor(draft, _.keys(data.dateRowMap))));
        setValuesUncheck(produce((draft) => _.xor(draft, _.keys(data.valueRowMap))));
        hiddenRows.current = _.xor(hiddenRows.current, data.visibleRows);
    }, [data.dateRowMap, data.valueRowMap, data.visibleRows]);
    const onColorSelectChange = useCallback((key, color, checked) => {
        setFilterColors(produce((draft) => {
            const colorData = _.find(_.get(draft, key), (v) => v.color === color);
            colorData.checked = checked;
        }));
    }, []);
    const delayHideSubMenu = useMemo(() => _.debounce(() => {
        if (mouseHoverSubMenu.current)
            return;
        setShowSubMenu(false);
    }, 200), []);
    const sortData = useCallback((asc) => {
        if (col == null)
            return;
        setContext((draftCtx) => {
            const errMsg = orderbydatafiler(draftCtx, startRow, startCol, endRow, endCol, col, asc);
            if (errMsg != null)
                showAlert(errMsg);
        });
    }, [col, setContext, startRow, startCol, endRow, endCol, showAlert]);
    const renderColorList = useCallback((key, title, colors, onSelectChange) => colors.length > 1 ? (_jsxs("div", { children: [_jsx("div", { className: "title", children: title }), _jsx("div", { className: "color-list", children: colors.map((v) => (_jsxs("div", { className: "item", onClick: () => onSelectChange(key, v.color, !v.checked), tabIndex: 0, children: [_jsx("div", { className: "color-label", style: { backgroundColor: v.color } }), _jsx("input", { className: "luckysheet-mousedown-cancel", type: "checkbox", checked: v.checked, onChange: () => { } })] }, v.color))) })] }, key)) : null, []);
    useLayoutEffect(() => {
        // re-position the filterContextMenu if it overflows the window
        if (!containerRef.current || !filterContextMenu) {
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
        // menu最小高度
        const menuH = 350;
        let top = filterContextMenu.y;
        let left = filterContextMenu.x;
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
        // 适配小屏
        let containerH = winH - rect.top - 350;
        if (containerH < 0) {
            containerH = 100;
        }
        // 防止Maximum update depth exceeded错误，如果当前值和前一个filterContextMenu值一样则不进行赋值
        if (filterContextMenu.x === left &&
            filterContextMenu.y === top &&
            filterContextMenu.listBoxMaxHeight === containerH) {
            return;
        }
        setContext((draftCtx) => {
            if (hasOverflow) {
                _.set(draftCtx, "filterContextMenu.x", left);
                _.set(draftCtx, "filterContextMenu.y", top);
            }
            _.set(draftCtx, "filterContextMenu.listBoxMaxHeight", containerH);
        });
    }, [filterContextMenu, refs.workbookContainer, setContext]);
    useLayoutEffect(() => {
        if (!subMenuPos)
            return;
        // re-position the subMenu if it overflows the window
        const rect = byColorMenuRef.current?.getBoundingClientRect();
        const subMenuRect = subMenuRef.current?.getBoundingClientRect();
        if (rect == null || subMenuRect == null)
            return;
        const winW = window.innerWidth;
        const pos = _.cloneDeep(subMenuPos);
        if (subMenuRect.left + subMenuRect.width > winW) {
            pos.left -= subMenuRect.width;
            setSubMenuPos(pos);
        }
    }, [subMenuPos]);
    useEffect(() => {
        if (col == null)
            return;
        setSearchText("");
        setShowSubMenu(false);
        dateTreeExpandState.current = {};
        hiddenRows.current = filterContextMenu?.hiddenRows || [];
        const res = getFilterColumnValues(contextRef.current, col, startRow, endRow, startCol);
        setData(_.omit(res, ["datesUncheck", "valuesUncheck"]));
        setDatesUncheck(res.datesUncheck);
        setValuesUncheck(res.valuesUncheck);
        setShowValues(res.flattenValues);
    }, [
        col,
        endRow,
        startRow,
        startCol,
        hiddenRows,
        filterContextMenu?.hiddenRows,
    ]);
    useEffect(() => {
        if (col == null)
            return;
        setFilterColors(getFilterColumnColors(contextRef.current, col, startRow, endRow));
    }, [col, endRow, startRow]);
    if (filterContextMenu == null)
        return null;
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "fortune-context-menu luckysheet-cols-menu fortune-filter-menu", id: "luckysheet-\\${menuid}-menu", ref: containerRef, style: { left: filterContextMenu.x, top: filterContextMenu.y }, children: [settings.filterContextMenu?.map((name, i) => {
                        if (name === "|") {
                            return _jsx(Divider, {}, `divider-${i}`);
                        }
                        if (name === "sort-by-asc") {
                            return (_jsx(Menu, { onClick: () => sortData(true), children: filter.sortByAsc }, name));
                        }
                        if (name === "sort-by-desc") {
                            return (_jsx(Menu, { onClick: () => sortData(false), children: filter.sortByDesc }, name));
                        }
                        if (name === "filter-by-color") {
                            return (_jsx("div", { ref: byColorMenuRef, onMouseEnter: () => {
                                    if (!containerRef.current || !filterContextMenu) {
                                        return;
                                    }
                                    setShowSubMenu(true);
                                    const rect = byColorMenuRef.current?.getBoundingClientRect();
                                    if (rect == null)
                                        return;
                                    setSubMenuPos({ top: rect.top - 5, left: rect.right });
                                }, onMouseLeave: delayHideSubMenu, children: _jsx(Menu, { onClick: () => { }, children: _jsxs("div", { className: "filter-bycolor-container", children: [filter.filterByColor, _jsx("div", { className: "filter-caret right" })] }) }) }, name));
                        }
                        if (name === "filter-by-condition") {
                            return (_jsxs("div", { children: [_jsxs(Menu, { onClick: () => { }, children: [_jsx("div", { className: "filter-caret right" }), filter.filterByCondition] }), _jsx("div", { className: "luckysheet-\\${menuid}-bycondition", style: { display: "none" }, children: _jsxs("div", { className: "luckysheet-flat-menu-button luckysheet-mousedown-cancel", id: "luckysheet-\\${menuid}-selected", children: [_jsx("span", { className: "luckysheet-mousedown-cancel", "data-value": "null", "data-type": "0", children: filter.filiterInputNone }), _jsx("div", { className: "luckysheet-mousedown-cancel", children: _jsx("i", { className: "fa fa-sort", "aria-hidden": "true" }) })] }) })] }, "name"));
                        }
                        if (name === "filter-by-value") {
                            return (_jsxs("div", { children: [_jsxs(Menu, { onClick: () => { }, children: [_jsx("div", { className: "filter-caret right" }), filter.filterByValues] }), _jsxs("div", { className: "luckysheet-filter-byvalue", children: [_jsxs("div", { className: "fortune-menuitem-row byvalue-btn-row", children: [_jsxs("div", { children: [_jsx("span", { className: "fortune-byvalue-btn", onClick: selectAll, tabIndex: 0, children: filter.filterValueByAllBtn }), " - ", _jsx("span", { className: "fortune-byvalue-btn", onClick: clearAll, tabIndex: 0, children: filter.filterValueByClearBtn }), " - ", _jsx("span", { className: "fortune-byvalue-btn", onClick: inverseSelect, tabIndex: 0, children: filter.filterValueByInverseBtn })] }), _jsx("div", { className: "byvalue-filter-icon", children: _jsx(SVGIcon, { name: "filter-fill", style: { width: 20, height: 20 } }) })] }), _jsx("div", { className: "filtermenu-input-container", children: _jsx("input", { type: "text", onKeyDown: (e) => e.stopPropagation(), placeholder: filter.filterValueByTip, className: "luckysheet-mousedown-cancel", id: "luckysheet-\\${menuid}-byvalue-input", value: searchText, onChange: (e) => {
                                                        setSearchText(e.target.value);
                                                        searchValues(e.target.value);
                                                    } }) }), _jsxs("div", { id: "luckysheet-filter-byvalue-select", style: { maxHeight: listBoxMaxHeight }, children: [_jsx(DateSelectTree, { dates: data.dates, onExpand: onExpand, initialExpand: initialExpand, isChecked: (key) => _.find(datesUncheck, (v) => v.match(key) != null) == null, onChange: (item, checked) => {
                                                            const rows = hiddenRows.current;
                                                            hiddenRows.current = checked
                                                                ? _.without(rows, ...item.rows)
                                                                : _.union(rows, item.rows);
                                                            setDatesUncheck(produce((draft) => {
                                                                return checked
                                                                    ? _.without(draft, ...item.dateValues)
                                                                    : _.union(draft, item.dateValues);
                                                            }));
                                                        }, isItemVisible: (item) => {
                                                            return showValues.length === data.flattenValues.length
                                                                ? true
                                                                : _.findIndex(showValues, (v) => v.match(item.key) != null) > -1;
                                                        } }), data.values.map((v) => (_jsx(SelectItem, { item: v, isChecked: (key) => !_.includes(valuesUncheck, key), onChange: (item, checked) => {
                                                            const rows = hiddenRows.current;
                                                            hiddenRows.current = checked
                                                                ? _.without(rows, ...item.rows)
                                                                : _.concat(rows, item.rows);
                                                            setValuesUncheck(produce((draft) => {
                                                                if (checked) {
                                                                    _.pull(draft, item.key);
                                                                }
                                                                else {
                                                                    draft.push(item.key);
                                                                }
                                                            }));
                                                        }, isItemVisible: (item) => {
                                                            return showValues.length === data.flattenValues.length
                                                                ? true
                                                                : _.includes(showValues, item.text);
                                                        } }, v.key)))] })] })] }, name));
                        }
                        return null;
                    }), _jsx(Divider, {}), _jsxs("div", { className: "fortune-menuitem-row", children: [_jsx("div", { className: "button-basic button-primary", onClick: () => {
                                    if (col == null)
                                        return;
                                    setContext((draftCtx) => {
                                        const rowHidden = _.reduce(hiddenRows.current, (pre, curr) => {
                                            pre[curr] = 0;
                                            return pre;
                                        }, {});
                                        saveFilter(draftCtx, hiddenRows.current.length > 0, rowHidden, {}, startRow, endRow, col, startCol, endCol);
                                        hiddenRows.current = [];
                                        draftCtx.filterContextMenu = undefined;
                                    });
                                }, tabIndex: 0, children: filter.filterConform }), _jsx("div", { className: "button-basic button-default", onClick: () => {
                                    setContext((draftCtx) => {
                                        draftCtx.filterContextMenu = undefined;
                                    });
                                }, tabIndex: 0, children: filter.filterCancel }), _jsx("div", { className: "button-basic button-danger", onClick: () => {
                                    setContext((draftCtx) => {
                                        clearFilter(draftCtx);
                                    });
                                }, tabIndex: 0, children: filter.clearFilter })] })] }), showSubMenu && (_jsx("div", { ref: subMenuRef, className: "luckysheet-filter-bycolor-submenu", style: subMenuPos, onMouseEnter: () => {
                    mouseHoverSubMenu.current = true;
                }, onMouseLeave: () => {
                    mouseHoverSubMenu.current = false;
                    setShowSubMenu(false);
                }, children: filterColors.bgColors.length < 2 &&
                    filterColors.fcColors.length < 2 ? (_jsx("div", { className: "one-color-tip", children: filter.filterContainerOneColorTip })) : (_jsxs(_Fragment, { children: [[
                            {
                                key: "bgColors",
                                title: filter.filiterByColorTip,
                                colors: filterColors.bgColors,
                            },
                            {
                                key: "fcColors",
                                title: filter.filiterByTextColorTip,
                                colors: filterColors.fcColors,
                            },
                        ].map((v) => renderColorList(v.key, v.title, v.colors, onColorSelectChange)), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                                if (col == null)
                                    return;
                                setContext((draftCtx) => {
                                    const rowHidden = _.reduce(_(filterColors)
                                        .values()
                                        .flatten()
                                        .map((v) => (v.checked ? [] : v.rows))
                                        .flatten()
                                        .valueOf(), (pre, curr) => {
                                        pre[curr] = 0;
                                        return pre;
                                    }, {});
                                    saveFilter(draftCtx, !_.isEmpty(rowHidden), rowHidden, {}, startRow, endRow, col, startCol, endCol);
                                    hiddenRows.current = [];
                                    draftCtx.filterContextMenu = undefined;
                                });
                            }, tabIndex: 0, children: filter.filterConform })] })) }))] }));
};
export default FilterMenu;
