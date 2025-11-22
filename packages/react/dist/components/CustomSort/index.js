import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getSheetIndex, indexToColumnChar, locale, sortSelection, } from "@nde-sheet/core";
import { useCallback, useContext, useEffect, useState, } from "react";
import WorkbookContext from "../../context";
import "./index.css";
import { useDialog } from "../../hooks/useDialog";
const CustomSort = () => {
    const [rangeColChar, setRangeColChar] = useState([]);
    const [ascOrDesc, setAscOrDesc] = useState(true);
    const { context, setContext } = useContext(WorkbookContext);
    const [selectedValue, setSelectedValue] = useState("0");
    const [isTitleChange, setIstitleChange] = useState(false);
    const { sort } = locale(context);
    const { hideDialog } = useDialog();
    const col_start = context.luckysheet_select_save[0].column[0];
    const col_end = context.luckysheet_select_save[0].column[1];
    const row_start = context.luckysheet_select_save[0].row[0];
    const row_end = context.luckysheet_select_save[0].row[1];
    const sheetIndex = getSheetIndex(context, context.currentSheetId);
    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };
    // 改变排序方式
    const handleRadioChange = useCallback((e) => {
        const sortValue = e.target.value;
        setAscOrDesc(sortValue === "asc");
    }, []);
    const handleTitleChange = useCallback((e) => {
        const value = e.target.checked;
        setIstitleChange(value);
    }, []);
    // 获取排序列
    useEffect(() => {
        const list = [];
        if (isTitleChange) {
            for (let i = col_start; i <= col_end; i += 1) {
                // 判断列首是否为空
                const cell = context.luckysheetfile[sheetIndex].data?.[row_start]?.[i];
                const colHeaderValue = cell?.m || cell?.v;
                if (colHeaderValue) {
                    list.push(colHeaderValue);
                }
                else {
                    const ColumnChar = indexToColumnChar(i);
                    list.push(`${sort.columnOperation} ${ColumnChar}`);
                }
            }
        }
        else {
            for (let i = col_start; i <= col_end; i += 1) {
                const ColumnChar = indexToColumnChar(i);
                list.push(ColumnChar);
            }
        }
        setRangeColChar(list);
    }, [
        col_end,
        col_start,
        context.luckysheetfile,
        isTitleChange,
        row_start,
        sheetIndex,
        sort.columnOperation,
    ]);
    return (_jsxs("div", { className: "fortune-sort", children: [_jsx("div", { className: "fortune-sort-title", children: _jsxs("span", { children: [_jsx("span", { children: sort.sortRangeTitle }), indexToColumnChar(col_start), row_start + 1, _jsx("span", { children: sort.sortRangeTitleTo }), indexToColumnChar(col_end), row_end + 1] }) }), _jsx("div", { children: _jsxs("div", { className: "fortune-sort-modal", children: [_jsxs("div", { children: [_jsx("input", { type: "checkbox", id: "fortune-sort-haveheader", onChange: handleTitleChange }), _jsx("span", { children: sort.hasTitle })] }), _jsx("div", { className: "fortune-sort-tablec", children: _jsx("table", { cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsxs("td", { style: { width: "190px" }, children: [sort.sortBy, _jsx("select", { name: "sort_0", onChange: handleSelectChange, children: rangeColChar.map((col, index) => {
                                                            return (_jsx("option", { value: index, children: col }, index));
                                                        }) })] }), _jsxs("td", { children: [_jsxs("div", { children: [_jsx("input", { type: "radio", value: "asc", defaultChecked: true, name: "sort_0", onChange: handleRadioChange }), _jsx("span", { children: sort.asc })] }), _jsxs("div", { children: [_jsx("input", { type: "radio", value: "desc", name: "sort_0", onChange: handleRadioChange }), _jsx("span", { children: sort.desc })] })] })] }) }) }) })] }) }), _jsx("div", { className: "fortune-sort-button", children: _jsx("div", { className: "button-basic button-primary", onClick: () => {
                        setContext((draftCtx) => {
                            sortSelection(draftCtx, ascOrDesc, parseInt(selectedValue, 10));
                            draftCtx.contextMenu = {};
                        });
                        hideDialog();
                    }, tabIndex: 0, children: sort.confirm }) })] }));
};
export default CustomSort;
