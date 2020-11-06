import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { Button, ButtonProps } from '../components/Button/button';

export default {
  title: 'Button',
  component: Button,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} > button </Button>;

const buttonWithSize: Story<ButtonProps> = () => (
  <>
    <Button size="lg"> large button </Button>
    <Button size="sm"> small button </Button>
  </>
)

const buttonWithType: Story<ButtonProps> = () => (
  <>
    <Button btnType="primary"> primary button </Button>
    <Button btnType="danger"> danger button </Button>
    <Button btnType="link" href="https://google.com"> link button </Button>
  </>
)


export const button = Template.bind({});
// Button.args = {};

export const 不同尺寸的Button = buttonWithSize.bind({});

export const 不同类型的Button = buttonWithType.bind({});

