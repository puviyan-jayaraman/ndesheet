import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useRef } from "react";
import _ from "lodash";
const ContentEditable = ({ ...props }) => {
    const lastHtml = useRef("");
    const root = useRef(null);
    const { autoFocus, initialContent, onChange } = props;
    useEffect(() => {
        if (autoFocus) {
            root.current?.focus();
        }
    }, [autoFocus]);
    // UNSAFE_componentWillUpdate
    useEffect(() => {
        if (initialContent && root.current != null) {
            root.current.innerHTML = initialContent;
        }
    }, [initialContent]);
    const fnEmitChange = useCallback((__, isBlur) => {
        let html;
        if (root.current != null) {
            html = root.current.innerHTML;
        }
        if (onChange && html !== lastHtml.current) {
            onChange(html || "", isBlur);
        }
        lastHtml.current = html || "";
    }, [root, onChange]);
    const { innerRef, onBlur } = props;
    let { allowEdit } = props;
    if (_.isNil(allowEdit))
        allowEdit = true;
    return (_jsx("div", { onDoubleClick: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation(), ..._.omit(props, "innerRef", "onChange", "html", "onBlur", "autoFocus", "allowEdit", "initialContent"), ref: (e) => {
            root.current = e;
            innerRef?.(e);
        }, tabIndex: 0, onInput: fnEmitChange, onBlur: (e) => {
            fnEmitChange(null, true);
            onBlur?.(e);
        }, contentEditable: allowEdit }));
};
export default ContentEditable;
