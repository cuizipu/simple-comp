import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
  title: 'Welcome'
} as Meta;

const Template: Story = () => (
  <>
    <h1>欢迎来到 simple-comp 组件库</h1>
    <h3>安装试试</h3>
    <code>
      yarn add simple-comp --save
    </code>
  </>
)


export const Welcome = Template.bind({});


