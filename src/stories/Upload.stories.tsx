import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Upload, UploadProps, UploadFile } from '../components/Upload/upload';
import Button from '../components/Button/button';
import Icon from '../components/Icon/icon';

export default {
  title: 'Upload',
  component: Upload,
  argTypes: {
  },
} as Meta;

const Template: Story<UploadProps> = (args) => (
  <Upload {...args}>
    <Button
      btnType="primary"
      disabled={false}
      size="lg"
    >
      点击上传 
    </Button>
  </Upload>
)

const TemplateDrag: Story<UploadProps> = (args) => (
  <Upload {...args}>
    <Icon icon="upload" size="5x" theme="secondary" />
    <br/>
    <p>点击或拖动上传文件</p>
  </Upload>
)

const defaultFileList: UploadFile[] = [
  { uid: '123', size: 1234, name: 'uploading.md', status: 'uploading', percent: 30 },
  { uid: '122', size: 1234, name: 'success.md', status: 'success', percent: 30 },
  { uid: '121', size: 1234, name: 'error.md', status: 'error', percent: 30 }
]
// const checkFileSize = (file: File) => {
//   if (Math.round(file.size / 1024) > 50) {
//     alert('file too big')
//     return false;
//   }
//   return true;
// }
// const handleBeforeUpload = (file: File) => {
//   const newFile = new File([file], 'new_name.xlsx', {type: file.type})
//   return Promise.resolve(newFile)
// }

const handleRemove = (file: UploadFile) => {
  console.log(file)
}

export const upload = Template.bind({});
upload.args = {
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  defaultFileList: defaultFileList,
  // beforeUpload: handleBeforeUpload,
  onRemove: handleRemove,
  name: 'fileName',
  data: {'key': 'value'},
  accept: '.png',
  multiple: true
};

export const 拖动上传 = TemplateDrag.bind({});
拖动上传.args = {
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  drag: true
};
