import { type KeyboardEvent, type ReactElement, useState } from 'react'
import type { IAthlete } from 'types'
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Typography
} from '@mui/material'
import { useAppDispatch } from '../../app/hooks'
import { setWinner } from '../../features/battle/battleSlice'

const PREFERRED_IMAGE_WIDTH = 384
const MOBILE_PADDING = 16
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9

interface Properties {
	athlete: IAthlete
}

export default function AthleteBattleCard({
	athlete
}: Properties): ReactElement {
	const [isSelected, setIsSelected] = useState<boolean>(false)
	const dispatch = useAppDispatch()

	function onCardClick(): void {
		if (isSelected) {
			setIsSelected(false)
		} else {
			setIsSelected(true)
			dispatch(setWinner(athlete))
		}
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			onCardClick()
		}
	}
	const imageWidth = Math.min(
		PREFERRED_IMAGE_WIDTH,
		window.innerWidth - MOBILE_PADDING
	)
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT)
	return (
		<Card
			sx={{
				maxWidth: imageWidth,
				border: isSelected ? 'solid blue' : 'solid transparent'
			}}
		>
			<CardActionArea onClick={onCardClick} onKeyDown={onKeyDown}>
				<CardMedia
					component='img'
					sx={{
						width: imageWidth,
						height: imageHeight,
						backgroundColor: athlete.image.color
					}}
					image={athlete.image.url}
					title='green iguana'
					alt={athlete.name}
				/>
				<CardContent>
					<Typography gutterBottom variant='h3'>
						{athlete.name} {athlete.surname}
					</Typography>
				</CardContent>
				<CardActions />
			</CardActionArea>
		</Card>
	)
}
