import express from 'express';
import bodyParser from 'body-parser';
import CalendarController from './calendarController';

const app = express();
app.use(bodyParser.json());

app.get('/holiday/list', CalendarController.listHolidays);
app.post('/holiday/add', CalendarController.addHoliday);
app.delete('/holiday/delete', CalendarController.deleteHoliday);

app.get('/working-weekend/list', CalendarController.listWorkingWeekends);
app.post('/working-weekend/add', CalendarController.addWorkingWeekend);
app.delete('/working-weekend/delete', CalendarController.deleteWorkingWeekend);

app.post('/day/check', CalendarController.checkDay);
app.get('/working-hour/get', CalendarController.getWorkingHours);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
