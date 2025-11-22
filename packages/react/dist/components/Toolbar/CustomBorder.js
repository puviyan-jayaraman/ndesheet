import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useContext, useRef, useState } from "react";
import "./index.css";
import { locale } from "@nde-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import { CustomColor } from "./CustomColor";
const size = [
    {
        Text: "1",
        value: "Thin",
        strokeDasharray: "1,0",
        strokeWidth: "1",
    },
    {
        Text: "2",
        value: "Hair",
        strokeDasharray: "1,5",
        strokeWidth: "1",
    },
    {
        Text: "3",
        value: "Dotted",
        strokeDasharray: "2,5",
        strokeWidth: "2",
    },
    {
        Text: "4",
        value: "Dashed",
        strokeDasharray: "5,5",
        strokeWidth: "2",
    },
    {
        Text: "5",
        value: "DashDot",
        strokeDasharray: "20,5,5,10,5,5",
        strokeWidth: "2",
    },
    {
        Text: "6",
        value: "DashDotDot",
        strokeDasharray: "20,5,5,5,5,10,5,5,5,5",
        strokeWidth: "2",
    },
    // {
    //   Text: "7",
    //   value: "Double",
    // },
    {
        Text: "8",
        value: "Medium",
        strokeDasharray: "2,0",
        strokeWidth: "2",
    },
    {
        Text: "9",
        value: "MediumDashed",
        strokeDasharray: "3,5",
        strokeWidth: "3",
    },
    {
        Text: "10",
        value: "MediumDashDot",
        strokeDasharray: "20,5,5,10,5,5",
        strokeWidth: "3",
    },
    {
        Text: "11",
        value: "MediumDashDotDot",
        strokeDasharray: "5,5,5,5,20,5,5,5,5,10",
        strokeWidth: "3",
    },
    // {
    //   Text: "12",
    //   value: "SlantedDashDot",
    // },
    {
        Text: "13",
        value: "Thick",
        strokeDasharray: "2,0",
        strokeWidth: "3",
    },
];
const CustomBorder = ({ onPick }) => {
    const { context, refs } = useContext(WorkbookContext);
    const { border } = locale(context);
    const [changeColor, setchangeColor] = useState("#000000");
    const [changeStyle, setchangeStyle] = useState("1");
    const colorRef = useRef(null);
    const styleRef = useRef(null);
    const colorPreviewRef = useRef(null);
    const [previewWith, setPreviewWith] = useState("");
    const [previewdasharry, setPreviewdasharray] = useState("");
    const showBorderSubMenu = useCallback((e) => {
        const target = e.target;
        const menuItemRect = target.getBoundingClientRect();
        const subMenuItem = target.querySelector(".fortune-border-select-menu");
        if (_.isNil(subMenuItem))
            return;
        subMenuItem.style.display = "block";
        const workbookContainerRect = refs.workbookContainer.current.getBoundingClientRect();
        if (workbookContainerRect.width - menuItemRect.right >
            parseFloat(subMenuItem.style.width.replace("px", ""))) {
            subMenuItem.style.left = `${menuItemRect?.width}px`;
        }
        else {
            subMenuItem.style.left = `-${subMenuItem.style.width}`;
        }
    }, [refs.workbookContainer]);
    const hideBorderSubMenu = useCallback(() => {
        styleRef.current.style.display = "none";
        colorRef.current.style.display = "none";
    }, []);
    const changePreviewStyle = useCallback((width, dasharray) => {
        setPreviewWith(width);
        setPreviewdasharray(dasharray);
    }, []);
    return (_jsxs("div", { children: [_jsxs("div", { className: "fortune-border-select-option", onMouseEnter: (e) => {
                    showBorderSubMenu(e);
                }, onMouseLeave: () => {
                    hideBorderSubMenu();
                }, children: [_jsxs("div", { className: "fortune-toolbar-menu-line", children: [border.borderColor, _jsx(SVGIcon, { name: "rightArrow", style: { width: "14px" } })] }), _jsx("div", { ref: colorPreviewRef, className: "fortune-border-color-preview", style: { backgroundColor: changeColor } }), _jsx("div", { ref: colorRef, className: "fortune-border-select-menu", style: { display: "none", width: "166px" }, children: _jsx(CustomColor, { onCustomPick: (color) => {
                                onPick(color, changeStyle);
                                colorPreviewRef.current.style.backgroundColor = changeColor;
                                setchangeColor(color);
                            }, onColorPick: (color) => {
                                onPick(color, changeStyle);
                                setchangeColor(color);
                            } }) })] }, "borderColor"), _jsxs("div", { className: "fortune-border-select-option", onMouseEnter: (e) => {
                    showBorderSubMenu(e);
                }, onMouseLeave: () => {
                    hideBorderSubMenu();
                }, children: [_jsxs("div", { className: "fortune-toolbar-menu-line", children: [border.borderStyle, _jsx(SVGIcon, { name: "rightArrow", style: { width: "14px" } })] }), _jsx("div", { className: "fortune-border-style-preview", children: _jsx("svg", { width: "90", children: _jsx("g", { fill: "none", stroke: "black", strokeWidth: previewWith, children: _jsx("path", { strokeDasharray: previewdasharry, d: "M0 0 l90 0" }) }) }) }), _jsxs("div", { ref: styleRef, className: "fortune-border-select-menu fortune-toolbar-select", style: { display: "none", width: "110px" }, children: [_jsx("div", { className: "fortune-border-style-picker-menu fortune-border-style-reset", onClick: () => {
                                    onPick(changeColor, "1");
                                    changePreviewStyle("1", "1,0");
                                }, tabIndex: 0, children: border.borderDefault }), _jsx("div", { className: "fortune-boder-style-picker", children: size.map((items, i) => (_jsx("div", { className: "fortune-border-style-picker-menu", onClick: () => {
                                        onPick(changeColor, items.Text);
                                        setchangeStyle(items.Text);
                                        changePreviewStyle(items.strokeWidth, items.strokeDasharray);
                                    }, tabIndex: 0, children: _jsx("svg", { height: "10", width: "90", children: _jsx("g", { fill: "none", stroke: "black", strokeWidth: items.strokeWidth, children: _jsx("path", { strokeDasharray: items.strokeDasharray, d: "M0 5 l85 0" }) }) }) }, i))) })] })] }, "borderStyle")] }));
};
export default CustomBorder;
