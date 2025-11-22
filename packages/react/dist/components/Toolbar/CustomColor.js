import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { locale } from "@nde-sheet/core";
import { useContext, useState } from "react";
import WorkbookContext from "../../context";
import ColorPicker from "../Toolbar/ColorPicker";
import "./index.css";
export const CustomColor = ({ onCustomPick, onColorPick }) => {
    const { context } = useContext(WorkbookContext);
    const { toolbar, sheetconfig, button } = locale(context);
    const [inputColor, setInputColor] = useState("#000000");
    return (_jsxs("div", { id: "fortune-custom-color", children: [_jsx("div", { className: "color-reset", onClick: () => onCustomPick(undefined), tabIndex: 0, children: sheetconfig.resetColor }), _jsxs("div", { className: "custom-color", children: [_jsxs("div", { children: [toolbar.customColor, ":"] }), _jsx("input", { type: "color", value: inputColor, onChange: (e) => setInputColor(e.target.value) }), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                            onCustomPick(inputColor);
                        }, tabIndex: 0, children: button.confirm })] }), _jsx(ColorPicker, { onPick: (color) => {
                    onColorPick(color);
                } })] }));
};
