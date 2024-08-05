import { type KeyboardEvent, type ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IAthlete } from 'types'
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Typography
} from '@mui/material'
import { useAppDispatch } from 'app/hooks'
import { addAthlete, removeAthlete } from '../features/battle/battleSlice'

const PREFERRED_IMAGE_WIDTH = 384
const MOBILE_PADDING = 16
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9

interface Properties {
	athlete: IAthlete
}

export default function AthleteCard({ athlete }: Properties): ReactElement {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [isSelected, setIsSelected] = useState<boolean>(false)

	function onDetailButtonClick(): void {
		window.scrollTo(0, 0)
		navigate(athlete.name.toLowerCase())
	}

	function onCardClick(): void {
		if (isSelected) {
			dispatch(removeAthlete(athlete))
			setIsSelected(false)
		} else {
			dispatch(addAthlete(athlete))
			setIsSelected(true)
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
					<Typography gutterBottom variant='h3' component='div'>
						{athlete.name} {athlete.surname}
					</Typography>
				</CardContent>
				<CardActions>
					<Button
						onClick={onDetailButtonClick}
						variant='outlined'
						className='m-auto'
					>
						Details
					</Button>
				</CardActions>
			</CardActionArea>
		</Card>
	)
}
