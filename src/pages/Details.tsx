import { useQuery } from '@tanstack/react-query'
import Head from 'components/Head'
import ImageAttribution from 'components/ImageAttribution'
import LoadingOrError from 'components/LoadingOrError'
import type { ReactElement } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useMediaQuery } from 'utils'
import getAthletes from '../api/getAthletes'
import NavBar from '../components/Navbar'
import { mainNavigation } from './Home'

const DESKTOP_IMAGE_WIDTH_PERCENTAGE = 0.4
const MOBILE_IMAGE_HEIGHT_PERCENTAGE = 0.3

export default function DetailsPage(): ReactElement {
	const isTabletAndUp = useMediaQuery('(min-width: 600px)')
	const { athleteName } = useParams()

	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athlete'],
		queryFn: getAthletes
	})
	if (isPending || isError) {
		return <LoadingOrError error={error as Error} />
	}

	const athlete = data.find(
		f => f.name.toLowerCase() === athleteName?.toLowerCase()
	)
	if (!athlete) {
		return <Navigate to='/' replace />
	}

	const imageWidth =
		(isTabletAndUp
			? window.innerWidth * DESKTOP_IMAGE_WIDTH_PERCENTAGE
			: window.innerWidth) * window.devicePixelRatio
	const imageHeight =
		(isTabletAndUp
			? window.innerHeight
			: window.innerHeight * MOBILE_IMAGE_HEIGHT_PERCENTAGE) *
		window.devicePixelRatio

	return (
		<>
			<Head title={athlete.name} />
			<NavBar navigation={mainNavigation} />
			<div className='flex min-h-screen flex-col items-center sm:flex-row'>
				<div className='relative'>
					<img
						data-testid='FruitImage'
						width={imageWidth}
						height={imageHeight}
						style={{
							backgroundColor: athlete.image.color
						}}
						src={athlete.image.url}
						alt={athlete.name}
					/>
					<ImageAttribution author={athlete.image.author} />
				</div>
				<div className='my-8 sm:my-0 sm:ml-16'>
					<Link data-testid='BackLink' to='/' className='flex items-center'>
						<img src='/icons/arrow-left.svg' alt='' className='h-5 w-5' />
						<span className='ml-4 text-xl'>Back</span>
					</Link>

					<h1
						data-testid='FruitName'
						className='mt-2 text-6xl font-bold sm:mt-8'
					>
						{athlete.name} {athlete.surname}
					</h1>
				</div>
			</div>
		</>
	)
}
