import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { locale, searchAll, searchNext, normalizeSelection, onSearchDialogMoveStart, replace, replaceAll, scrollToHighlightCell, } from "@nde-sheet/core";
import produce from "immer";
import { useContext, useState, useCallback } from "react";
import _ from "lodash";
import WorkbookContext from "../../context";
import SVGIcon from "../SVGIcon";
import { useAlert } from "../../hooks/useAlert";
import "./index.css";
const SearchReplace = ({ getContainer }) => {
    const { context, setContext, refs } = useContext(WorkbookContext);
    const { findAndReplace, button } = locale(context);
    const [searchText, setSearchText] = useState("");
    const [replaceText, setReplaceText] = useState("");
    const [showReplace, setShowReplace] = useState(context.showReplace);
    const [searchResult, setSearchResult] = useState([]);
    const [selectedCell, setSelectedCell] = useState();
    const { showAlert } = useAlert();
    const [checkMode, checkModeReplace] = useState({
        regCheck: false,
        wordCheck: false,
        caseCheck: false,
    });
    const closeDialog = useCallback(() => {
        _.set(refs.globalCache, "searchDialog.mouseEnter", false);
        setContext((draftCtx) => {
            draftCtx.showSearch = false;
            draftCtx.showReplace = false;
        });
    }, [refs.globalCache, setContext]);
    const setCheckMode = useCallback((mode, value) => checkModeReplace(produce((draft) => {
        _.set(draft, mode, value);
    })), []);
    const getInitialPosition = useCallback((container) => {
        const rect = container.getBoundingClientRect();
        return {
            left: (rect.width - 500) / 2,
            top: (rect.height - 200) / 3,
        };
    }, []);
    return (_jsx("div", { id: "fortune-search-replace", className: "fortune-search-replace fortune-dialog", style: getInitialPosition(getContainer()), onMouseEnter: () => {
            _.set(refs.globalCache, "searchDialog.mouseEnter", true);
        }, onMouseLeave: () => {
            _.set(refs.globalCache, "searchDialog.mouseEnter", false);
        }, onMouseDown: (e) => {
            const { nativeEvent } = e;
            onSearchDialogMoveStart(refs.globalCache, nativeEvent, getContainer());
            e.stopPropagation();
        }, children: _jsxs("div", { className: "container", onMouseDown: (e) => e.stopPropagation(), children: [_jsx("div", { className: "icon-close fortune-modal-dialog-icon-close", onClick: closeDialog, tabIndex: 0, children: _jsx(SVGIcon, { name: "close", style: { padding: 7, cursor: "pointer" } }) }), _jsxs("div", { className: "tabBox", children: [_jsx("span", { id: "searchTab", className: showReplace ? "" : "on", onClick: () => setShowReplace(false), tabIndex: 0, children: findAndReplace.find }), _jsx("span", { id: "replaceTab", className: showReplace ? "on" : "", onClick: () => setShowReplace(true), tabIndex: 0, children: findAndReplace.replace })] }), _jsxs("div", { className: "ctBox", children: [_jsxs("div", { className: "row", children: [_jsxs("div", { className: "inputBox", children: [_jsxs("div", { className: "textboxs", id: "searchInput", children: [findAndReplace.findTextbox, "\uFF1A", _jsx("input", { className: "formulaInputFocus", 
                                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                                    autoFocus: true, spellCheck: "false", onKeyDown: (e) => e.stopPropagation(), value: searchText, onChange: (e) => setSearchText(e.target.value) })] }), showReplace && (_jsxs("div", { className: "textboxs", id: "replaceInput", children: [findAndReplace.replaceTextbox, "\uFF1A", _jsx("input", { className: "formulaInputFocus", spellCheck: "false", onKeyDown: (e) => e.stopPropagation(), value: replaceText, onChange: (e) => setReplaceText(e.target.value) })] }))] }), _jsxs("div", { className: "checkboxs", children: [_jsxs("div", { id: "regCheck", children: [_jsx("input", { type: "checkbox", onChange: (e) => setCheckMode("regCheck", e.target.checked) }), _jsx("span", { children: findAndReplace.regexTextbox })] }), _jsxs("div", { id: "wordCheck", children: [_jsx("input", { type: "checkbox", onChange: (e) => setCheckMode("wordCheck", e.target.checked) }), _jsx("span", { children: findAndReplace.wholeTextbox })] }), _jsxs("div", { id: "caseCheck", children: [_jsx("input", { type: "checkbox", onChange: (e) => setCheckMode("caseCheck", e.target.checked) }), _jsx("span", { children: findAndReplace.distinguishTextbox })] })] })] }), _jsxs("div", { className: "btnBox", children: [showReplace && (_jsxs(_Fragment, { children: [_jsx("div", { id: "replaceAllBtn", className: "fortune-message-box-button button-default", onClick: () => {
                                                setContext((draftCtx) => {
                                                    setSelectedCell(undefined);
                                                    const alertMsg = replaceAll(draftCtx, searchText, replaceText, checkMode);
                                                    showAlert(alertMsg);
                                                });
                                            }, tabIndex: 0, children: findAndReplace.allReplaceBtn }), _jsx("div", { id: "replaceBtn", className: "fortune-message-box-button button-default", onClick: () => setContext((draftCtx) => {
                                                setSelectedCell(undefined);
                                                const alertMsg = replace(draftCtx, searchText, replaceText, checkMode);
                                                if (alertMsg != null) {
                                                    showAlert(alertMsg);
                                                }
                                            }), tabIndex: 0, children: findAndReplace.replaceBtn })] })), _jsx("div", { id: "searchAllBtn", className: "fortune-message-box-button button-default", onClick: () => setContext((draftCtx) => {
                                        setSelectedCell(undefined);
                                        if (!searchText)
                                            return;
                                        const res = searchAll(draftCtx, searchText, checkMode);
                                        setSearchResult(res);
                                        if (_.isEmpty(res))
                                            showAlert(findAndReplace.noFindTip);
                                    }), tabIndex: 0, children: findAndReplace.allFindBtn }), _jsx("div", { id: "searchNextBtn", className: "fortune-message-box-button button-default", onClick: () => setContext((draftCtx) => {
                                        setSearchResult([]);
                                        const alertMsg = searchNext(draftCtx, searchText, checkMode);
                                        if (alertMsg != null)
                                            showAlert(alertMsg);
                                    }), tabIndex: 0, children: findAndReplace.findBtn })] })] }), _jsx("div", { className: "close-button fortune-message-box-button button-default", onClick: closeDialog, tabIndex: 0, children: button.close }), searchResult.length > 0 && (_jsxs("div", { id: "searchAllbox", children: [_jsxs("div", { className: "boxTitle", children: [_jsx("span", { children: findAndReplace.searchTargetSheet }), _jsx("span", { children: findAndReplace.searchTargetCell }), _jsx("span", { children: findAndReplace.searchTargetValue })] }), _jsx("div", { className: "boxMain", children: searchResult.map((v) => {
                                return (_jsxs("div", { className: `boxItem ${_.isEqual(selectedCell, { r: v.r, c: v.c }) ? "on" : ""}`, onClick: () => {
                                        setContext((draftCtx) => {
                                            draftCtx.luckysheet_select_save = normalizeSelection(draftCtx, [
                                                {
                                                    row: [v.r, v.r],
                                                    column: [v.c, v.c],
                                                },
                                            ]);
                                            scrollToHighlightCell(draftCtx, v.r, v.c);
                                        });
                                        setSelectedCell({ r: v.r, c: v.c });
                                    }, tabIndex: 0, children: [_jsx("span", { children: v.sheetName }), _jsx("span", { children: v.cellPosition }), _jsx("span", { children: v.value })] }, v.cellPosition));
                            }) })] }))] }) }));
};
export default SearchReplace;
