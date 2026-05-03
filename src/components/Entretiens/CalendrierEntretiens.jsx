import React, { useState } from "react";
import PropTypes from "prop-types";

const DAYS_OF_WEEK = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function InterviewCalendar({
  events,
  currentMonth,
  currentYear,
  onEventClick,
}) {
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const getDaysInMonth = function (m, y) {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = function (m, y) {
    return new Date(y, m, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const daysInPrevMonth = getDaysInMonth(month - 1, year);

  const handlePrevMonth = function () {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = function () {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = function () {
    setMonth(currentMonth);
    setYear(currentYear);
  };

  const getEventsForDay = function (day) {
    return events.filter(function (e) {
      return e.day === day && e.month === month && e.year === year;
    });
  };

  const renderCalendarDays = function () {
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push(
        <div
          key={"prev-" + i}
          className="min-h-[80px] xl:min-h-[90px] border-t border-border p-2 opacity-30"
        >
          <span className="font-body text-sm text-text-muted">
            {daysInPrevMonth - i}
          </span>
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = dayEvents.some(function (event) {
        return event.isToday;
      });

      cells.push(
        <div
          key={day}
          className={
            "min-h-[80px] xl:min-h-[90px] border-t border-border p-2 transition-colors duration-150 hover:bg-bg-soft/50 " +
            (isToday ? "bg-primary/5" : "")
          }
        >
          <span
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded-lg font-body text-sm " +
              (isToday
                ? "bg-primary font-bold text-white"
                : "font-medium text-text-primary")
            }
          >
            {day}
          </span>

          {dayEvents.map(function (event, idx) {
            return (
              <div
                key={day + "-" + idx + "-" + event.time + "-" + event.title}
                onClick={function () {
                  if (onEventClick) {
                    onEventClick(event);
                  }
                }}
                className={
                  "group mt-2 cursor-pointer rounded-lg p-2 transition-all duration-150 hover:scale-[1.02] " +
                  (event.isToday
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : event.color === "primary"
                      ? "border-l-2 border-primary bg-primary-light text-primary"
                      : "border-l-2 border-secondary bg-secondary-light text-secondary")
                }
              >
                <p className="truncate font-body text-xs font-semibold">
                  {event.title}
                </p>
                <p
                  className={
                    "font-body text-[10px] " +
                    (event.isToday ? "opacity-80" : "opacity-70")
                  }
                >
                  {event.time}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(
        <div
          key={"next-" + i}
          className="min-h-[80px] xl:min-h-[90px] border-t border-border p-2 opacity-30"
        >
          <span className="font-body text-sm text-text-muted">{i}</span>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-4 lg:p-6 shadow-sm">
      <div className="mb-4 lg:mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-bg-soft hover:text-text-primary"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_left
            </span>
          </button>
          <h2 className="min-w-[180px] text-center font-display text-xl font-bold tracking-tight text-text-primary">
            {MONTHS[month]} {year}
          </h2>
          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-bg-soft hover:text-text-primary"
          >
            <span className="material-symbols-outlined text-xl">
              chevron_right
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleToday}
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 font-body text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          <span className="material-symbols-outlined text-base">today</span>
          Aujourd'hui
        </button>
      </div>

      <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-border">
        {DAYS_OF_WEEK.map(function (day) {
          return (
            <div
              key={day}
              className="bg-bg-soft py-3 text-center font-body text-xs font-semibold uppercase tracking-wider text-text-muted"
            >
              {day}
            </div>
          );
        })}
        {renderCalendarDays()}
      </div>
    </div>
  );
}

InterviewCalendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      color: PropTypes.oneOf(["primary", "secondary"]).isRequired,
      isToday: PropTypes.bool,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      entretien: PropTypes.object,
    })
  ).isRequired,
  currentMonth: PropTypes.number.isRequired,
  currentYear: PropTypes.number.isRequired,
  onEventClick: PropTypes.func,
};

InterviewCalendar.defaultProps = {
  onEventClick: null,
};
