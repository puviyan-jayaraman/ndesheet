import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import _ from "lodash";
import { useContext } from "react";
import WorkbookContext from "../../../context";
import "./index.css";
const FormulaSearch = (props) => {
    const { context } = useContext(WorkbookContext);
    if (_.isEmpty(context.functionCandidates))
        return null;
    return (_jsx("div", { ...props, id: "luckysheet-formula-search-c", className: "luckysheet-formula-search-c", children: context.functionCandidates.map((v, index) => (_jsxs("div", { "data-func": v.n, className: `luckysheet-formula-search-item ${index === 0 ? "luckysheet-formula-search-item-active" : ""}`, children: [_jsx("div", { className: "luckysheet-formula-search-func", children: v.n }), _jsx("div", { className: "luckysheet-formula-search-detail", children: v.d })] }, v.n))) }));
};
export default FormulaSearch;
