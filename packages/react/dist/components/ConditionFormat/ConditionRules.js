import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useContext, useEffect, useState } from "react";
import "./index.css";
import { locale, setConditionRules } from "@nde-sheet/core";
import produce from "immer";
import WorkbookContext from "../../context";
import { useDialog } from "../../hooks/useDialog";
const ConditionRules = ({ type }) => {
    const { context, setContext } = useContext(WorkbookContext);
    const { hideDialog } = useDialog();
    const { conditionformat, button, protection, generalDialog } = locale(context);
    const [colorRules, setColorRules] = useState({ textColor: "#000000", cellColor: "#000000" });
    // 开启鼠标选区
    // const dataSelectRange = useCallback(
    //   (selectType: string) => {
    //     hideDialog();
    //     setContext((ctx) => {
    //       ctx.conditionRules.textColor.color = colorRules.textColor;
    //       ctx.conditionRules.cellColor.color = colorRules.cellColor;
    //       ctx.rangeDialog!.show = true;
    //       ctx.rangeDialog!.type = selectType;
    //       ctx.rangeDialog!.rangeTxt = ctx.conditionRules.rulesValue;
    //       ctx.rangeDialog!.singleSelect = true;
    //     });
    //   },
    //   [colorRules.cellColor, colorRules.textColor, hideDialog, setContext]
    // );
    const close = useCallback((closeType) => {
        if (closeType === "confirm") {
            setContext((ctx) => {
                ctx.conditionRules.textColor.color = colorRules.textColor;
                ctx.conditionRules.cellColor.color = colorRules.cellColor;
                setConditionRules(ctx, protection, generalDialog, conditionformat, ctx.conditionRules);
            });
        }
        setContext((ctx) => {
            ctx.conditionRules = {
                rulesType: "",
                rulesValue: "",
                textColor: { check: true, color: "#000000" },
                cellColor: { check: true, color: "#000000" },
                betweenValue: { value1: "", value2: "" },
                dateValue: "",
                repeatValue: "0",
                projectValue: "10",
            };
        });
        hideDialog();
    }, [
        colorRules,
        conditionformat,
        generalDialog,
        hideDialog,
        protection,
        setContext,
    ]);
    // rulesValue初始化
    useEffect(() => {
        setContext((ctx) => {
            ctx.conditionRules.rulesType = type;
            if (!ctx.rangeDialog)
                return;
            const rangeDialogType = ctx.rangeDialog.type;
            const rangeT = ctx.rangeDialog.rangeTxt;
            if (rangeDialogType === "conditionRulesbetween1") {
                ctx.conditionRules.betweenValue.value1 = rangeT;
            }
            else if (rangeDialogType === "conditionRulesbetween2") {
                ctx.conditionRules.betweenValue.value2 = rangeT;
            }
            else if (rangeDialogType.indexOf("conditionRules") >= 0) {
                ctx.conditionRules.rulesValue = rangeT;
            }
            else if (rangeDialogType === "") {
                ctx.conditionRules = {
                    rulesType: type,
                    rulesValue: "",
                    textColor: { check: true, color: "#000000" },
                    cellColor: { check: true, color: "#000000" },
                    betweenValue: { value1: "", value2: "" },
                    dateValue: "",
                    repeatValue: "0",
                    projectValue: "10",
                };
            }
            ctx.rangeDialog.type = "";
            ctx.rangeDialog.rangeTxt = "";
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsxs("div", { className: "condition-rules", children: [_jsx("div", { className: "condition-rules-title", children: conditionformat[`conditionformat_${type}`] }), _jsx("div", { className: "conditin-rules-value", children: conditionformat[`conditionformat_${type}_title`] }), (type === "greaterThan" ||
                type === "lessThan" ||
                type === "equal" ||
                type === "textContains") && (_jsx("div", { className: "condition-rules-inpbox", children: _jsx("input", { className: "condition-rules-input", type: "text", value: context.conditionRules.rulesValue, onChange: (e) => {
                        const { value } = e.target;
                        setContext((ctx) => {
                            ctx.conditionRules.rulesValue = value;
                        });
                    } }) })), type === "between" && (_jsxs("div", { className: "condition-rules-between-box", children: [_jsx("div", { className: "condition-rules-between-inpbox", children: _jsx("input", { className: "condition-rules-between-input", type: "text", value: context.conditionRules.betweenValue.value1, onChange: (e) => {
                                const { value } = e.target;
                                setContext((ctx) => {
                                    ctx.conditionRules.betweenValue.value1 = value;
                                });
                            } }) }), _jsx("span", { style: { margin: "0px 4px" }, children: conditionformat.to }), _jsx("div", { className: "condition-rules-between-inpbox", children: _jsx("input", { className: "condition-rules-between-input", type: "text", value: context.conditionRules.betweenValue.value2, onChange: (e) => {
                                const { value } = e.target;
                                setContext((ctx) => {
                                    ctx.conditionRules.betweenValue.value2 = value;
                                });
                            } }) })] })), type === "occurrenceDate" && (_jsx("div", { className: "condition-rules-inpbox", children: _jsx("input", { type: "date", className: "condition-rules-date", value: context.conditionRules.dateValue, onChange: (e) => {
                        const { value } = e.target;
                        setContext((ctx) => {
                            ctx.conditionRules.dateValue = value;
                        });
                    } }) })), type === "duplicateValue" && (_jsxs("select", { className: "condition-rules-select", onChange: (e) => {
                    const { value } = e.target;
                    setContext((ctx) => {
                        ctx.conditionRules.repeatValue = value;
                    });
                }, children: [_jsx("option", { value: "0", children: conditionformat.duplicateValue }), _jsx("option", { value: "1", children: conditionformat.uniqueValue })] })), (type === "top10" ||
                type === "top10_percent" ||
                type === "last10" ||
                type === "last10_percent") && (_jsxs("div", { className: "condition-rules-project-box", children: [type === "top10" || type === "top10_percent"
                        ? conditionformat.top
                        : conditionformat.last, _jsx("input", { className: "condition-rules-project-input", type: "number", value: context.conditionRules.projectValue, onChange: (e) => {
                            const { value } = e.target;
                            setContext((ctx) => {
                                ctx.conditionRules.projectValue = value;
                            });
                        } }), type === "top10" || type === "last10"
                        ? conditionformat.oneself
                        : "%"] })), _jsx("div", { className: "condition-rules-set-title", children: `${conditionformat.setAs}：` }), _jsxs("div", { className: "condition-rules-setbox", children: [_jsx("div", { className: "condition-rules-set", children: _jsxs("div", { className: "condition-rules-color", children: [_jsx("input", { id: "checkTextColor", type: "checkbox", className: "condition-rules-check", checked: context.conditionRules.textColor.check, onChange: (e) => {
                                        const { checked } = e.target;
                                        setContext((ctx) => {
                                            ctx.conditionRules.textColor.check = checked;
                                        });
                                    } }), _jsx("label", { htmlFor: "checkTextColor", className: "condition-rules-label", children: conditionformat.textColor }), _jsx("input", { type: "color", className: "condition-rules-select-color", value: colorRules.textColor, onChange: (e) => {
                                        const { value } = e.target;
                                        setColorRules(produce((draft) => {
                                            draft.textColor = value;
                                        }));
                                    } })] }) }), _jsx("div", { className: "condition-rules-set", children: _jsxs("div", { className: "condition-rules-color", children: [_jsx("input", { id: "checkCellColor", type: "checkbox", className: "condition-rules-check", checked: context.conditionRules.cellColor.check, onChange: (e) => {
                                        const { checked } = e.target;
                                        setContext((ctx) => {
                                            ctx.conditionRules.cellColor.check = checked;
                                        });
                                    } }), _jsx("label", { htmlFor: "checkCellColor", className: "condition-rules-label", children: conditionformat.cellColor }), _jsx("input", { type: "color", className: "condition-rules-select-color", value: colorRules.cellColor, onChange: (e) => {
                                        const { value } = e.target;
                                        setColorRules(produce((draft) => {
                                            draft.cellColor = value;
                                        }));
                                    } })] }) })] }), _jsx("div", { className: "button-basic button-primary", onClick: () => {
                    // hideDialog();
                    close("confirm");
                }, tabIndex: 0, children: button.confirm }), _jsx("div", { className: "button-basic button-close", onClick: () => {
                    // hideDialog();
                    close("close");
                }, tabIndex: 0, children: button.cancel })] }));
};
export default ConditionRules;
