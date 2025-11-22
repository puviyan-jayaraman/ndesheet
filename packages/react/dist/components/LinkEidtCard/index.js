import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useState, useMemo, useCallback, useRef, useLayoutEffect, } from "react";
import { locale, saveHyperlink, removeHyperlink, replaceHtml, getRangetxt, goToLink, isLinkValid, normalizeSelection, onRangeSelectionModalMoveStart, } from "@nde-sheet/core";
import "./index.css";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
export const LinkEditCard = ({ r, c, rc, originText, originType, originAddress, isEditing, position, selectingCellRange, }) => {
    const { context, setContext, refs } = useContext(WorkbookContext);
    const [linkText, setLinkText] = useState(originText);
    const [linkAddress, setLinkAddress] = useState(originAddress);
    const [linkType, setLinkType] = useState(originType);
    const { insertLink, linkTypeList, button } = locale(context);
    const lastCell = useRef(normalizeSelection(context, [{ row: [r, r], column: [c, c] }]));
    const skipCellRangeSet = useRef(true);
    const isLinkAddressValid = isLinkValid(context, linkType, linkAddress);
    const tooltip = (_jsx("div", { className: "validation-input-tip", children: isLinkAddressValid.tooltip }));
    const hideLinkCard = useCallback(() => {
        _.set(refs.globalCache, "linkCard.mouseEnter", false);
        setContext((draftCtx) => {
            draftCtx.linkCard = undefined;
        });
    }, [refs.globalCache, setContext]);
    const setRangeModalVisible = useCallback((visible) => setContext((draftCtx) => {
        draftCtx.luckysheet_select_save = lastCell.current;
        if (draftCtx.linkCard != null)
            draftCtx.linkCard.selectingCellRange = visible;
    }), [setContext]);
    const containerEvent = useMemo(() => ({
        onMouseEnter: () => _.set(refs.globalCache, "linkCard.mouseEnter", true),
        onMouseLeave: () => _.set(refs.globalCache, "linkCard.mouseEnter", false),
        onMouseDown: (e) => e.stopPropagation(),
        onMouseMove: (e) => e.stopPropagation(),
        onMouseUp: (e) => e.stopPropagation(),
        onKeyDown: (e) => e.stopPropagation(),
        onDoubleClick: (e) => e.stopPropagation(),
    }), [refs.globalCache]);
    const renderBottomButton = useCallback((onOk, onCancel) => (_jsxs("div", { className: "button-group", children: [_jsx("div", { className: "button-basic button-default", onClick: onCancel, tabIndex: 0, children: button.cancel }), _jsx("div", { className: "button-basic button-primary", onClick: onOk, tabIndex: 0, children: button.confirm })] })), [button]);
    const renderToolbarButton = useCallback((iconId, onClick) => (_jsx("div", { className: "fortune-toolbar-button", onClick: onClick, tabIndex: 0, children: _jsx(SVGIcon, { name: iconId, style: { width: 18, height: 18 } }) })), []);
    useLayoutEffect(() => {
        setLinkAddress(originAddress);
        setLinkText(originText);
        setLinkType(originType);
    }, [rc, originAddress, originText, originType]);
    useLayoutEffect(() => {
        if (selectingCellRange) {
            skipCellRangeSet.current = true;
        }
    }, [selectingCellRange]);
    useLayoutEffect(() => {
        if (skipCellRangeSet.current) {
            skipCellRangeSet.current = false;
            return;
        }
        if (selectingCellRange) {
            const len = _.size(context.luckysheet_select_save);
            if (len > 0) {
                setLinkAddress(getRangetxt(context, context.currentSheetId, context.luckysheet_select_save[len - 1], ""));
            }
        }
    }, [context, selectingCellRange]);
    if (!isEditing) {
        return (_jsxs("div", { ...containerEvent, onKeyDown: (e) => {
                e.stopPropagation();
            }, className: "fortune-link-modify-modal link-toolbar", style: { left: position.cellLeft + 20, top: position.cellBottom }, children: [_jsx("div", { className: "link-content", onClick: () => {
                        setContext((draftCtx) => goToLink(draftCtx, r, c, linkType, linkAddress, refs.scrollbarX.current, refs.scrollbarY.current));
                    }, tabIndex: 0, children: linkType === "webpage"
                        ? insertLink.openLink
                        : replaceHtml(insertLink.goTo, { linkAddress }) }), context.allowEdit === true && _jsx("div", { className: "divider" }), context.allowEdit === true &&
                    linkType === "webpage" &&
                    renderToolbarButton("copy", () => {
                        navigator.clipboard.writeText(originAddress);
                        hideLinkCard();
                    }), context.allowEdit === true &&
                    renderToolbarButton("pencil", () => setContext((draftCtx) => {
                        if (draftCtx.linkCard != null && draftCtx.allowEdit) {
                            draftCtx.linkCard.isEditing = true;
                        }
                    })), context.allowEdit === true && _jsx("div", { className: "divider" }), context.allowEdit === true &&
                    renderToolbarButton("unlink", () => setContext((draftCtx) => {
                        _.set(refs.globalCache, "linkCard.mouseEnter", false);
                        removeHyperlink(draftCtx, r, c);
                    }))] }));
    }
    return selectingCellRange ? (_jsxs("div", { className: "fortune-link-modify-modal range-selection-modal", style: { left: position.cellLeft, top: position.cellBottom + 5 }, ..._.omit(containerEvent, ["onMouseDown", "onMouseMove", "onMouseUp"]), onMouseDown: (e) => {
            const { nativeEvent } = e;
            onRangeSelectionModalMoveStart(context, refs.globalCache, nativeEvent);
            e.stopPropagation();
        }, children: [_jsx("div", { className: "modal-icon-close", onClick: () => setRangeModalVisible(false), tabIndex: 0, children: _jsx(SVGIcon, { name: "close" }) }), _jsx("div", { className: "modal-title", children: insertLink.selectCellRange }), _jsx("input", { ...containerEvent, className: `range-selection-input ${!linkAddress || isLinkAddressValid.isValid ? "" : "error-input"}`, placeholder: insertLink.cellRangePlaceholder, onChange: (e) => setLinkAddress(e.target.value), value: linkAddress }), tooltip, _jsx("div", { className: "modal-footer", children: renderBottomButton(() => {
                    if (isLinkAddressValid.isValid)
                        setRangeModalVisible(false);
                }, () => {
                    setLinkAddress(originAddress);
                    setRangeModalVisible(false);
                }) })] })) : (_jsxs("div", { className: "fortune-link-modify-modal", style: {
            left: position.cellLeft + 20,
            top: position.cellBottom,
        }, ...containerEvent, children: [_jsxs("div", { className: "fortune-link-modify-line", children: [_jsx("div", { className: "fortune-link-modify-title", children: insertLink.linkText }), _jsx("input", { className: "fortune-link-modify-input", spellCheck: "false", 
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus: true, value: linkText, onChange: (e) => setLinkText(e.target.value) })] }), _jsxs("div", { className: "fortune-link-modify-line", children: [_jsx("div", { className: "fortune-link-modify-title", children: insertLink.linkType }), _jsx("select", { className: "fortune-link-modify-select", value: linkType, onChange: (e) => {
                            if (e.target.value === "sheet") {
                                if (!linkText) {
                                    setLinkText(context.luckysheetfile[0].name);
                                }
                                setLinkAddress(context.luckysheetfile[0].name);
                            }
                            else {
                                setLinkAddress("");
                            }
                            if (e.target.value === "cellrange")
                                setRangeModalVisible(true);
                            setLinkType(e.target.value);
                        }, children: linkTypeList.map((type) => (_jsx("option", { value: type.value, children: type.text }, type.value))) })] }), _jsxs("div", { className: "fortune-link-modify-line", children: [linkType === "webpage" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fortune-link-modify-title", children: insertLink.linkAddress }), _jsx("input", { className: `fortune-link-modify-input ${!linkAddress || isLinkAddressValid.isValid ? "" : "error-input"}`, spellCheck: "false", value: linkAddress, onChange: (e) => setLinkAddress(e.target.value) }), tooltip] })), linkType === "cellrange" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fortune-link-modify-title", children: insertLink.linkCell }), _jsx("input", { className: `fortune-link-modify-input ${!linkAddress || isLinkAddressValid.isValid ? "" : "error-input"}`, spellCheck: "false", value: linkAddress, onChange: (e) => setLinkAddress(e.target.value) }), _jsx("div", { className: "fortune-link-modify-cell-selector", onClick: () => setRangeModalVisible(true), tabIndex: 0, children: _jsx(SVGIcon, { name: "border-all" }) }), tooltip] })), linkType === "sheet" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fortune-link-modify-title", children: insertLink.linkSheet }), _jsx("select", { className: "fortune-link-modify-select", onChange: (e) => {
                                    if (!linkText)
                                        setLinkText(e.target.value);
                                    setLinkAddress(e.target.value);
                                }, value: linkAddress, children: context.luckysheetfile.map((sheet) => (_jsx("option", { value: sheet.name, children: sheet.name }, sheet.id))) }), tooltip] }))] }), _jsx("div", { className: "modal-footer", children: renderBottomButton(() => {
                    if (!isLinkAddressValid.isValid)
                        return;
                    _.set(refs.globalCache, "linkCard.mouseEnter", false);
                    setContext((draftCtx) => saveHyperlink(draftCtx, r, c, linkText, linkType, linkAddress));
                }, hideLinkCard) })] }));
};
export default LinkEditCard;
