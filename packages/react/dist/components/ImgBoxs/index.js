import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import _ from "lodash";
import { onImageMoveStart, onImageResizeStart } from "@nde-sheet/core";
import { useContext, useMemo } from "react";
import WorkbookContext from "../../context";
const ImgBoxs = () => {
    const { context, setContext, refs } = useContext(WorkbookContext);
    const activeImg = useMemo(() => {
        return _.find(context.insertedImgs, { id: context.activeImg });
    }, [context.activeImg, context.insertedImgs]);
    return (_jsxs("div", { id: "luckysheet-image-showBoxs", children: [activeImg && (_jsxs("div", { id: "luckysheet-modal-dialog-activeImage", className: "luckysheet-modal-dialog", style: {
                    padding: 0,
                    position: "absolute",
                    zIndex: 300,
                    width: activeImg.width * context.zoomRatio,
                    height: activeImg.height * context.zoomRatio,
                    left: activeImg.left * context.zoomRatio,
                    top: activeImg.top * context.zoomRatio,
                }, children: [_jsx("div", { className: "luckysheet-modal-dialog-border", style: { position: "absolute" } }), _jsx("div", { className: "luckysheet-modal-dialog-content", style: {
                            width: activeImg.width * context.zoomRatio,
                            height: activeImg.height * context.zoomRatio,
                            backgroundImage: `url(${activeImg.src})`,
                            backgroundSize: `${activeImg.width * context.zoomRatio}px ${activeImg.height * context.zoomRatio}px`,
                            backgroundRepeat: "no-repeat",
                            // context.activeImg.width * context.zoomRatio +
                            // context.activeImg.height * context.zoomRatio,
                        }, onMouseDown: (e) => {
                            const { nativeEvent } = e;
                            onImageMoveStart(context, refs.globalCache, nativeEvent);
                            e.stopPropagation();
                        } }), _jsx("div", { className: "luckysheet-modal-dialog-resize", children: ["lt", "mt", "lm", "rm", "rt", "lb", "mb", "rb"].map((v) => (_jsx("div", { className: `luckysheet-modal-dialog-resize-item luckysheet-modal-dialog-resize-item-${v}`, "data-type": v, onMouseDown: (e) => {
                                const { nativeEvent } = e;
                                onImageResizeStart(refs.globalCache, nativeEvent, v);
                                e.stopPropagation();
                            } }, v))) }), _jsxs("div", { className: "luckysheet-modal-dialog-controll", children: [_jsx("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-crop", role: "button", tabIndex: 0, "aria-label": "\u88C1\u526A", title: "\u88C1\u526A", children: _jsx("i", { className: "fa fa-pencil", "aria-hidden": "true" }) }), _jsx("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-restore", role: "button", tabIndex: 0, "aria-label": "\u6062\u590D\u539F\u56FE", title: "\u6062\u590D\u539F\u56FE", children: _jsx("i", { className: "fa fa-window-maximize", "aria-hidden": "true" }) }), _jsx("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-del", role: "button", tabIndex: 0, "aria-label": "\u5220\u9664", title: "\u5220\u9664", children: _jsx("i", { className: "fa fa-trash", "aria-hidden": "true" }) })] })] })), _jsx("div", { className: "img-list", children: context.insertedImgs?.map((v) => {
                    const { id, left, top, width, height, src } = v;
                    if (v.id === context.activeImg)
                        return null;
                    return (_jsxs("div", { id: id, className: "luckysheet-modal-dialog luckysheet-modal-dialog-image", style: {
                            width: width * context.zoomRatio,
                            height: height * context.zoomRatio,
                            padding: 0,
                            position: "absolute",
                            left: left * context.zoomRatio,
                            top: top * context.zoomRatio,
                            zIndex: 200,
                        }, onMouseDown: (e) => e.stopPropagation(), onClick: (e) => {
                            setContext((ctx) => {
                                ctx.activeImg = id;
                            });
                            e.stopPropagation();
                        }, tabIndex: 0, children: [_jsx("div", { className: "luckysheet-modal-dialog-content", style: {
                                    width: "100%",
                                    height: "100%",
                                    overflow: "hidden",
                                    position: "relative",
                                }, children: _jsx("img", { src: src, alt: "", style: {
                                        width: width * context.zoomRatio,
                                        height: height * context.zoomRatio,
                                    } }) }), _jsx("div", { className: "luckysheet-modal-dialog-border" })] }, id));
                }) }), _jsxs("div", { id: "luckysheet-modal-dialog-cropping", className: "luckysheet-modal-dialog", style: {
                    display: "none",
                    padding: 0,
                    position: "absolute",
                    zIndex: 300,
                }, children: [_jsx("div", { className: "cropping-mask" }), _jsx("div", { className: "cropping-content" }), _jsx("div", { className: "luckysheet-modal-dialog-border", style: { position: "absolute" } }), _jsxs("div", { className: "luckysheet-modal-dialog-resize", children: [_jsx("div", { className: "resize-item lt", "data-type": "lt" }), _jsx("div", { className: "resize-item mt", "data-type": "mt" }), _jsx("div", { className: "resize-item lm", "data-type": "lm" }), _jsx("div", { className: "resize-item rm", "data-type": "rm" }), _jsx("div", { className: "resize-item rt", "data-type": "rt" }), _jsx("div", { className: "resize-item lb", "data-type": "lb" }), _jsx("div", { className: "resize-item mb", "data-type": "mb" }), _jsx("div", { className: "resize-item rb", "data-type": "rb" })] }), _jsxs("div", { className: "luckysheet-modal-dialog-controll", children: [_jsx("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-crop", role: "button", tabIndex: 0, "aria-label": "\u88C1\u526A", title: "\u88C1\u526A", children: _jsx("i", { className: "fa fa-pencil", "aria-hidden": "true" }) }), _jsx("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-restore", role: "button", tabIndex: 0, "aria-label": "\u6062\u590D\u539F\u56FE", title: "\u6062\u590D\u539F\u56FE", children: _jsx("i", { className: "fa fa-window-maximize", "aria-hidden": "true" }) }), _jsx("span", { className: "luckysheet-modal-controll-btn luckysheet-modal-controll-del", role: "button", tabIndex: 0, "aria-label": "\u5220\u9664", title: "\u5220\u9664", children: _jsx("i", { className: "fa fa-trash", "aria-hidden": "true" }) })] })] }), _jsx("div", { className: "cell-date-picker" })] }));
};
export default ImgBoxs;
