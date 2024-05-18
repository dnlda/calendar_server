import { Request, Response } from 'express';
import CalendarService from './calendarService';
import pool from './db';

class CalendarController {
    
    async listHolidays(req: Request, res: Response) {
        const holidays = await CalendarService.listHolidays();
        res.json(holidays);
    }

    async addHoliday(req: Request, res: Response) {
        const { date } = req.body;

        try {
            const result = await pool.query('INSERT INTO holidays (date) VALUES ($1)', [date]);

            // Получаем год из даты
            const year = new Date(date).getFullYear();

            // Пересчитываем рабочие часы за год
            await CalendarService.calculateAndStoreWorkingHours(year);

            res.status(201).json({ message: 'Holiday added and working hours recalculated' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteHoliday(req: Request, res: Response) {
        await CalendarService.deleteHoliday(req.body.date);
        res.sendStatus(204);
    }

    async listWorkingWeekends(req: Request, res: Response) {
        const workingWeekends = await CalendarService.listWorkingWeekends();
        res.json(workingWeekends);
    }
    
    async addWorkingWeekend(req: Request, res: Response) {
        await CalendarService.addWorkingWeekend(req.body.date);
        res.sendStatus(201);
    }
    
    async deleteWorkingWeekend(req: Request, res: Response) {
        await CalendarService.deleteWorkingWeekend(req.body.date);
        res.sendStatus(204);
    }

    async checkDay(req: Request, res: Response) {
        const dayType = await CalendarService.checkDay(req.body.date);
        res.json({ type: dayType });
    }

    async getWorkingHours(req: Request, res: Response) {
        const yearStr = req.query.year as string;
        const monthStr = req.query.month as string;
        const startStr = req.query.start as string;
        const endStr = req.query.end as string;

        if (yearStr && monthStr) {
            const year = parseInt(yearStr);
            const month = parseInt(monthStr);

            try {
                const workingHours = await CalendarService.getWorkingHours(year, month);
                res.json(workingHours);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        } else if (startStr && endStr) {
            const [startYear, startMonth] = startStr.split('-').map(Number);
            const [endYear, endMonth] = endStr.split('-').map(Number);

            try {
                const workingHours = await CalendarService.getWorkingHoursInRange(startYear, startMonth, endYear, endMonth);
                res.json(workingHours);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            res.status(400).json({ error: 'Year and month or start and end parameters are required' });
        }
    }
}

export default new CalendarController();
