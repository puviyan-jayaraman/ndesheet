import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SVGIcon from "../SVGIcon";
const Select = ({ children, style }) => {
    return (_jsx("div", { className: "fortune-toolbar-select", style: style, children: children }));
};
const Option = ({ iconId, onClick, children, onMouseLeave, onMouseEnter, }) => {
    return (_jsxs("div", { onClick: onClick, tabIndex: 0, className: "fortune-toolbar-select-option", onMouseLeave: (e) => onMouseLeave?.(e), onMouseEnter: (e) => onMouseEnter?.(e), children: [iconId && _jsx(SVGIcon, { name: iconId }), _jsx("div", { className: "fortuen-toolbar-text", children: children })] }));
};
export { Option };
export default Select;
