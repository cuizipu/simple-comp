import React, {
	useState,
	createContext,
	FC,
	CSSProperties,
	Children,
	FunctionComponentElement,
	cloneElement,
} from 'react'
import classNames from 'classnames'
import {MenuItemProps} from './menuItem'

type MenuMode = 'horizontal' | 'vertical'
type SelectCallback = (selectIndex: string) => void

export interface MenuProps {
	/**默认 active 的菜单项的索引值 */
	defaultIndex?: string
	className?: string
	/**菜单类型 横向或者纵向 */
	mode?: MenuMode
	style?: CSSProperties
	/**点击菜单项触发的回掉函数 */
	onSelect?: (selectedIndex: string) => void
	/**设置子菜单的默认打开 只在纵向模式下生效 */
	defaultOpenSubMenus?: string[]
}

interface IMenuContext {
	index: string
	mode?: MenuMode
	onSelect?: SelectCallback
	defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<IMenuContext>({index: '0'})
/**
 * 为网站提供导航功能的菜单。支持横向纵向两种模式，支持下拉菜单。
 *
 * ~~~js
 * import { Menu } from 'simple-comp'
 * ~~~
 */
export const Menu: FC<MenuProps> = (props) => {
	const {
		defaultIndex,
		className,
		mode,
		style,
		children,
		onSelect,
		defaultOpenSubMenus,
	} = props
	const [currentActive, setActive] = useState(defaultIndex)
	const classes = classNames('menu', className, {
		'menu-vertical': mode === 'vertical',
		'menu-horizontal': mode === 'horizontal',
	})
	const handleClick = (index: string) => {
		setActive(index)
		onSelect && onSelect(index)
	}
	const passedContext: IMenuContext = {
		index: currentActive ? currentActive : '0',
		onSelect: handleClick,
		mode,
		defaultOpenSubMenus,
	}
	const renderChildren = () => {
		return Children.map(children, (child, index) => {
			const childElement = child as FunctionComponentElement<
				MenuItemProps
			>
			const {displayName} = childElement.type
			if (displayName === 'MenuItem' || displayName === 'SubMenu') {
				return cloneElement(childElement, {index: index.toString()})
			} else {
				console.error('Warning')
			}
		})
	}

	return (
		<ul className={classes} style={style} data-testid="test-menu">
			<MenuContext.Provider value={passedContext}>
				{renderChildren()}
			</MenuContext.Provider>
		</ul>
	)
}
Menu.defaultProps = {
	defaultIndex: '0',
	mode: 'horizontal',
	defaultOpenSubMenus: [''],
}

export default Menu
