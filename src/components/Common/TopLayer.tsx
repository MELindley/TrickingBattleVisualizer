import type { ReactElement } from 'react'
import { alpha, Box, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

interface TopLayerProperties {
	title: string
	subtitle?: string
	callToAction?: ReactElement
	imageUrl?: string
}

function TopLayer({
	title,
	subtitle,
	callToAction,
	imageUrl
}: TopLayerProperties): ReactElement {
	return (
		<Grid
			id='toplayer'
			container
			py={{ xs: 5, lg: 30 }}
			justifyContent='center'
			alignItems='center'
			sx={{
				backgroundImage: `url(${imageUrl})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center'
			}}
		>
			<Grid container sx={{ flexDirection: { xs: 'col', xl: 'row' } }}>
				<Box
					textAlign='center'
					display='flex'
					flexDirection='column'
					flexGrow={1}
					className='xl:mb-0 xl:w-1/2'
				>
					<Typography variant='h1'>{title}</Typography>
					{subtitle ? (
						<Typography
							variant='h4'
							sx={{
								p: 4,
								backgroundColor: alpha('#1f1f1f', 0.5),
								borderRadius: 1
							}}
						>
							{subtitle}
						</Typography>
					) : undefined}
					{callToAction ?? undefined}
				</Box>
			</Grid>
		</Grid>
	)
}

export default TopLayer
