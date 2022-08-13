import classNames from 'classnames';
import React, { useRef, useState } from 'react'
import { act } from 'react-dom/test-utils';
import { CalendarUtils } from '../../utils/CalendarUtils';
import styles from "./WeekCalendar.module.scss";

type WeekCalendarProps = {

}

const dayHours = CalendarUtils.getDayHours();

export default function WeekCalendar(props: WeekCalendarProps) {
    /** Day of week being shown when on mobile device */
    const [activeDayIndex, setActiveDayIndex] = useState(0);

    const weekData = useRef(CalendarUtils.weekDaysWithHours);
    const [availableHours, setAvailableHours] = useState<{ [hourIndex: number]: boolean }[]>(Array(CalendarUtils.weekDays.length).fill(null).map(() => ({})))

    const handleHourCellClick = (dayIndex: number, hourIndex: number) => {
        const isCurrentHourAvailable = availableHours[dayIndex][hourIndex];

        const newHours = [...availableHours];
        newHours[dayIndex][hourIndex] = !isCurrentHourAvailable;

        setAvailableHours(newHours)
    }

    const logHours = () => {
        const days = weekData.current;

        type TAvailability = { day: string; start: number; end: number }

        /** Array of availability objects */
        const availability: (TAvailability & { startTime: string; endTime: string })[] = [];

        /** Availability period currently being iterated on */
        let currentAvailabilityPeriod: TAvailability| null = null;

        /** Helper function for pushing modded availability object to list */
        const pushCurrentPeriod = () => {
            currentAvailabilityPeriod && availability.push({ 
                ...currentAvailabilityPeriod,
                startTime: CalendarUtils.getTimeFromHourIndex(currentAvailabilityPeriod.start),
                endTime: CalendarUtils.getTimeFromHourIndex(currentAvailabilityPeriod.end)
            })
        }

        days.forEach((day, dayIndex) => day.hours.forEach(hour => {
            const isHourAvailable = !!availableHours[dayIndex][hour.hourIndex];
            const isChainedToCurrentPeriod = isHourAvailable && !!currentAvailabilityPeriod && (hour.hourIndex === currentAvailabilityPeriod.end);
            const isFinalHourInDay = hour.hourIndex === CalendarUtils.dayEndHour;

            if (isHourAvailable && !currentAvailabilityPeriod) {
                // if hour is available and first available period, create new availability object
                currentAvailabilityPeriod = {
                    day: day.longName,
                    start: hour.hourIndex,
                    end: CalendarUtils.getNextHourIndex(hour.hourIndex),
                }
            } else if (currentAvailabilityPeriod && isChainedToCurrentPeriod) {
                // if hour is available and immediately follows a previous available hour, extend the end time of the current availability period
                currentAvailabilityPeriod.end = CalendarUtils.getNextHourIndex(hour.hourIndex);
            } else if (isHourAvailable && currentAvailabilityPeriod) {
                // if hour is available but part of a new availability period, push current period to array of periods
                pushCurrentPeriod();

                // create new availability object
                currentAvailabilityPeriod = {
                    day: day.longName,
                    start: hour.hourIndex,
                    end: CalendarUtils.getNextHourIndex(hour.hourIndex),
                }
            }

            // if final hour in the day, push availability period to array
            if (isFinalHourInDay && currentAvailabilityPeriod) {
                pushCurrentPeriod();

                currentAvailabilityPeriod = null;
            }
        }))

        // push any remaining availability object to array of available periods
        currentAvailabilityPeriod && pushCurrentPeriod();

        // log availability
        console.log(availability);
    }

    const goToNextDay = () => {
        activeDayIndex < CalendarUtils.weekDays.length - 1 && setActiveDayIndex(activeDayIndex + 1)
    }

    const goToPrevDay = () => {
        activeDayIndex > 0 && setActiveDayIndex(activeDayIndex - 1)
    }

    return (
        <>
            <div className={styles.calendar}>
                <div className={styles.dayColumn}>
                    <div className={styles.dayHeader}/>
                    {dayHours.map((hour, i) => {
                        return (
                            <div className={styles.hourCell} key={i}>{hour.hourString}</div>
                        )
                    })}
                </div>
                {weekData.current?.map((day, dayIndex) => {
                    const transformAmnt = (dayIndex - activeDayIndex) * 100;

                    return (
                        <div className={styles.dayColumn} key={dayIndex} style={{ transform: `translateX(${transformAmnt}%)` }}>
                            <div className={styles.dayHeader}>
                                {dayIndex > 0 &&
                                    <button onClick={goToPrevDay}>{"<-"}</button>
                                }
                                <p>{day?.longName}</p>
                                {dayIndex < CalendarUtils.weekDays.length - 1 &&
                                    <button onClick={goToNextDay}>{"->"}</button>
                                }
                            </div>
                            <div className={styles.dayHours}>
                                {day.hours.map((hour, hourIndex) => {
                                    return (
                                        <div
                                            key={hourIndex}
                                            onClick={() => handleHourCellClick(dayIndex, hourIndex)}
                                            className={classNames(styles.hourCell, { [styles.available]: !!availableHours[dayIndex][hourIndex] })}
                                        >

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <button onClick={logHours}>Log Hours</button>
        </>
    )
}