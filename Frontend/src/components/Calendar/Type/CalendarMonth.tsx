import React from 'react';
import { getMonth } from '../../../util/calendar-arrangement';
import './calendar-month.scss';

import MonthDayCell from './MonthDayCell';

export default function CalendarMonth(): JSX.Element {
  const matrix = getMonth(); // 6x7 matrix of dayjs objects

  return (
    <div className='calendar-card'>
      <div className='calendar-month'>
        <div className='calendar-month__header row'>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className='calendar-month__weekday'>{d}</div>
          ))}
        </div>
        <div className='calendar-month__grid'>
          {matrix.flat().map((dayObj, idx) => (
            <MonthDayCell key={`month-day-${idx}`} dayObj={dayObj} />
          ))}
        </div>
      </div>
    </div>
  )
}
