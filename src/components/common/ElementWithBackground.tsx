import type { PropsWithChildren, ReactElement } from 'react'
import { youtubeVideoIdParser } from '../../app/helpers'
import { Box, Paper } from '@mui/material'

interface ElementWithBackgroundProperties {
	backgroundUrl?: string
}

export default function ElementWithBackground({
	children,
	backgroundUrl
}: PropsWithChildren<ElementWithBackgroundProperties>): ReactElement {
	// eslint-disable-next-line react/jsx-no-useless-fragment
	if (!backgroundUrl) return <>{children}</>
	const youtubeID = youtubeVideoIdParser(backgroundUrl)
	return (
		<>
			<Paper
				sx={{
					position: 'absolute',
					height: '100%',
					width: '100%',
					overflow: 'hidden',
					zIndex: -50
				}}
			>
				{youtubeID ? (
					// eslint-disable-next-line react/iframe-missing-sandbox
					<iframe
						width='1920'
						height='1080'
						src={`https://www.youtube.com/embed/${youtubeID}?controls=0&showinfo=0&mute=1&disablekb=1&fs=0&loop=1&autoplay=1&modestbranding=1&color=white&iv_load_policy=3&rel=0`}
						referrerPolicy='strict-origin-when-cross-origin'
						title='ytplayer'
						allowFullScreen
						className='fixed left-1/2 top-1/2 -z-50 h-dvh w-dvw -translate-x-1/2 -translate-y-1/2 transform'
					/>
				) : (
					<Box
						sx={{
							position: 'fixed',
							Zindex: -50,
							height: '100%',
							width: '100%',
							backgroundImage: `url(${backgroundUrl})`,
							backgroundSize: 'contain',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
							opacity: '50%'
						}}
					/>
				)}
			</Paper>
			{children}
		</>
	)
}
ElementWithBackground.defaultProps = {
	backgroundUrl: '/ArenaForgeLogo.png'
}
