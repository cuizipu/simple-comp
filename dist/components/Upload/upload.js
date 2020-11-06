var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useState, useRef } from 'react';
import axios from 'axios';
import UploadList from './uploadList';
import Dragger from './dragger';
/**
 * 通过点击或者拖拽上传文件
 *
 * ~~~js
 * import { Upload } from 'simple-comp'
 * ~~~
 */
export var Upload = function (props) {
    var action = props.action, defaultFileList = props.defaultFileList, beforeUpload = props.beforeUpload, onProgress = props.onProgress, onSuccess = props.onSuccess, onError = props.onError, onChange = props.onChange, onRemove = props.onRemove, name = props.name, headers = props.headers, data = props.data, withCredentials = props.withCredentials, accept = props.accept, multiple = props.multiple, drag = props.drag, children = props.children;
    var fileInput = useRef(null);
    var _a = useState(defaultFileList || []), fileList = _a[0], setFileList = _a[1];
    var handleClick = function () {
        fileInput.current && fileInput.current.click();
    };
    var handleFileChange = function (e) {
        var files = e.target.files;
        if (!files)
            return;
        uploadFiles(files);
        if (fileInput.current)
            fileInput.current.value = '';
    };
    var handleRemove = function (file) {
        setFileList(function (prevList) {
            return prevList.filter(function (item) { return item.uid !== file.uid; });
        });
        onRemove && onRemove(file);
    };
    var uploadFiles = function (files) {
        var postFiles = Array.from(files);
        postFiles.forEach(function (file) {
            if (!beforeUpload) {
                postFile(file);
            }
            else {
                var result = beforeUpload(file);
                if (result && result instanceof Promise) {
                    result.then(function (processedFiles) {
                        postFile(processedFiles);
                    });
                }
                else if (result !== false) {
                    postFile(file);
                }
            }
        });
    };
    var postFile = function (file) {
        var _file = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file
        };
        // setFileList([_file, ...fileList])
        setFileList(function (prevList) {
            return __spreadArrays([_file], prevList);
        });
        var formData = new FormData();
        formData.append(name || 'file', file);
        if (data) {
            Object.keys(data).forEach(function (key) {
                formData.append(key, data[key]);
            });
        }
        axios.post(action, formData, {
            headers: __assign(__assign({}, headers), { 'Content-Type': 'multipart/form-data' }),
            withCredentials: withCredentials,
            onUploadProgress: function (p) {
                var percentage = Math.round((p.loaded * 100) / p.total) || 0;
                if (percentage < 100) {
                    updateFileList(_file, { percent: percentage, status: 'uploading' });
                    onProgress && onProgress(percentage, file);
                }
            }
        }).then(function (res) {
            updateFileList(_file, { response: res.data, status: 'success' });
            onSuccess && onSuccess(res.data, file);
        }).catch(function (err) {
            updateFileList(_file, { error: err, status: 'error' });
            onError && onError(err, file);
        }).finally(function () {
            onChange && onChange(file);
        });
    };
    var updateFileList = function (updateFile, updateObj) {
        setFileList(function (prevList) {
            return prevList.map(function (file) {
                if (file.uid === updateFile.uid) {
                    return __assign(__assign({}, file), updateObj);
                }
                else {
                    return file;
                }
            });
        });
    };
    return (React.createElement("div", { className: "upload-component" },
        React.createElement("div", { className: "upload-input", style: { display: 'inline-block' }, onClick: handleClick },
            drag ?
                React.createElement(Dragger, { onFile: function (files) { uploadFiles(files); } }, children) :
                children,
            React.createElement("input", { className: "file-input", style: { display: 'none' }, ref: fileInput, onChange: handleFileChange, type: "file", accept: accept, multiple: multiple })),
        React.createElement(UploadList, { fileList: fileList, onRemove: handleRemove })));
};
export default Upload;
