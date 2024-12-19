import type { IRenderSeedProps } from '@sportsgram/brackets'
import { Seed, SeedItem } from '@sportsgram/brackets'
import type { ReactElement } from 'react'
import Grid from '@mui/material/Grid2'
import type { ISeedProps } from '@sportsgram/brackets/dist/types/Seed'
import type { IAthlete } from 'app/types'
import { Typography } from '@mui/material'
import InlineAthleteCard from '../athlete/InlineAthleteCard'

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
		<Seed mobileBreakpoint={breakpoint} style={{ minWidth: 0, padding: '1em' }}>
			<SeedItem>
				<Grid container rowSpacing={1}>
					{(seed as ICustomSeedProperties).teams.map((team, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Grid size={12} key={`${seed.id}-${index}-${team.athlete?.id}`}>
							<InlineAthleteCard athlete={team.athlete} />
						</Grid>
					))}
					<Grid size={12}>
						<Typography>{seed.title}</Typography>
					</Grid>
				</Grid>
			</SeedItem>
		</Seed>
	)
}
