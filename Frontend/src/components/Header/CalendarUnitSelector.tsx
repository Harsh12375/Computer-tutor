import React from 'react';

import { useCalendarConfig, useCalendarConfigUpdater } from '../../contexts/CalendarConfigContext';
import { CalendarUnits } from '../../contexts/CalendarConfigContext/index.model';

const OPTIONS: { label: string, value: CalendarUnits }[] = [
	{ label: 'Day', value: 'day' },
	{ label: 'Week', value: 'week' },
	{ label: 'Month', value: 'month' },
	{ label: '4 Days', value: 'fourDays' },
];

export default function CalendarUnitSelector() {
	const { selectedCalendarUnit } = useCalendarConfig();
	const { setSelectedCalendarUnit } = useCalendarConfigUpdater();

	return (
		<div className='view-selector'>
			{OPTIONS.map(opt => (
				<button
					key={opt.value}
					className={`view-button ${selectedCalendarUnit === opt.value ? 'active' : ''}`}
					onClick={() => setSelectedCalendarUnit(opt.value)}
					aria-pressed={selectedCalendarUnit === opt.value}
				>
					{opt.label}
				</button>
			))}
		</div>
	)
}