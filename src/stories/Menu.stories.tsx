import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Menu, MenuProps} from '../components/Menu/menu';
import { MenuItem } from '../components/Menu/menuItem';
import { SubMenu } from '../components/Menu/subMenu';

export default {
  title: 'Menu',
  component: Menu,
  argTypes: {},
} as Meta;

const Template: Story<MenuProps> = (args) => (
  <Menu {...args} >
    <MenuItem>
      cool link
    </MenuItem>
    <MenuItem disabled>
      disabled
    </MenuItem>
    <MenuItem>
      cool link 2
    </MenuItem>
    <SubMenu title='dropdown'>
      <MenuItem>
        dropdown 1
      </MenuItem>
      <MenuItem>
        dropdown 2
      </MenuItem>
    </SubMenu>
  </Menu>
)


export const menu = Template.bind({});
// menu.args = {};


