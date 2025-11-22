import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { applyLocation, getFlowdata, getOptionValue, getSelectRange, locale, } from "@nde-sheet/core";
import produce from "immer";
import _ from "lodash";
import { useContext, useState, useCallback } from "react";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import "./index.css";
export const LocationCondition = () => {
    const { context, setContext } = useContext(WorkbookContext);
    const { showDialog, hideDialog } = useDialog();
    const { findAndReplace, button } = locale(context);
    const [conditionType, setConditionType] = useState("locationConstant");
    const [constants, setConstants] = useState({
        locationDate: true,
        locationDigital: true,
        locationString: true,
        locationBool: true,
        locationError: true,
    });
    const [formulas, setFormulas] = useState({
        locationDate: true,
        locationDigital: true,
        locationString: true,
        locationBool: true,
        locationError: true,
    });
    // 确定按钮
    const onConfirm = useCallback(() => {
        if (conditionType === "locationConstant") {
            const value = getOptionValue(constants);
            const selectRange = getSelectRange(context);
            setContext((ctx) => {
                const rangeArr = applyLocation(selectRange, conditionType, value, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else if (conditionType === "locationFormula") {
            const value = getOptionValue(formulas);
            const selectRange = getSelectRange(context);
            setContext((ctx) => {
                const rangeArr = applyLocation(selectRange, conditionType, value, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else if (conditionType === "locationRowSpan") {
            if (context.luckysheet_select_save?.length === 0 ||
                (context.luckysheet_select_save?.length === 1 &&
                    context.luckysheet_select_save[0].row[0] ===
                        context.luckysheet_select_save[0].row[1])) {
                showDialog(findAndReplace.locationTiplessTwoRow, "ok");
                return;
            }
            const selectRange = _.assignIn([], context.luckysheet_select_save);
            setContext((ctx) => {
                const rangeArr = applyLocation(selectRange, conditionType, undefined, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else if (conditionType === "locationColumnSpan") {
            if (context.luckysheet_select_save?.length === 0 ||
                (context.luckysheet_select_save?.length === 1 &&
                    context.luckysheet_select_save[0].column[0] ===
                        context.luckysheet_select_save[0].column[1])) {
                showDialog(findAndReplace.locationTiplessTwoColumn, "ok");
                return;
            }
            const selectRange = _.assignIn([], context.luckysheet_select_save);
            setContext((ctx) => {
                const rangeArr = applyLocation(selectRange, conditionType, undefined, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
        else {
            // 空值处理
            let selectRange;
            if (context.luckysheet_select_save?.length === 0 ||
                (context.luckysheet_select_save?.length === 1 &&
                    context.luckysheet_select_save[0].row[0] ===
                        context.luckysheet_select_save[0].row[1] &&
                    context.luckysheet_select_save[0].column[0] ===
                        context.luckysheet_select_save[0].column[1])) {
                const flowdata = getFlowdata(context, context.currentSheetId);
                selectRange = [
                    {
                        row: [0, flowdata.length - 1],
                        column: [0, flowdata[0].length - 1],
                    },
                ];
            }
            else {
                selectRange = _.assignIn([], context.luckysheet_select_save);
            }
            setContext((ctx) => {
                const rangeArr = applyLocation(selectRange, conditionType, undefined, ctx);
                if (rangeArr.length === 0)
                    showDialog(findAndReplace.locationTipNotFindCell, "ok");
            });
        }
    }, [
        conditionType,
        constants,
        context,
        findAndReplace.locationTipNotFindCell,
        findAndReplace.locationTiplessTwoColumn,
        findAndReplace.locationTiplessTwoRow,
        formulas,
        setContext,
        showDialog,
    ]);
    // 选中事件处理
    const isSelect = useCallback((currentType) => conditionType === currentType, [conditionType]);
    return (_jsxs("div", { id: "fortune-location-condition", children: [_jsx("div", { className: "title", children: findAndReplace.location }), _jsxs("div", { className: "listbox", children: [_jsxs("div", { className: "listItem", children: [_jsx("input", { type: "radio", name: "locationType", id: "locationConstant", checked: isSelect("locationConstant"), onChange: () => {
                                    setConditionType("locationConstant");
                                } }), _jsx("label", { htmlFor: "locationConstant", children: findAndReplace.locationConstant }), _jsx("div", { className: "subbox", children: [
                                    "locationDate",
                                    "locationDigital",
                                    "locationString",
                                    "locationBool",
                                    "locationError",
                                ].map((v) => (_jsxs("div", { className: "subItem", children: [_jsx("input", { type: "checkbox", disabled: !isSelect("locationConstant"), checked: constants[v], onChange: () => {
                                                setConstants(produce((draft) => {
                                                    _.set(draft, v, !draft[v]);
                                                }));
                                            } }), _jsx("label", { htmlFor: v, style: {
                                                color: isSelect("locationConstant") ? "#000" : "#666",
                                            }, children: findAndReplace[v] })] }, v))) })] }), _jsxs("div", { className: "listItem", children: [_jsx("input", { type: "radio", name: "locationType", id: "locationFormula", checked: isSelect("locationFormula"), onChange: () => {
                                    setConditionType("locationFormula");
                                } }), _jsx("label", { htmlFor: "locationFormula", children: findAndReplace.locationFormula }), _jsx("div", { className: "subbox", children: [
                                    "locationDate",
                                    "locationDigital",
                                    "locationString",
                                    "locationBool",
                                    "locationError",
                                ].map((v) => (_jsxs("div", { className: "subItem", children: [_jsx("input", { type: "checkbox", disabled: !isSelect("locationFormula"), checked: formulas[v], onChange: () => {
                                                setFormulas(produce((draft) => {
                                                    _.set(draft, v, !draft[v]);
                                                }));
                                            } }), _jsx("label", { htmlFor: v, style: {
                                                color: isSelect("locationFormula") ? "#000" : "#666",
                                            }, children: findAndReplace[v] })] }, v))) })] }), ["locationNull", "locationRowSpan", "locationColumnSpan"].map((v) => (_jsxs("div", { className: "listItem", children: [_jsx("input", { type: "radio", name: v, checked: isSelect(v), onChange: () => {
                                    setConditionType(v);
                                } }), _jsx("label", { htmlFor: v, children: findAndReplace[v] })] }, v)))] }), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                    hideDialog();
                    onConfirm();
                }, tabIndex: 0, children: button.confirm }), _jsx("div", { className: "button-basic button-close", onClick: () => {
                    hideDialog();
                }, tabIndex: 0, children: button.cancel })] }));
};
