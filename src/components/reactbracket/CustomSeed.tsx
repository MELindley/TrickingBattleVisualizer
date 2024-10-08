import type { IRenderSeedProps } from '@sportsgram/brackets'
import { Seed, SeedItem } from '@sportsgram/brackets'
import type { ReactElement } from 'react'
import AthleteCard from '../athlete/AthleteCard'
import Grid from '@mui/material/Unstable_Grid2'
import type { ISeedProps } from '@sportsgram/brackets/dist/types/Seed'
import type { IAthlete } from '../../app/types'
import { Typography } from '@mui/material'

interface ICustomSeedProperties extends ISeedProps {
	teams: {
		name?: string
		athlete?: IAthlete
	}[]
	title?: string
}
export default function CustomSeed({
	seed,
	breakpoint
}: IRenderSeedProps): ReactElement {
	// breakpoint passed to Bracket component
	// to check if mobile view is triggered or not

	// mobileBreakpoint is required to be passed down to a seed
	return (
		<Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
			<SeedItem>
				<Grid container rowSpacing={1}>
					{(seed as ICustomSeedProperties).teams.map(team => (
						<Grid xs={12} key={`${seed.id}-${team.name}`}>
							<AthleteCard
								athlete={team.athlete}
								isClickable={false}
								hasDetailsButton={false}
								isInLine
							/>
						</Grid>
					))}
					<Grid xs={12}>
						<Typography>{seed.title}</Typography>
					</Grid>
				</Grid>
			</SeedItem>
		</Seed>
	)
}
