import { Box, Container, Link, Typography } from '@mui/material'
import { Facebook, Instagram, YouTube } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'
import type { ReactElement } from 'react'

export default function Footer(): ReactElement {
	return (
		<Box
			component='footer'
			sx={{
				backgroundColor: 'black',
				color: 'white',
				paddingY: 4
			}}
		>
			<Container maxWidth='lg'>
				<Grid
					container
					spacing={4}
					justifyContent='space-between'
					textAlign='center'
				>
					{/* About Section */}
					<Grid size={{ xs: 12, sm: 4 }}>
						<Typography variant='h6' fontWeight='bold'>
							About ArenaForge
						</Typography>
						<Typography variant='body2' marginTop={1} textAlign='justify'>
							ArenaForge is a powerful tool designed for managing and
							visualizing battles in competitive sports. Create brackets,
							organize events, and showcase match highlights effortlessly!
						</Typography>
					</Grid>

					{/* Links Section */}
					<Grid size={{ xs: 12, sm: 4 }}>
						<Typography variant='h6' fontWeight='bold'>
							Quick Links
						</Typography>
						<Box marginTop={1}>
							<Link href='/' color='inherit' underline='hover'>
								Home
							</Link>
						</Box>
						<Box marginTop={1}>
							<Link href='/events' color='inherit' underline='hover'>
								Events
							</Link>
						</Box>
						<Box marginTop={1}>
							<Link href='/features' color='inherit' underline='hover'>
								Features
							</Link>
						</Box>
					</Grid>

					{/* Social Media Section */}
					<Grid size={{ xs: 12, sm: 4 }}>
						<Typography variant='h6' fontWeight='bold'>
							Follow Us
						</Typography>
						<Box marginTop={1} display='flex' gap={2} justifyContent='center'>
							<Link
								href='https://www.facebook.com/ArenaForge'
								target='_blank'
								color='inherit'
							>
								<Facebook />
							</Link>
							<Link
								href='https://www.instagram.com/ArenaForge'
								target='_blank'
								color='inherit'
							>
								<Instagram />
							</Link>
							<Link
								href='https://www.youtube.com/ArenaForge'
								target='_blank'
								color='inherit'
							>
								<YouTube />
							</Link>
						</Box>
					</Grid>
				</Grid>

				{/* Copyright Section */}
				<Box marginTop={4} textAlign='center'>
					<Typography variant='body2'>
						© {new Date().getFullYear()} ArenaForge. All rights reserved.
					</Typography>
				</Box>
			</Container>
		</Box>
	)
}
