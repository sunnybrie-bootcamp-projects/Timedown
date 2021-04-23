# Timedown
---

## Technologies
- Technologies
- Postgresql Database
- Express
- React.js
- Node.js
- Google Calendar API
- OAuth 2.0 API

## MVP
Users should be able to...
- Log in with their Google account
- Sync with your Google Calendar.
- Set custom scheduling settings
- Submit new task
- Generate suggested time blocks for a task based on estimated time and due date
- Manually adjust time blocks TIMEDOWN generates for your calendar
- Option to insert time blocks as events into your their Google calendar, or keep time blocks in your app.
- Check-off the time blocks when completed

## Nice-to-haves
1. Clock-in/Clock-out feature
2. Push notifications for upcoming tasks
3. Pomodoro timer that triggers when clocked-in.
4. Option to recalibrate time blocks when you miss or delete a block
5. Indicators on tasks that show whether or not you’re on track to finish them by their deadline.
6. Pattern recognition/insights feature.

## Technical Risks
- Google Calendar API might be too complicated to implement in time
    If this turns out to be the case, I will instead use a simple calendar API (such EZCalDev), create dummy account, and populate it with dummy events in order demonstrate the core features of the app.
- Running out of time to set up the customer User settings feature
    In this case, I can hard-code in what would be the default scheduling settings, such as giving a 15-minute buffer around pre-existing events.
