import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/control-has-associated-label */
import { getDataArr, getFlowdata, getRegStr, locale, updateMoreCell, } from "@nde-sheet/core";
import _ from "lodash";
import { useContext, useEffect, useState, useCallback, useRef, } from "react";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import "./index.css";
export const SplitColumn = () => {
    const { context, setContext } = useContext(WorkbookContext);
    const { splitText, button } = locale(context);
    const [splitOperate, setSplitOperate] = useState("");
    const [otherFlag, setOtherFlag] = useState(false);
    const [tableData, setTableData] = useState([]);
    const splitSymbols = useRef(null);
    const { showDialog, hideDialog } = useDialog();
    // 确定按钮
    const certainBtn = useCallback(() => {
        hideDialog();
        const dataArr = getDataArr(splitOperate, context);
        const r = context.luckysheet_select_save[0].row[0];
        const c = context.luckysheet_select_save[0].column[0];
        if (dataArr[0].length === 1) {
            return;
        }
        let dataCover = false;
        const data = getFlowdata(context);
        for (let i = 0; i < dataArr.length; i += 1) {
            for (let j = 1; j < dataArr[0].length; j += 1) {
                const cell = data[r + i][c + j];
                if (!_.isNull(cell) && !_.isNull(cell.v)) {
                    dataCover = true;
                    break;
                }
            }
        }
        if (dataCover) {
            showDialog(splitText.splitConfirmToExe, "yesno", () => {
                hideDialog();
                setContext((ctx) => {
                    updateMoreCell(r, c, dataArr, ctx);
                });
            });
        }
        else {
            setContext((ctx) => {
                updateMoreCell(r, c, dataArr, ctx);
            });
        }
    }, [
        context,
        hideDialog,
        setContext,
        showDialog,
        splitOperate,
        splitText.splitConfirmToExe,
    ]);
    // 数据预览
    useEffect(() => {
        setTableData((table) => {
            table = getDataArr(splitOperate, context);
            return table;
        });
    }, [context, splitOperate]);
    return (_jsxs("div", { id: "fortune-split-column", children: [_jsx("div", { className: "title", children: splitText.splitTextTitle }), _jsx("div", { className: "splitDelimiters", children: splitText.splitDelimiters }), _jsxs("div", { className: "splitSymbols", ref: splitSymbols, children: [splitText.splitSymbols.map((o) => (_jsxs("div", { className: "splitSymbol", children: [_jsx("input", { id: o.value, name: o.value, type: "checkbox", onClick: () => setSplitOperate((regStr) => {
                                    return getRegStr(regStr, splitSymbols.current?.childNodes);
                                }), tabIndex: 0 }), _jsx("label", { htmlFor: o.value, children: o.name })] }, o.value))), _jsxs("div", { className: "splitSymbol", children: [_jsx("input", { id: "other", name: "other", type: "checkbox", onClick: () => {
                                    setOtherFlag(!otherFlag);
                                    setSplitOperate((regStr) => {
                                        return getRegStr(regStr, splitSymbols.current?.childNodes);
                                    });
                                }, tabIndex: 0 }), _jsx("label", { htmlFor: "other", children: splitText.splitOther }), _jsx("input", { id: "otherValue", name: "otherValue", type: "text", onBlur: () => {
                                    if (otherFlag) {
                                        setSplitOperate((regStr) => {
                                            return getRegStr(regStr, splitSymbols.current?.childNodes);
                                        });
                                    }
                                } })] }), _jsxs("div", { className: "splitSymbol splitSimple", children: [_jsx("input", { id: "splitsimple", name: "splitsimple", type: "checkbox", onClick: () => {
                                    setSplitOperate((regStr) => {
                                        return getRegStr(regStr, splitSymbols.current?.childNodes);
                                    });
                                }, tabIndex: 0 }), _jsx("label", { htmlFor: "splitsimple", children: splitText.splitContinueSymbol })] })] }), _jsx("div", { className: "splitDataPreview", children: splitText.splitDataPreview }), _jsx("div", { className: "splitColumnData", children: _jsx("table", { children: _jsx("tbody", { children: tableData.map((o, index) => {
                            if (o.length >= 1) {
                                return (_jsx("tr", { children: o.map((o1) => (_jsx("td", { children: o1 }, o + o1))) }, index));
                            }
                            return (_jsx("tr", { children: _jsx("td", {}) }));
                        }) }) }) }), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                    certainBtn();
                }, tabIndex: 0, children: button.confirm }), _jsx("div", { className: "button-basic button-close", onClick: () => {
                    hideDialog();
                }, tabIndex: 0, children: button.cancel })] }));
};
