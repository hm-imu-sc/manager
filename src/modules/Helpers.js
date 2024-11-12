import React from "react";

export const isNullOrEmpty = x => {
    return x === undefined || x === null || x === '';
}

export const updateProps = (oldProps, newProps) => {
    // const mergedProps = copy(oldProps);
    const mergedProps = {...oldProps};
    for (let prop of Object.keys(newProps)) {
        mergedProps[prop] = newProps[prop];
    }
    return mergedProps;
}

export const updateState = (oldProps, newProps, setStateFunction) => {
    const newState = updateProps(oldProps, newProps);
    setStateFunction(newState);
}

export const setDefaultProps = (props, defaultProps) => {
    // const updatedProps = copy(props);
    const updatedProps = {...props};
    const defaultKeys = Object.keys(defaultProps);

    for (const key of defaultKeys) {
        if (Object.keys(updatedProps).find(k => k === key) === undefined) {
            updatedProps[key] = defaultProps[key];
        }
    }

    return updatedProps;
}

export const copy = object => JSON.parse(JSON.stringify(object));

export const copyPrimitive2D = ar => ar.map(r => [...r]);

export const isEqual = (x, y) => {
    x = x.sort();
    y = y.sort();

    if (x.length !== y.length) {
        return false;
    }

    const n = x.length;

    for (let i = 0; i < n; i++) {
        if (x[i] !== y[i]) {
            return false;
        }
    }

    return true;
}

export class Datetime {
    
    #date = new Date();
    #monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    /**
     * type             : function | constructor for Datetime class
     * description      : this constructor simulates keyword argument. As Javascript doesn't support keyword argument,
     *                    an object is passed instead, and the object contains the keys which will be treated as parameters.
     *                    check the parameter format for clarification.
     * parameter        : params | object
     * parameter format : {
     *      date: {
     *          year: <int>
     *          month: <int>
     *          day: <int>
     *      },
     *      offset: {
     *          years: <int>
     *          months: <int>
     *          days: <int>
     *      }
     * }
     * parameter description : none of these parameters are mandatory. 
     */

    constructor(params) {
        for (let param in params) {
            if (param == "date") {
                let date_parts = params[param];
                for (let date_part in date_parts) {
                    if (date_part == "year") {
                        this.#date.setFullYear(date_parts[date_part]);
                    }
                    else if (date_part == "month") {
                        this.#date.setMonth(date_parts[date_part] - 1);
                    }
                    else if (date_part == "day") {
                        this.#date.setDate(date_parts[date_part]);
                    }
                }
            }  
            if (param == "offset") {
                let date_offsets = params[param];
                for (let date_offset in date_offsets) {
                    this.add({[date_offset]: date_offsets[date_offset]});
                }
            }          
        }
    }

    add(params) {
        for (let param in params) {
            if (param == "years") {
                this.#date.setFullYear(this.year + params[param]);
            }
            else if (param == "months") {
                this.#date.setMonth(this.#date.getMonth() + params[param]);
            }
            else if (param == "days") {
                this.#date.setDate(this.#date.getDate() + params[param]);
            }            
        }
    }

    get year() {
        return this.#date.getFullYear();
    }

    get month() {
        let month = this.#date.getMonth() + 1;
        return month < 10 ? `0${month}` : month;
    }

    get day() {
        let day = this.#date.getDate();
        return day < 10 ? `0${day}` : day;
    }

    get daySuperscript() {
        let sup = '';

        const date = this.#date.getDate() % 10;

        if (this.#date.getDate() > 10 && this.#date.getDate() < 20) {
            sup = 'th';
        }
        else if (date === 1) {
            sup = 'st';
        }
        else if (date === 2) {
            sup = 'nd';
        }
        else if (date === 3) {
            sup = 'rd';
        }
        else {
            sup = 'th';
        }

        return sup;
    }

    get week_day() {
        return (this.#date.getDay() + 1) % 7;
    }

    get date() {
        return `${this.year}-${this.month}-${this.day}`;
    }

    get monthName() {
        return this.#monthNames[this.#date.getMonth()];
    }

    get dateParametes() {
        return {
            year: this.#date.getFullYear(),
            month: this.#date.getMonth() + 1,
            day: this.#date.getDate()
        }
    }

    static date_range_object(from, to) {
        return {
            from: from,
            to: to
        }
    }

    static get today() {
        return new Datetime();
    }

    static get yesterday() {
        return new Datetime({offset: {days: -1}});
    }

    static get this_week() {
        let from = new Datetime();
        let to = new Datetime();

        from.add({days: -from.week_day});
        to.add({days: 6 - to.week_day})

        return Datetime.date_range_object(from, to);
    }

    static get last_week() {
        let from = new Datetime();
        let to = new Datetime();

        from.add({days: -from.week_day - 7});
        to.add({days: -to.week_day - 1});
        
        return Datetime.date_range_object(from, to);
    }

    static get this_month() {
        return Datetime.date_range_object(
            new Datetime({date: {day: 1}}), 
            new Datetime({date: {day: 1}, offset: {months: 1, days: -1}})
        );
    }

    static get last_month() {
        return Datetime.date_range_object(
            new Datetime({date: {day: 1}, offset: {months: -1}}),
            new Datetime({date: {day: 1}, offset: {days: -1}})
        );
    }

    static get this_year() {
        return Datetime.date_range_object(
            new Datetime({date: {day: 1, month: 0}}),
            new Datetime({date: {day: 31, month: 11}})
        );
    }

    static get last_year() {
        return Datetime.date_range_object(
            new Datetime({date: {day: 1, month: 0}, offset: {years: -1}}),
            new Datetime({date: {day: 31, month: 11}, offset: {years: -1}})
        );
    }

    static extractDateParameter(date) {
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }
}
