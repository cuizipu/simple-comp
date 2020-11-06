import React, { useState } from 'react';
import classNames from 'classnames';
export var Dragger = function (props) {
    var onFile = props.onFile, children = props.children;
    var _a = useState(false), dragover = _a[0], setDragover = _a[1];
    var classes = classNames('uploader-dragger', {
        'is-dragover': dragover
    });
    var handleDrop = function (e) {
        e.preventDefault();
        setDragover(false);
        onFile(e.dataTransfer.files);
    };
    var handleDrag = function (e, over) {
        e.preventDefault();
        setDragover(over);
    };
    return (React.createElement("div", { className: classes, onDragOver: function (e) { return handleDrag(e, true); }, onDragLeave: function (e) { return handleDrag(e, false); }, onDrop: handleDrop }, children));
};
export default Dragger;
