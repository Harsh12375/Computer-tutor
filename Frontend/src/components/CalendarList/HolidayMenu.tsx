import React from 'react';
import { uniqueID } from '../../util/reusable-funcs';
import { Calendar } from '../../contexts/StoreContext/types/calendar';
import { Schedule } from '../../contexts/StoreContext/types/schedule';
import { convertExternalEventsToCalendar, convertExternalEventToSchedule, getHolidayEventsByRegion } from '../../api/holiday';

interface HolidayMenuProps {
  show: boolean;
  onClose: () => void;
  onAddCalendar: (calendarObj: Calendar, schedules: Schedule[]) => void;
}

export default function HolidayMenu({ show, onClose, onAddCalendar }: HolidayMenuProps) {
  if (!show) return null;

  const addHolidayCalendar = async (regionCode: string) => {
    onClose();
    try {
      const data = await getHolidayEventsByRegion(regionCode);
      if (!data) return;
      const calendarId = uniqueID();
      const calendarObj = convertExternalEventsToCalendar({ holidayCalendar: data, calendarId, regionCode });
      
      interface HolidayEvent {
        [key: string]: unknown;
      }
      const schedules = (data.items || []).map((evt: HolidayEvent) => {
        return convertExternalEventToSchedule({ ...evt, calendarId }) as Schedule;
      }) as Schedule[];
      
      if (schedules.length) {
        onAddCalendar(calendarObj, schedules);
      }
    } catch (error) {
      console.error('Error adding holiday calendar', error);
    }
  };

  return (
    <div className='holiday-quick-add-menu'>
      <button onClick={() => addHolidayCalendar('en.india')}>India</button>
      <button onClick={() => addHolidayCalendar('en.usa')}>USA</button>
      <button onClick={() => addHolidayCalendar('en.uk')}>UK</button>
      <button onClick={() => addHolidayCalendar('en.australia')}>Australia</button>
      <button onClick={() => addHolidayCalendar('en.ae')}>UAE</button>
    </div>
  );
}