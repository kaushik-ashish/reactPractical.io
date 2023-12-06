import React, { useState, useEffect } from 'react';

const DateDisplay = ({ currentDate }) => (
  <div className="date-display">
    Current Date: {currentDate.toISOString().split('T')[0]}
  </div>
);

const downloadFile = (data) => {
  const myData = { ...data };

  // create file in the browser
  const fileName = 'my-file';
  const json = JSON.stringify(myData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);

  // create "a" HTML element with href to file
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName + '.json';
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

const WeekSelector = ({ loadPreviousWeek, loadNextWeek }) => (
  <div className="week-selector">
    <button onClick={loadPreviousWeek}>Previous week</button>
    <button onClick={loadNextWeek}>Next week</button>
  </div>
);

const TimezoneSelector = ({ changeTimezone }) => (
  <div className="timezone-selector">
    <label htmlFor="timezone">Select Timezone:</label>
    <select id="timezone" onChange={(e) => changeTimezone(e.target.value)}>
      <option value="UTC">UTC</option>
      <option value="America/New_York">America/New_York</option>
      <option value="IST">Indian Standard Time (IST)</option>
    </select>
  </div>
);

const CalendarRow = ({ day, timezone, setCheckboxData }) => {
  const startTime = 8 * 60; // 8 am in minutes
  const endTime = 23 * 60; // 11 pm in minutes
  const interval = 30; // Time interval in minutes

  const formatTime = (minutes) => {
    const date = new Date();
    date.setHours(0, minutes, 0, 0);
    return date.toLocaleTimeString(undefined, {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const numCheckboxes = (endTime - startTime) / interval;

  const [checkboxState, setCheckboxState] = useState({});

  useEffect(() => {
    setCheckboxData(checkboxState);
  }, [checkboxState]);

  return (
    <tr>
      <td>{day}</td>
      {Array.from({ length: numCheckboxes }, (_, index) => {
        const startSlot = startTime + index * interval;

        return (
          <td key={index * 1000}>
            <div>{formatTime(startSlot)}</div>
            <input
              checked={checkboxState[startSlot]}
              onChange={(e) => {
                setCheckboxState((state) => ({
                  ...state,
                  [startSlot]: e.target.checked,
                }));
              }}
              type="checkbox"
            />
          </td>
        );
      })}
    </tr>
  );
};

const CalendarTable = ({ daysOfWeek, timezone }) => {
  const [state, setState] = useState({});
  useEffect(() => {
    console.log('data', state);
  }, [state]);

  return (
    <>
      <table className="calendar-table">
        <tbody>
          {daysOfWeek.map((day) => (
            <CalendarRow
              setCheckboxData={(data) => {
                setState((state) => ({ ...state, ...data }));
              }}
              key={day}
              day={day}
              timezone={timezone}
            />
          ))}
        </tbody>
      </table>
      <button onClick={() => downloadFile(state)}>Download</button>
    </>
  );
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timezone, setTimezone] = useState('UTC');
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const loadPreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const loadNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const changeTimezone = (selectedTimezone) => {
    setTimezone(selectedTimezone);
  };

  return (
    <div className="calendar">
      <div className="header">
        <DateDisplay currentDate={currentDate} />
        <WeekSelector
          loadPreviousWeek={loadPreviousWeek}
          loadNextWeek={loadNextWeek}
        />
      </div>

      <TimezoneSelector changeTimezone={changeTimezone} />

      <CalendarTable daysOfWeek={daysOfWeek} timezone={timezone} />
    </div>
  );
};

export default App;
