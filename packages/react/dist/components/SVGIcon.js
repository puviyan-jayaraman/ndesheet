import { jsx as _jsx } from "react/jsx-runtime";
const SVGIcon = ({ width = 24, height = 24, name, style }) => (_jsx("svg", { width: width, height: height, style: style, "aria-hidden": "true", children: _jsx("use", { xlinkHref: `#${name}` }) }));
export default SVGIcon;
