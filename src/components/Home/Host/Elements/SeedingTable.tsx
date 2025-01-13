import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@mui/material'
import {
	selectTournament,
	setTournamentAthleteSeed
} from '../../../../features/tournament/tournamentSlice'
import type { ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import Grid from '@mui/material/Grid2'
import { shuffleArray } from '../../../../app/helpers'

export default function SeedingTable(): ReactElement {
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(state => selectTournament(state))

	const onRandomizeSeeds = (): void => {
		const randomSeeds = shuffleArray(tournament.athletes.length)
		for (const [index, athlete] of tournament.athletes.entries()) {
			dispatch(
				setTournamentAthleteSeed({
					athlete,
					seed: randomSeeds[index]
				})
			)
		}
	}

	return (
		<>
			<TableContainer component={Paper}>
				<Table aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Athlete</TableCell>
							<TableCell align='center'>Seed</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tournament.athletes.map((athlete, index) => (
							<TableRow
								key={athlete.id}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component='th' scope='row'>
									{`${athlete.name} ${athlete.surname}`}
								</TableCell>
								<TableCell align='center'>
									<TextField
										id={`${athlete.id}-seed`}
										label='Seed'
										value={athlete.seed ?? index + 1}
										// eslint-disable-next-line react/jsx-handler-names
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											dispatch(
												setTournamentAthleteSeed({
													athlete,
													seed: Number(event.target.value)
												})
											)
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Grid container justifyContent='center' alignItems='center'>
				<Button variant='contained' onClick={onRandomizeSeeds}>
					Randomize seeds
				</Button>
			</Grid>
		</>
	)
}
