export type WeekDay = {
    shortName: string;
    longName: string;
}

export type THour = {
    hourIndex: number;
    hourString: string;
}

export class CalendarUtils {
    public static weekDays: WeekDay[] = [
        { shortName: "Sun", longName: "Sunday" },
        { shortName: "Mon", longName: "Monday" },
        { shortName: "Tue", longName: "Tuesday" },
        { shortName: "Wed", longName: "Wednesday" },
        { shortName: "Thur", longName: "Thursday" },
        { shortName: "Fri", longName: "Friday" },
        { shortName: "Sat", longName: "Saturday" },
    ];

    /** Array of week days with each selectable hour for each day */
    public static get weekDaysWithHours() {
        return this.weekDays.map(day => ({
            ...day, 
            hours: this.getDayHours(),
        }))
    }

    /** First hour index of day */
    public static dayStartHour = 0;
    /** Last hour index of day */
    public static dayEndHour = 23;

    /** Array of all hours in a day */
    public static getDayHours() {
        return Array(this.dayEndHour - this.dayStartHour + 1).fill(null).map((_, i) => ({
            hourIndex: i,
            hourString: this.getTimeFromHourIndex(i),
        }))
    }

    /** Converts hour index to readable hour */
    public static getTimeFromHourIndex = (hourIndex: number) => {
        let moddedHour = hourIndex;

        if (moddedHour === 0) {
            moddedHour = 12;
        } else if (moddedHour >= 13) {
            moddedHour = moddedHour - 12;
        }

        return `${moddedHour} ${hourIndex <= 11 ? "a.m." : "p.m."}`
    }

    /** 
     * Returns the next hour's index.  Returns 0 in the case that the 
     * next hour index is 24, which would just equate to 12am 
     * */
    public static getNextHourIndex = (hourIndex: number) => {
        return hourIndex === 23 ? 0 : hourIndex + 1;
    }
}