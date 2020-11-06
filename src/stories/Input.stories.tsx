import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Input, InputProps} from '../components/Input/input';

export default {
  title: 'Input',
  component: Input,
  argTypes: {},
} as Meta;

const Template: Story<InputProps> = (args) => <Input {...args}></Input>

export const input = Template.bind({});
input.args = {
  style: {
    width:'300px'
  },
  placeholder: 'placeholder',
  onChange: (e) => {console.log(e)}
};

export const 被禁用的Input = Template.bind({});
被禁用的Input.args = {
  style: {
    width:'300px'
  },
  placeholder: 'disabled input',
  disabled: true
};

export const 带图标的Input = Template.bind({});
带图标的Input.args = {
  style: {
    width:'300px'
  },
  placeholder: 'input with ico',
  icon: "search"
};

export const 不同大小的Input = Template.bind({});
不同大小的Input.args = {
  style: {
    width:'300px'
  },
  placeholder: 'large size',
  size: "lg"
};

export const 带前后缀的Input = Template.bind({});
带前后缀的Input.args = {
  style: {
    width:'300px'
  },
  defaultValue: "google",
  prepend: "https://",
  append: ".com"
};


