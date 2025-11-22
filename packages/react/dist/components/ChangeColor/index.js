import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getSheetIndex, locale } from "@nde-sheet/core";
import { useCallback, useContext, useEffect, useState } from "react";
import WorkbookContext from "../../context";
import ColorPicker from "../Toolbar/ColorPicker";
import "./index.css";
export const ChangeColor = ({ triggerParentUpdate }) => {
    const { context, setContext } = useContext(WorkbookContext);
    const { toolbar, sheetconfig, button } = locale(context);
    const [inputColor, setInputColor] = useState("#000000");
    const [selectColor, setSelectColor] = useState(context.luckysheetfile[getSheetIndex(context, context.currentSheetId)].color);
    // 确定按钮
    const certainBtn = useCallback(() => {
        setSelectColor(inputColor);
    }, [inputColor]);
    // 把用户选择的颜色记录在ctx中
    useEffect(() => {
        setContext((ctx) => {
            if (ctx.allowEdit === false)
                return;
            const index = getSheetIndex(ctx, ctx.currentSheetId);
            ctx.luckysheetfile[index].color = selectColor;
        });
    }, [selectColor, setContext]);
    return (_jsxs("div", { id: "fortune-change-color", children: [_jsx("div", { className: "color-reset", onClick: () => setSelectColor(undefined), tabIndex: 0, children: sheetconfig.resetColor }), _jsxs("div", { className: "custom-color", children: [_jsxs("div", { children: [toolbar.customColor, ":"] }), _jsx("input", { type: "color", value: inputColor, onChange: (e) => setInputColor(e.target.value), onFocus: () => {
                            triggerParentUpdate(true);
                        }, onBlur: () => {
                            triggerParentUpdate(false);
                        } }), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                            certainBtn();
                        }, tabIndex: 0, children: button.confirm })] }), _jsx(ColorPicker, { onPick: (color) => {
                    setInputColor(color);
                    setSelectColor(color);
                } })] }));
};
