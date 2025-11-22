import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { locale } from "@nde-sheet/core";
import { useContext } from "react";
import WorkbookContext from "../../../context";
import "./index.css";
const FormulaHint = (props) => {
    const { context } = useContext(WorkbookContext);
    const { formulaMore } = locale(context);
    if (!context.functionHint)
        return null;
    const fn = context.formulaCache.functionlistMap[context.functionHint];
    if (!fn)
        return null;
    return (_jsxs("div", { ...props, id: "luckysheet-formula-help-c", className: "luckysheet-formula-help-c", children: [_jsx("div", { className: "luckysheet-formula-help-close", title: "\u5173\u95ED", children: _jsx("i", { className: "fa fa-times", "aria-hidden": "true" }) }), _jsx("div", { className: "luckysheet-formula-help-collapse", title: "\u6536\u8D77", children: _jsx("i", { className: "fa fa-angle-up", "aria-hidden": "true" }) }), _jsx("div", { className: "luckysheet-formula-help-title", children: _jsxs("div", { className: "luckysheet-formula-help-title-formula", children: [_jsx("span", { className: "luckysheet-arguments-help-function-name", children: fn.n }), _jsx("span", { className: "luckysheet-arguments-paren", children: "(" }), _jsx("span", { className: "luckysheet-arguments-parameter-holder", children: fn.p.map((param, i) => {
                                let { name } = param;
                                if (param.repeat === "y") {
                                    name += ", ...";
                                }
                                if (param.require === "o") {
                                    name = `[${name}]`;
                                }
                                return (_jsxs("span", { className: "luckysheet-arguments-help-parameter", dir: "auto", children: [name, i !== fn.p.length - 1 && ", "] }, name));
                            }) }), _jsx("span", { className: "luckysheet-arguments-paren", children: ")" })] }) }), _jsxs("div", { className: "luckysheet-formula-help-content", children: [_jsxs("div", { className: "luckysheet-formula-help-content-example", children: [_jsx("div", { className: "luckysheet-arguments-help-section-title", children: formulaMore.helpExample }), _jsxs("div", { className: "luckysheet-arguments-help-formula", children: [_jsx("span", { className: "luckysheet-arguments-help-function-name", children: fn.n }), _jsx("span", { className: "luckysheet-arguments-paren", children: "(" }), _jsx("span", { className: "luckysheet-arguments-parameter-holder", children: fn.p.map((param, i) => (_jsxs("span", { className: "luckysheet-arguments-help-parameter", dir: "auto", children: [param.example, i !== fn.p.length - 1 && ", "] }, param.name))) }), _jsx("span", { className: "luckysheet-arguments-paren", children: ")" })] })] }), _jsx("div", { className: "luckysheet-formula-help-content-detail", children: _jsxs("div", { className: "luckysheet-arguments-help-section", children: [_jsx("div", { className: "luckysheet-arguments-help-section-title luckysheet-arguments-help-parameter-name", children: formulaMore.helpAbstract }), _jsx("span", { className: "luckysheet-arguments-help-parameter-content", children: fn.d })] }) }), _jsx("div", { className: "luckysheet-formula-help-content-param", children: fn.p.map((param) => (_jsxs("div", { className: "luckysheet-arguments-help-section", children: [_jsxs("div", { className: "luckysheet-arguments-help-section-title", children: [param.name, param.repeat === "y" && (_jsxs("span", { className: "luckysheet-arguments-help-argument-info", children: ["...-", formulaMore.allowRepeatText] })), param.require === "o" && (_jsxs("span", { className: "luckysheet-arguments-help-argument-info", children: ["-[", formulaMore.allowOptionText, "]"] }))] }), _jsx("span", { className: "luckysheet-arguments-help-parameter-content", children: param.detail })] }, param.name))) })] }), _jsx("div", { className: "luckysheet-formula-help-foot" })] }));
};
export default FormulaHint;
