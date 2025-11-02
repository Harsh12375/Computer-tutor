import React from 'react';
import { Dayjs } from 'dayjs';
import { useStore } from '../../../contexts/StoreContext';
import { Event } from '../../../contexts/StoreContext/types/schedule';
import { useCalendarConfigUpdater } from '../../../contexts/CalendarConfigContext';
import { useAppConfigUpdater } from '../../../contexts/AppConfigContext';
import { convertDateUnitsToString } from '../../../util/calendar-arrangement';

interface Props {
  dayObj: Dayjs
}

export default function MonthDayCell({ dayObj }: Props) {
  const { filteredSchedules } = useStore();
  const dayKey = dayObj.format('YYYYMMDD');

  const eventsForDay = filteredSchedules.filter((s): s is Event => {
    if (s.type !== 'event') return false;
    return s.dateTime?.date === dayKey;
  });

  const visible = eventsForDay.slice(0, 2);
  const remaining = eventsForDay.length - visible.length;

  const { setSelectedDate, setDefaultDateTime, setIsScheduleDialogVisible, setSelectedSchedule } = useCalendarConfigUpdater();
  const { recordPosition } = useAppConfigUpdater();

  const onCellClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const year = Number(dayObj.format('YYYY'));
    const month = Number(dayObj.format('M'));
    const day = Number(dayObj.format('D'));
    recordPosition(e);
    setSelectedDate({ year, month, day });
    setDefaultDateTime({ date: convertDateUnitsToString({ year, month, day }), time: { start: -1, end: -1 } });
    setIsScheduleDialogVisible(true);
  }

  return (
    <div className='calendar-month__cell' onClick={onCellClick}>
      <div className='calendar-month__cell-date'>
        {dayObj.date()}
      </div>
      <div className='calendar-month__cell-events'>
        {visible.map(ev => {
          const event = ev as Event;
          return (
            <div
              key={event.id}
              className='calendar-month__event-pill'
              style={{ '--ev-color': event.colorOption?.value || '#1A73E8' } as React.CSSProperties}
              onClick={(e) => {
                e.stopPropagation();
                // open the dialog for existing schedule
                const year = Number(dayObj.format('YYYY'));
                const month = Number(dayObj.format('M'));
                const day = Number(dayObj.format('D'));
                setSelectedDate({ year, month, day });
                setDefaultDateTime({ date: convertDateUnitsToString({ year, month, day }), time: { start: -1, end: -1 } });
                setSelectedSchedule(event);
                setIsScheduleDialogVisible(true);
              }}
            >
              {ev.title}
            </div>
          );
        })}
        {remaining > 0 && (
          <div className='calendar-month__more'>+{remaining} more</div>
        )}
      </div>
    </div>
  )
}
