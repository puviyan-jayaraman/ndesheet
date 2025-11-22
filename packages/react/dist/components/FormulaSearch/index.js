import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useContext, useState, useMemo, useCallback } from "react";
import { cancelNormalSelected, locale, setCaretPosition } from "@nde-sheet/core";
import _ from "lodash";
import WorkbookContext from "../../context";
import "./index.css";
export const FormulaSearch = ({ onCancel: _onCancel, }) => {
    const { context, setContext, refs: { cellInput, globalCache }, } = useContext(WorkbookContext);
    const [selectedType, setSelectedType] = useState(0);
    const [selectedFuncIndex, setSelectedFuncIndex] = useState(0);
    const [searchText, setSearchText] = useState("");
    const { formulaMore, functionlist, button } = locale(context);
    const typeList = useMemo(() => [
        { t: 0, n: formulaMore.Math },
        { t: 1, n: formulaMore.Statistical },
        { t: 2, n: formulaMore.Lookup },
        { t: 3, n: formulaMore.luckysheet },
        { t: 4, n: formulaMore.dataMining },
        { t: 5, n: formulaMore.Database },
        { t: 6, n: formulaMore.Date },
        { t: 7, n: formulaMore.Filter },
        { t: 8, n: formulaMore.Financial },
        { t: 9, n: formulaMore.Engineering },
        { t: 10, n: formulaMore.Logical },
        { t: 11, n: formulaMore.Operator },
        { t: 12, n: formulaMore.Text },
        { t: 13, n: formulaMore.Parser },
        { t: 14, n: formulaMore.Array },
        { t: -1, n: formulaMore.other },
    ], [formulaMore]);
    const filteredFunctionList = useMemo(() => {
        if (searchText) {
            const list = [];
            const text = _.cloneDeep(searchText.toUpperCase());
            for (let i = 0; i < functionlist.length; i += 1) {
                if (/^[a-zA-Z]+$/.test(text)) {
                    if (functionlist[i].n.indexOf(text) !== -1) {
                        list.push(functionlist[i]);
                    }
                }
                else if (functionlist[i].a.indexOf(text) !== -1) {
                    list.push(functionlist[i]);
                }
            }
            return list;
        }
        return _.filter(functionlist, (v) => v.t === selectedType);
    }, [functionlist, selectedType, searchText]);
    const onConfirm = useCallback(() => {
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
        const formulaTxt = `<span dir="auto" class="luckysheet-formula-text-color">=</span><span dir="auto" class="luckysheet-formula-text-color">${filteredFunctionList[selectedFuncIndex].n.toUpperCase()}</span><span dir="auto" class="luckysheet-formula-text-color">(</span>`;
        setContext((ctx) => {
            if (cellInput.current != null) {
                ctx.luckysheetCellUpdate = [row_index, col_index];
                globalCache.doNotUpdateCell = true;
                cellInput.current.innerHTML = formulaTxt;
                const spans = cellInput.current.childNodes;
                if (!_.isEmpty(spans)) {
                    setCaretPosition(ctx, spans[spans.length - 1], 0, 1);
                }
                ctx.functionHint =
                    filteredFunctionList[selectedFuncIndex].n.toUpperCase();
                ctx.functionCandidates = [];
                if (_.isEmpty(ctx.formulaCache.functionlistMap)) {
                    for (let i = 0; i < functionlist.length; i += 1) {
                        ctx.formulaCache.functionlistMap[functionlist[i].n] =
                            functionlist[i];
                    }
                }
                _onCancel();
            }
        });
    }, [
        cellInput,
        context.luckysheet_select_save,
        filteredFunctionList,
        globalCache,
        selectedFuncIndex,
        setContext,
        _onCancel,
        functionlist,
    ]);
    const onCancel = useCallback(() => {
        setContext((ctx) => {
            cancelNormalSelected(ctx);
            if (cellInput.current) {
                cellInput.current.innerHTML = "";
            }
        });
        _onCancel();
    }, [_onCancel, cellInput, setContext]);
    return (_jsxs("div", { id: "luckysheet-search-formula", children: [_jsxs("div", { className: "inpbox", children: [_jsxs("div", { children: [formulaMore.findFunctionTitle, "\uFF1A"] }), _jsx("input", { className: "formulaInputFocus", id: "searchFormulaListInput", placeholder: formulaMore.tipInputFunctionName, spellCheck: "false", onChange: (e) => setSearchText(e.target.value) })] }), _jsxs("div", { className: "selbox", children: [_jsxs("span", { children: [formulaMore.selectCategory, "\uFF1A"] }), _jsx("select", { id: "formulaTypeSelect", onChange: (e) => {
                            setSelectedType(parseInt(e.target.value, 10));
                            setSelectedFuncIndex(0);
                        }, children: typeList.map((v) => (_jsx("option", { value: v.t, children: v.n }, v.t))) })] }), _jsxs("div", { className: "listbox", style: { height: 200 }, children: [_jsxs("div", { children: [formulaMore.selectFunctionTitle, "\uFF1A"] }), _jsx("div", { className: "formulaList", children: filteredFunctionList.map((v, index) => (_jsxs("div", { className: `listBox${index === selectedFuncIndex ? " on" : ""}`, onClick: () => setSelectedFuncIndex(index), tabIndex: 0, children: [_jsx("div", { children: v.n }), _jsx("div", { children: v.a })] }, v.n))) })] }), _jsxs("div", { className: "fortune-dialog-box-button-container", children: [_jsx("div", { className: "fortune-message-box-button button-primary", onClick: onConfirm, tabIndex: 0, children: button.confirm }), _jsx("div", { className: "fortune-message-box-button button-default", onClick: onCancel, tabIndex: 0, children: button.cancel })] })] }));
};
