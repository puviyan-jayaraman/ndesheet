import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useContext } from "react";
import "./index.css";
import { locale, updateItem } from "@nde-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import Select, { Option } from "../Toolbar/Select";
import SVGIcon from "../SVGIcon";
import { useDialog } from "../../hooks/useDialog";
import ConditionRules from "./ConditionRules";
import { MenuDivider } from "../Toolbar/Divider";
const ConditionalFormat = ({ items, setOpen }) => {
    const { context, setContext, refs } = useContext(WorkbookContext);
    const { showDialog } = useDialog();
    const { conditionformat } = locale(context);
    // 子菜单溢出屏幕时，重新定位子菜单位置
    // re-position the subMenu if it oveflows the window
    const showSubMenu = useCallback((e) => {
        const target = e.target;
        const menuItem = target.className === "fortune-toolbar-menu-line"
            ? target.parentElement
            : target;
        const menuItemRect = menuItem.getBoundingClientRect();
        const workbookContainerRect = refs.workbookContainer.current.getBoundingClientRect();
        const subMenu = menuItem.querySelector(".condition-format-sub-menu");
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
            subMenu.style.right = `${-(parseFloat(subMenu.style.width.replace("px", "")) +
                menuItemPaddingRight)}px`;
        }
    }, [refs.workbookContainer]);
    const hideSubMenu = useCallback((e) => {
        const target = e.target;
        if (target.className === "condition-format-sub-menu") {
            target.style.display = "none";
            return;
        }
        const subMenu = (target.className === "condition-format-item"
            ? target.parentElement
            : target.querySelector(".condition-format-sub-menu"));
        if (_.isNil(subMenu))
            return;
        subMenu.style.display = "none";
    }, []);
    // 获得条件格式
    const getConditionFormatItem = useCallback((name) => {
        if (name === "-") {
            return _jsx(MenuDivider, {}, name);
        }
        if (name === "highlightCellRules") {
            return (_jsx(Option, { onMouseEnter: showSubMenu, onMouseLeave: hideSubMenu, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [conditionformat[name], _jsx(SVGIcon, { name: "rightArrow", width: 18 }), _jsx("div", { className: "condition-format-sub-menu", style: {
                                display: "none",
                                width: 150,
                            }, children: [
                                { text: "greaterThan", value: ">" },
                                { text: "lessThan", value: "<" },
                                { text: "between", value: "[]" },
                                { text: "equal", value: "=" },
                                { text: "textContains", value: "()" },
                                {
                                    text: "occurrenceDate",
                                    value: conditionformat.yesterday,
                                },
                                { text: "duplicateValue", value: "##" },
                            ].map((v) => (_jsxs("div", { className: "condition-format-item", onClick: () => {
                                    setOpen(false);
                                    showDialog(_jsx(ConditionRules, { type: v.text }));
                                }, tabIndex: 0, children: [conditionformat[v.text], _jsx("span", { children: v.value })] }, v.text))) })] }, `div${name}`) }, name));
        }
        if (name === "itemSelectionRules") {
            return (_jsx(Option, { onMouseEnter: showSubMenu, onMouseLeave: hideSubMenu, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [conditionformat[name], _jsx(SVGIcon, { name: "rightArrow", width: 18 }), _jsx("div", { className: "condition-format-sub-menu", style: {
                                display: "none",
                                width: 180,
                            }, children: [
                                { text: "top10", value: conditionformat.top10 },
                                {
                                    text: "top10_percent",
                                    value: conditionformat.top10_percent,
                                },
                                { text: "last10", value: conditionformat.last10 },
                                {
                                    text: "last10_percent",
                                    value: conditionformat.last10_percent,
                                },
                                { text: "aboveAverage", value: conditionformat.above },
                                { text: "belowAverage", value: conditionformat.below },
                            ].map((v) => (_jsxs("div", { className: "condition-format-item", onClick: () => {
                                    setOpen(false);
                                    showDialog(_jsx(ConditionRules, { type: v.text }));
                                }, tabIndex: 0, children: [conditionformat[v.text], _jsx("span", { children: v.value })] }, v.text))) })] }) }, name));
        }
        if (name === "dataBar") {
            return (_jsxs("div", { className: "fortune-toolbar-menu-line", children: [conditionformat[name], _jsx(SVGIcon, { name: "rightArrow", width: 18 })] }, `div${name}`));
        }
        if (name === "colorGradation") {
            return (_jsxs("div", { className: "fortune-toolbar-menu-line", children: [conditionformat[name], _jsx(SVGIcon, { name: "rightArrow", width: 18 })] }, `div${name}`));
        }
        if (name === "icons") {
            return (_jsx("div", { className: "fortune-toolbar-menu-line", children: conditionformat[name] }, `div${name}`));
        }
        if (name === "newFormatRule") {
            return (_jsx("div", { className: "fortune-toolbar-menu-line", children: conditionformat[name] }, `div${name}`));
        }
        if (name === "deleteRule") {
            return (_jsx(Option, { onMouseEnter: showSubMenu, onMouseLeave: hideSubMenu, children: _jsxs("div", { className: "fortune-toolbar-menu-line", children: [conditionformat[name], _jsx(SVGIcon, { name: "rightArrow", width: 18 }), _jsx("div", { className: "condition-format-sub-menu", style: {
                                display: "none",
                                width: 150,
                            }, children: ["deleteSheetRule"].map((v) => (_jsx("div", { className: "condition-format-item", style: { padding: "6px 10px" }, onClick: () => {
                                    setContext((ctx) => {
                                        updateItem(ctx, "delSheet");
                                    });
                                }, tabIndex: 0, children: conditionformat[v] }, v))) })] }) }, name));
        }
        if (name === "manageRules") {
            return (_jsx("div", { className: "fortune-toolbar-menu-line", children: conditionformat[name] }, `div${name}`));
        }
        return _jsx("div", {});
    }, [conditionformat, hideSubMenu, setContext, setOpen, showDialog, showSubMenu]);
    return (_jsx("div", { className: "condition-format", children: _jsx(Select, { style: { overflow: "visible" }, children: items.map((v) => (_jsx("div", { children: getConditionFormatItem(v) }, `option${v}`))) }) }));
};
export default ConditionalFormat;
