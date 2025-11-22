import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SVGIcon from "../SVGIcon";
const Button = ({ tooltip, onClick, iconId, disabled, selected, children, }) => {
    // const style: CSSProperties = { userSelect: "none" };
    return (_jsxs("div", { className: "fortune-toolbar-button fortune-toolbar-item", onClick: onClick, tabIndex: 0, "data-tips": tooltip, role: "button", "aria-label": tooltip, style: selected ? { backgroundColor: "#E7E5EB" } : {}, children: [_jsx(SVGIcon, { name: iconId, style: disabled ? { opacity: 0.3 } : {} }), tooltip && _jsx("div", { className: "fortune-tooltip", children: tooltip }), children] }));
};
export default Button;
