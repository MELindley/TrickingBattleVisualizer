import type { IAthlete } from 'app/types'

export default async function getAthletes(): Promise<IAthlete[]> {
	const response = await fetch(
		'https://66afc46fb05db47acc5ab941.mockapi.io/athletes'
	)
	return response.json() as Promise<IAthlete[]>
}
