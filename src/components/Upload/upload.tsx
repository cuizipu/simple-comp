import React, { FC, ChangeEvent, useState, useRef } from 'react'
import axios from 'axios'
import UploadList from './uploadList'
import Dragger from './dragger'

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadStatus;
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}

export interface UploadProps {
  /** 默认 active 的菜单项的索引值 */
  action: string;
  defaultFileList?: UploadFile[];
  /**	上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传。 */
  beforeUpload?: (file: File) => boolean | Promise<File>;
  /** 文件上传时的钩子 */
  onProgress?: (percentage: number, file: File) => void;
  /** 文件上传成功时的钩子 */
  onSuccess?: (data: any, file: File) => void;
  /**	文件上传失败时的钩子 */
  onError?: (err: any, file: File) => void;
  /** 文件状态改变时的钩子，上传成功或者失败时都会被调用 */
  onChange?: (file: File) => void;
  /**	文件列表移除文件时的钩子 */
  onRemove?: (file: UploadFile) => void;
  /**	上传的文件字段名 */
  name?: string;
  /**	设置上传的请求头部 */
  headers?: {[key: string]: any};
  /**	上传时附带的额外参数 */
  data?: {[key: string]: any};
  /**	支持发送 cookie 凭证信息 */
  withCredentials?: boolean;
  /**	接受上传的文件类型 */
  accept?: string;
  /**	是否支持多选文件 */
  multiple?: boolean;
  /**	是否支持拖拽上传 */
  drag?: boolean;
}

/**
 * 通过点击或者拖拽上传文件
 *
 * ~~~js
 * import { Upload } from 'simple-comp'
 * ~~~
 */
export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    drag,
    children
  } = props;
  const fileInput = useRef<HTMLInputElement>(null)
  const [ fileList, setFileList ] = useState<UploadFile[]>(defaultFileList || [])

  const handleClick = () => {
    fileInput.current && fileInput.current.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    uploadFiles(files)
    if( fileInput.current ) fileInput.current.value = ''
  }

  const handleRemove = (file: UploadFile) => {
    setFileList(prevList => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    onRemove && onRemove(file)
  }

  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files)
    postFiles.forEach(file => {
      if (!beforeUpload) {
        postFile(file)
      } else {
        const result = beforeUpload(file)
        if (result && result instanceof Promise) {
          result.then(processedFiles => {
            postFile(processedFiles)
          })
        } else if (result !== false) {
          postFile(file)
        }
      }
    })
  }

  const postFile = (file: File) => {
    let _file:UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    }
    // setFileList([_file, ...fileList])
    setFileList(prevList => {
      return [_file, ...prevList]
    })
    
    const formData = new FormData()
    formData.append(name || 'file', file)
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
    }
    axios.post(action, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials,
      onUploadProgress: p => {
        let percentage = Math.round((p.loaded * 100) / p.total) || 0;
        if (percentage < 100) {
          updateFileList(_file, { percent: percentage, status: 'uploading' })
          onProgress && onProgress(percentage, file)
        }
      }
    }).then(res => {
      updateFileList(_file, { response: res.data, status: 'success' })
      onSuccess && onSuccess(res.data, file)
    }).catch(err => {
      updateFileList(_file, { error: err, status: 'error' })
      onError && onError(err, file)
    }).finally(() => {
      onChange && onChange(file)
    })
  }

  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj}
        } else {
          return file
        }
      })
    })
  }
  return (
    <div className="upload-component">
      <div className="upload-input"
        style={{display: 'inline-block'}}
        onClick={handleClick}>

        {drag ? 
          <Dragger onFile={(files) => {uploadFiles(files)}}>
            {children}
          </Dragger>:
          children
        }
        <input
          className="file-input"
          style={{display: 'none'}}
          ref={fileInput}
          onChange={handleFileChange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>
      <UploadList
        fileList={fileList}
        onRemove={handleRemove}
      />
    </div>
  )
}

export default Upload