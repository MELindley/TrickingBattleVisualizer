import type { IRenderSeedProps } from 'react-brackets'
import { Seed, SeedItem } from 'react-brackets'
import type { ReactElement } from 'react'
import AthleteCard from '../athlete/AthleteCard'
import Grid from '@mui/material/Unstable_Grid2'
import type { ISeedProps } from 'react-brackets/dist/types/Seed'
import type { IAthlete } from '../../app/types'

interface ICustomSeedProperties extends ISeedProps {
	teams: {
		name?: string
		athlete?: IAthlete
	}[]
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
				</Grid>
			</SeedItem>
		</Seed>
	)
}
