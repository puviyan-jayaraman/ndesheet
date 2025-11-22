import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import _ from "lodash";
import { getDropdownList, getFlowdata, getRangeByTxt, getRangetxt, getSheetIndex, locale, setCellValue, confirmMessage, } from "@nde-sheet/core";
import { useCallback, useContext, useEffect, useState } from "react";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
import SVGIcon from "../SVGIcon";
import "./index.css";
const DataVerification = () => {
    const { context, setContext } = useContext(WorkbookContext);
    const { showDialog, hideDialog } = useDialog();
    const { dataVerification, toolbar, button, generalDialog } = locale(context);
    const [numberCondition] = useState([
        "between",
        "notBetween",
        "equal",
        "notEqualTo",
        "moreThanThe",
        "lessThan",
        "greaterOrEqualTo",
        "lessThanOrEqualTo",
    ]);
    const [dateCondition] = useState([
        "between",
        "notBetween",
        "equal",
        "notEqualTo",
        "earlierThan",
        "noEarlierThan",
        "laterThan",
        "noLaterThan",
    ]);
    // 开启鼠标选区
    const dataSelectRange = useCallback((type, value) => {
        hideDialog();
        setContext((ctx) => {
            ctx.rangeDialog.show = true;
            ctx.rangeDialog.type = type;
            ctx.rangeDialog.rangeTxt = value;
        });
    }, [hideDialog, setContext]);
    // 确定和取消按钮
    const btn = useCallback((type) => {
        if (type === "confirm") {
            setContext((ctx) => {
                const isPass = confirmMessage(ctx, generalDialog, dataVerification);
                if (isPass) {
                    const range = getRangeByTxt(ctx, ctx.dataVerification?.dataRegulation?.rangeTxt);
                    if (range.length === 0) {
                        return;
                    }
                    const regulation = ctx.dataVerification.dataRegulation;
                    const verifacationT = regulation?.type;
                    const { value1 } = regulation;
                    const item = {
                        ...regulation,
                        checked: false, // checkbox默认在单元格中false为未选中，true为选中
                    };
                    if (verifacationT === "dropdown") {
                        const list = getDropdownList(ctx, value1);
                        item.value1 = list.join(",");
                    }
                    const currentDataVerification = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)].dataVerification ?? {};
                    const str = range[range.length - 1]?.row[0];
                    const edr = range[range.length - 1]?.row[1];
                    const stc = range[range.length - 1]?.column[0];
                    const edc = range[range.length - 1]?.column[1];
                    const d = getFlowdata(ctx);
                    if (!d ||
                        _.isNil(str) ||
                        _.isNil(stc) ||
                        _.isNil(edr) ||
                        _.isNil(edc))
                        return;
                    for (let r = str; r <= edr; r += 1) {
                        for (let c = stc; c <= edc; c += 1) {
                            const key = `${r}_${c}`;
                            currentDataVerification[key] = item;
                            if (regulation.type === "checkbox") {
                                setCellValue(ctx, r, c, d, item.value2);
                            }
                        }
                    }
                    ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)].dataVerification = currentDataVerification;
                }
            });
        }
        else if (type === "delete") {
            setContext((ctx) => {
                const range = getRangeByTxt(ctx, ctx.dataVerification?.dataRegulation?.rangeTxt);
                if (range.length === 0) {
                    showDialog(generalDialog.noSeletionError, "ok");
                    return;
                }
                const currentDataVerification = ctx.luckysheetfile[getSheetIndex(ctx, ctx.currentSheetId)]
                    .dataVerification ?? {};
                const str = range[range.length - 1]?.row[0];
                const edr = range[range.length - 1]?.row[1];
                const stc = range[range.length - 1]?.column[0];
                const edc = range[range.length - 1]?.column[1];
                if (_.isNil(str) || _.isNil(stc) || _.isNil(edr) || _.isNil(edc))
                    return;
                for (let r = str; r <= edr; r += 1) {
                    for (let c = stc; c <= edc; c += 1) {
                        delete currentDataVerification[`${r}_${c}`];
                    }
                }
            });
        }
        hideDialog();
    }, [dataVerification, generalDialog, hideDialog, setContext, showDialog]);
    // 初始化
    useEffect(() => {
        setContext((ctx) => {
            let rangeT = "";
            // 如果有选区得把选区转为字符形式然后进行显示
            if (ctx.luckysheet_select_save) {
                const range = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
                rangeT = getRangetxt(context, context.currentSheetId, range, context.currentSheetId);
            }
            // 初始化值
            const index = getSheetIndex(ctx, ctx.currentSheetId);
            const ctxDataVerification = ctx.luckysheetfile[index].dataVerification || {};
            if (!ctx.luckysheet_select_save)
                return;
            const last = ctx.luckysheet_select_save[ctx.luckysheet_select_save.length - 1];
            const rowIndex = last.row_focus;
            const colIndex = last.column_focus;
            if (rowIndex == null || colIndex == null)
                return;
            const item = ctxDataVerification[`${rowIndex}_${colIndex}`];
            const defaultItem = item ?? {};
            let rangValue = defaultItem.value1 ?? "";
            // 选区赋值相关
            if (ctx.rangeDialog?.type === "dropDown" &&
                ctx.dataVerification &&
                ctx.dataVerification.dataRegulation &&
                ctx.dataVerification.dataRegulation.rangeTxt) {
                // 当是下拉列表选区的时候，则下拉选区赋值，范围保持不变
                rangeT = ctx.dataVerification.dataRegulation.rangeTxt;
                rangValue = ctx.rangeDialog.rangeTxt;
            }
            else if (ctx.rangeDialog?.type === "rangeTxt" &&
                ctx.dataVerification &&
                ctx.dataVerification.dataRegulation &&
                ctx.dataVerification.dataRegulation.value1) {
                // 当是选区范围的时候，则范围赋值，下拉选区不变
                rangValue = ctx.dataVerification.dataRegulation.value1;
                rangeT = ctx.rangeDialog.rangeTxt;
            }
            ctx.rangeDialog.type = "";
            if (item) {
                ctx.dataVerification.dataRegulation = {
                    ...item,
                    value1: rangValue,
                    rangeTxt: rangeT,
                };
            }
            else {
                ctx.dataVerification.dataRegulation = {
                    type: "dropdown",
                    type2: "",
                    rangeTxt: rangeT,
                    value1: rangValue,
                    value2: "",
                    validity: "",
                    remote: false,
                    prohibitInput: false,
                    hintShow: false,
                    hintValue: "",
                };
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsxs("div", { id: "fortune-data-verification", children: [_jsx("div", { className: "title", children: toolbar.dataVerification }), _jsxs("div", { className: "box", children: [_jsxs("div", { className: "box-item", style: { borderTop: "1px solid #E1E4E8" }, children: [_jsx("div", { className: "box-item-title", children: dataVerification.cellRange }), _jsxs("div", { className: "data-verification-range", children: [_jsx("input", { className: "formulaInputFocus", spellCheck: "false", value: context.dataVerification.dataRegulation?.rangeTxt, onChange: (e) => {
                                            const { value } = e.target;
                                            setContext((ctx) => {
                                                ctx.dataVerification.dataRegulation.rangeTxt = value;
                                            });
                                        } }), _jsx("i", { className: "icon", "aria-hidden": "true", onClick: () => {
                                            hideDialog();
                                            dataSelectRange("rangeTxt", context.dataVerification.dataRegulation.value1);
                                        }, tabIndex: 0, children: _jsx(SVGIcon, { name: "tab", width: 18 }) })] })] }), _jsxs("div", { className: "box-item", children: [_jsx("div", { className: "box-item-title", children: dataVerification.verificationCondition }), _jsx("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type, onChange: (e) => {
                                    const { value } = e.target;
                                    setContext((ctx) => {
                                        ctx.dataVerification.dataRegulation.type = value;
                                        if (value === "dropdown" || value === "checkbox") {
                                            ctx.dataVerification.dataRegulation.type2 = "";
                                        }
                                        else if (value === "number" ||
                                            value === "number_integer" ||
                                            value === "number_decimal" ||
                                            value === "text_length" ||
                                            value === "date") {
                                            ctx.dataVerification.dataRegulation.type2 = "between";
                                        }
                                        else if (value === "text_content") {
                                            ctx.dataVerification.dataRegulation.type2 = "include";
                                        }
                                        else if (value === "validity") {
                                            ctx.dataVerification.dataRegulation.type2 =
                                                "identificationNumber";
                                        }
                                        ctx.dataVerification.dataRegulation.value1 = "";
                                        ctx.dataVerification.dataRegulation.value2 = "";
                                    });
                                }, children: [
                                    "dropdown",
                                    "checkbox",
                                    "number",
                                    "number_integer",
                                    "number_decimal",
                                    "text_content",
                                    "text_length",
                                    "date",
                                    "validity",
                                ].map((v) => (_jsx("option", { value: v, children: dataVerification[v] }, v))) }), context.dataVerification?.dataRegulation?.type === "dropdown" && (_jsxs("div", { className: "show-box-item", children: [_jsxs("div", { className: "data-verification-range", children: [_jsx("input", { className: "formulaInputFocus", spellCheck: "false", value: context.dataVerification.dataRegulation.value1, placeholder: dataVerification.placeholder1, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value1 = value;
                                                    });
                                                } }), _jsx("i", { className: "icon", "aria-hidden": "true", onClick: () => dataSelectRange("dropDown", context.dataVerification.dataRegulation.value1), tabIndex: 0, children: _jsx(SVGIcon, { name: "tab", width: 18 }) })] }), _jsxs("div", { className: "check", children: [_jsx("input", { type: "checkbox", checked: context.dataVerification.dataRegulation.type2 === "true", id: "mul", onChange: (e) => {
                                                    const { checked } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.type2 = `${checked}`;
                                                    });
                                                } }), _jsx("label", { htmlFor: "mul", children: dataVerification.allowMultiSelect })] })] })), context.dataVerification?.dataRegulation?.type === "checkbox" && (_jsxs("div", { className: "show-box-item", children: [_jsxs("div", { className: "check-box", children: [_jsxs("span", { children: [dataVerification.selected, " \u2014\u2014 "] }), _jsx("input", { type: "text", className: "data-verification-value1", placeholder: dataVerification.placeholder2, value: context.dataVerification?.dataRegulation?.value1, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value1 = value;
                                                    });
                                                } })] }), _jsxs("div", { className: "check-box", children: [_jsxs("span", { children: [dataVerification.notSelected, " \u2014\u2014 "] }), _jsx("input", { type: "text", className: "data-verification-value2", placeholder: dataVerification.placeholder2, value: context.dataVerification?.dataRegulation?.value2, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value2 = value;
                                                    });
                                                } })] })] })), (context.dataVerification?.dataRegulation?.type === "number" ||
                                context.dataVerification?.dataRegulation?.type ===
                                    "number_integer" ||
                                context.dataVerification?.dataRegulation?.type ===
                                    "number_decimal" ||
                                context.dataVerification?.dataRegulation?.type ===
                                    "text_length") && (_jsxs("div", { className: "show-box-item", children: [_jsx("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: (e) => {
                                            const { value } = e.target;
                                            setContext((ctx) => {
                                                ctx.dataVerification.dataRegulation.type2 = value;
                                                ctx.dataVerification.dataRegulation.value1 = "";
                                                ctx.dataVerification.dataRegulation.value2 = "";
                                            });
                                        }, children: numberCondition.map((v) => (_jsx("option", { value: v, children: dataVerification[v] }, v))) }), context.dataVerification.dataRegulation.type2 === "between" ||
                                        context.dataVerification.dataRegulation.type2 === "notBetween" ? (_jsxs("div", { className: "input-box", children: [_jsx("input", { type: "number", placeholder: "1", value: context.dataVerification.dataRegulation.value1, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value1 = value;
                                                    });
                                                } }), _jsx("span", { children: "-" }), _jsx("input", { type: "number", placeholder: "100", value: context.dataVerification.dataRegulation.value2, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value2 = value;
                                                    });
                                                } })] })) : (_jsx("div", { className: "input-box", children: _jsx("input", { type: "number", style: { width: "100%" }, placeholder: dataVerification.placeholder3, value: context.dataVerification.dataRegulation.value1, onChange: (e) => {
                                                const { value } = e.target;
                                                setContext((ctx) => {
                                                    ctx.dataVerification.dataRegulation.value1 = value;
                                                });
                                            } }) }))] })), context.dataVerification?.dataRegulation?.type ===
                                "text_content" && (_jsxs("div", { className: "show-box-item", children: [_jsx("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: (e) => {
                                            const { value } = e.target;
                                            setContext((ctx) => {
                                                ctx.dataVerification.dataRegulation.type2 = value;
                                                ctx.dataVerification.dataRegulation.value1 = "";
                                                ctx.dataVerification.dataRegulation.value2 = "";
                                            });
                                        }, children: ["include", "exclude", "equal"].map((v) => (_jsx("option", { value: v, children: dataVerification[v] }, v))) }), _jsx("div", { className: "input-box", children: _jsx("input", { type: "text", style: { width: "100%" }, placeholder: dataVerification.placeholder4, value: context.dataVerification.dataRegulation.value1, onChange: (e) => {
                                                const { value } = e.target;
                                                setContext((ctx) => {
                                                    ctx.dataVerification.dataRegulation.value1 = value;
                                                });
                                            } }) })] })), context.dataVerification?.dataRegulation?.type === "date" && (_jsxs("div", { className: "show-box-item", children: [_jsx("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: (e) => {
                                            const { value } = e.target;
                                            setContext((ctx) => {
                                                ctx.dataVerification.dataRegulation.type2 = value;
                                                ctx.dataVerification.dataRegulation.value1 = "";
                                                ctx.dataVerification.dataRegulation.value2 = "";
                                            });
                                        }, children: dateCondition.map((v) => (_jsx("option", { value: v, children: dataVerification[v] }, v))) }), context.dataVerification.dataRegulation.type2 === "between" ||
                                        context.dataVerification.dataRegulation.type2 === "notBetween" ? (_jsxs("div", { className: "input-box", children: [_jsx("input", { type: "date", placeholder: "1", value: context.dataVerification.dataRegulation.value1, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value1 = value;
                                                    });
                                                } }), _jsx("span", { children: "-" }), _jsx("input", { type: "date", placeholder: "100", value: context.dataVerification.dataRegulation.value2, onChange: (e) => {
                                                    const { value } = e.target;
                                                    setContext((ctx) => {
                                                        ctx.dataVerification.dataRegulation.value2 = value;
                                                    });
                                                } })] })) : (_jsx("div", { className: "input-box", children: _jsx("input", { type: "date", style: { width: "100%" }, placeholder: dataVerification.placeholder3, value: context.dataVerification.dataRegulation.value1, onChange: (e) => {
                                                const { value } = e.target;
                                                setContext((ctx) => {
                                                    ctx.dataVerification.dataRegulation.value1 = value;
                                                });
                                            } }) }))] })), context.dataVerification?.dataRegulation?.type === "validity" && (_jsx("div", { className: "show-box-item", children: _jsx("select", { className: "data-verification-type-select", value: context.dataVerification.dataRegulation.type2, onChange: (e) => {
                                        const { value } = e.target;
                                        setContext((ctx) => {
                                            ctx.dataVerification.dataRegulation.type2 = value;
                                            ctx.dataVerification.dataRegulation.value1 = "";
                                            ctx.dataVerification.dataRegulation.value2 = "";
                                        });
                                    }, children: ["identificationNumber", "phoneNumber"].map((v) => (_jsx("option", { value: v, children: dataVerification[v] }, v))) }) }))] }), _jsxs("div", { className: "box-item", children: [
                            // (["remote", "prohibitInput", "hintShow"] as const)
                            ["prohibitInput", "hintShow"].map((v) => (_jsxs("div", { className: "check", children: [_jsx("input", { type: "checkbox", id: v, checked: context.dataVerification.dataRegulation[v], onChange: () => {
                                            setContext((ctx) => {
                                                const dataRegulation = ctx.dataVerification?.dataRegulation;
                                                // if (v === "remote") {
                                                //   dataRegulation!.remote = !dataRegulation!.remote;
                                                // } else
                                                if (v === "prohibitInput") {
                                                    dataRegulation.prohibitInput =
                                                        !dataRegulation.prohibitInput;
                                                }
                                                else if (v === "hintShow") {
                                                    dataRegulation.hintShow = !dataRegulation.hintShow;
                                                }
                                            });
                                        } }, `input${v}`), _jsx("label", { htmlFor: v, children: dataVerification[v] }, `label${v}`)] }, `div${v}`))), context.dataVerification?.dataRegulation?.hintShow && (_jsx("div", { className: "input-box", children: _jsx("input", { type: "text", style: { width: "100%" }, placeholder: dataVerification.placeholder5, value: context.dataVerification.dataRegulation.hintValue, onChange: (e) => {
                                        const { value } = e.target;
                                        setContext((ctx) => {
                                            ctx.dataVerification.dataRegulation.hintValue = value;
                                        });
                                    } }) }))] })] }), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                    // hideDialog();
                    btn("confirm");
                }, tabIndex: 0, children: button.confirm }), _jsx("div", { className: "button-basic button-close", onClick: () => {
                    btn("delete");
                }, tabIndex: 0, children: dataVerification.deleteVerification }), _jsx("div", { className: "button-basic button-close", onClick: () => {
                    btn("close");
                }, tabIndex: 0, children: button.cancel })] }));
};
export default DataVerification;
