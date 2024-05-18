import pool from './db';

class CalendarService {

    async calculateAndStoreWorkingHours(year: number) {
        // Получить все праздничные дни за указанный год
        const holidaysRes = await pool.query('SELECT date FROM holidays WHERE EXTRACT(YEAR FROM date) = $1', [year]);
        const holidayDates = holidaysRes.rows.map(row => new Date(row.date));

        // Получить все перенесенные рабочие дни за указанный год
        const workingWeekendsRes = await pool.query('SELECT date FROM working_weekend WHERE EXTRACT(YEAR FROM date) = $1', [year]);
        const workingWeekendDates = workingWeekendsRes.rows.map(row => new Date(row.date));

        const workingHoursByMonth: { [key: number]: number } = {};

        // Итерируем по каждому месяцу года
        for (let month = 0; month < 12; month++) {
            let workingHours = 0;
            let lastWorkingDayBeforeHoliday: Date | null = null;

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, month, day);

                // Проверяем, является ли текущий день праздником
                if (holidayDates.some(date => date.getTime() === currentDate.getTime())) {
                    if (lastWorkingDayBeforeHoliday) {
                        // Предпраздничный день
                        workingHours -= 8; // Уменьшаем на 8, так как он был добавлен как обычный рабочий день
                        workingHours += 7; // Добавляем как предпраздничный день
                    }
                    lastWorkingDayBeforeHoliday = null;
                    continue;
                }

                // Проверяем, является ли текущий день перенесенным рабочим днем
                if (workingWeekendDates.some(date => date.getTime() === currentDate.getTime())) {
                    // Перенесенный рабочий день
                    // Здесь можно уменьшить количество рабочих часов или применить другую логику
                    // Например, если это последний рабочий день перед праздником, то уменьшаем на 8 часов
                    // А если это первый рабочий день после праздника, то увеличиваем на 8 часов
                    // В данном примере просто пропускаем день без изменений
                    continue;
                }

                // Проверяем, является ли текущий день выходным (суббота или воскресенье)
                if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                    lastWorkingDayBeforeHoliday = null;
                    continue;
                }

                // Обычный рабочий день
                workingHours += 8;
                lastWorkingDayBeforeHoliday = currentDate;
            }

            // Сохраняем количество рабочих часов для текущего месяца
            workingHoursByMonth[month + 1] = workingHours;
        }

        // Сохраняем рабочие часы в таблицу working_hours
        for (const [month, hours] of Object.entries(workingHoursByMonth)) {
            await pool.query(
                'INSERT INTO working_hours (year, month, hours) VALUES ($1, $2, $3) ON CONFLICT (year, month) DO UPDATE SET hours = EXCLUDED.hours',
                [year, parseInt(month), hours]
            );
        }
    }

    async listHolidays() {
        const res = await pool.query('SELECT date FROM holidays');
        return res.rows;
    }

    async addHoliday(date: string) {
        await pool.query('INSERT INTO holidays (date) VALUES ($1)', [date]);
    }

    async deleteHoliday(date: string) {
        await pool.query('DELETE FROM holidays WHERE date = $1', [date]);
    }
    
    async listWorkingWeekends() {
        const res = await pool.query('SELECT date FROM working_weekend');
        return res.rows;
    }
    
    async addWorkingWeekend(date: string) {
        await pool.query('INSERT INTO working_weekend (date) VALUES ($1)', [date]);
    }
    
    async deleteWorkingWeekend(date: string) {
        await pool.query('DELETE FROM working_weekend WHERE date = $1', [date]);
    }
    


    async checkDay(date: string) {
        const holidayRes = await pool.query('SELECT 1 FROM holidays WHERE date = $1', [date]);
        const workingWeekendRes = await pool.query('SELECT 1 FROM working_weekend WHERE date = $1', [date]);

        if (holidayRes.rows.length > 0) return 'holiday';
        if (workingWeekendRes.rows.length > 0) return 'working_weekend';

        const day = new Date(date).getDay();
        return day === 0 || day === 6 ? 'weekend' : 'workday';
    }

   async getWorkingHours(year: number, month: number) {
        const res = await pool.query('SELECT hours FROM working_hours WHERE year = $1 AND month = $2', [year, month]);
        return res.rows.length ? res.rows[0] : { hours: 0 };
    }

    async getWorkingHoursInRange(startYear: number, startMonth: number, endYear: number, endMonth: number) {
        const res = await pool.query(
            'SELECT year, month, hours FROM working_hours WHERE (year > $1 OR (year = $1 AND month >= $2)) AND (year < $3 OR (year = $3 AND month <= $4)) ORDER BY year, month',
            [startYear, startMonth, endYear, endMonth]
        );
        return res.rows;
    }
}

export default new CalendarService();
