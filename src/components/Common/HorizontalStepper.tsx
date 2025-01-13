import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { ReactElement } from 'react'

interface Properties {
	steps: string[]
	stepElements: ReactElement[]
	optionalSteps: number[]
	onFinish?: () => void
	renderFinalButtonComponent?: ReactElement
}

export default function HorizontalLinearStepper({
	steps,
	stepElements,
	optionalSteps,
	onFinish,
	renderFinalButtonComponent
}: Properties): ReactElement {
	const [activeStep, setActiveStep] = React.useState(0)
	const [skipped, setSkipped] = React.useState(new Set<number>())

	const isStepOptional = (step: number): boolean => optionalSteps.includes(step)

	const isStepSkipped = (step: number): boolean => skipped.has(step)

	const onNext = (): void => {
		window.scrollTo(0, 0)
		if (isStepSkipped(activeStep)) {
			// if this step had been skipped but is the current active step remove it from the skipped set
			setSkipped(new Set([...skipped].filter(x => x !== activeStep)))
		}
		setActiveStep(previousActiveStep => previousActiveStep + 1)
		if (activeStep === steps.length - 1 && onFinish) {
			onFinish()
		}
	}

	const onBack = (): void => {
		window.scrollTo(0, 0)
		setActiveStep(previousActiveStep => previousActiveStep - 1)
	}

	const onSkip = (): void => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.")
		}
		window.scrollTo(0, 0)
		setActiveStep(previousActiveStep => previousActiveStep + 1)
		setSkipped(skipped.add(activeStep))
	}

	const onReset = (): void => {
		setActiveStep(0)
	}

	return (
		<Box>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProperties: { completed?: boolean } = {}
					const labelProperties: {
						optional?: React.ReactNode
					} = {}
					if (isStepOptional(index)) {
						labelProperties.optional = (
							<Typography variant='caption'>Optional</Typography>
						)
					}
					if (isStepSkipped(index)) {
						stepProperties.completed = false
					}
					return (
						<Step key={label} completed={stepProperties.completed}>
							<StepLabel optional={labelProperties.optional}>{label}</StepLabel>
						</Step>
					)
				})}
			</Stepper>
			{activeStep === steps.length ? (
				<>
					<Typography sx={{ mt: 2, mb: 1 }}>
						All steps completed - you&apos;re finished
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={onReset}>Reset</Button>
					</Box>
				</>
			) : (
				<>
					{stepElements[activeStep]}
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button
							color='inherit'
							disabled={activeStep === 0}
							onClick={onBack}
							sx={{ mr: 1 }}
						>
							Back
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />
						{isStepOptional(activeStep) && (
							<Button color='inherit' onClick={onSkip} sx={{ mr: 1 }}>
								Skip
							</Button>
						)}
						{activeStep === steps.length - 1 ? (
							renderFinalButtonComponent ?? (
								<Button variant='contained' onClick={onNext}>
									Finish
								</Button>
							)
						) : (
							<Button variant='contained' onClick={onNext}>
								Next
							</Button>
						)}
					</Box>
				</>
			)}
		</Box>
	)
}
