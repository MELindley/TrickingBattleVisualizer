import type { ReactElement } from 'react'

interface Properties {
	error?: Error
}
export default function LoadingOrError({ error }: Properties): ReactElement {
	if (error) console.log(error)
	return (
		<div className='flex min-h-screen items-center justify-center'>
			<h1 className='text-xl' data-testid='LoadingOrError'>
				{error ? `${error.message} retrying...` : 'Loading...'}
			</h1>
		</div>
	)
}
LoadingOrError.defaultProps = {
	error: undefined
}
