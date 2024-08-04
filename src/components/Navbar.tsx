import { NavLink } from 'react-router-dom'
import type { ReactElement } from 'react'

export interface NavigationItem {
	name: string
	href: string
}

interface NavBarProperties {
	navigation: NavigationItem[]
}

export default function NavBar({ navigation }: NavBarProperties): ReactElement {
	return (
		<nav className='h-15 bg-white shadow'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 justify-between'>
					<div className='flex'>
						<div className='flex items-center justify-center space-x-4'>
							{navigation.map(item => (
								<div key={`navbar-item-${item.name}`}>
									<NavLink
										to='/'
										className={({ isActive, isPending }) =>
											`flex h-5 transform items-center justify-center rounded-2xl px-4 py-4 text-sm font-medium uppercase transition duration-300 ease-in-out ${isActive ? 'bg-black text-white' : (isPending ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700')}`
										}
									>
										{item.name}
									</NavLink>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
