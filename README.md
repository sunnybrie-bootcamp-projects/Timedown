# Timedown

Timedown is a flexible time management app designed to cultivate a healthy work-life balance while staying on top of your deadlines. It allows a user to submit a task and uses the information to determine how they should allocate their time spent working on it so they finish before the due date. It then synchronizes with a user's calendar to suggest time blocks that fit into their schedule. 

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
- Synchronize with their Google Calendar.
- Set custom scheduling settings
- Submit new tasks
- Generate suggested time blocks for a task based on est. time needed and due date
- Manually adjust time blocks on their calendar
- Option to insert time blocks as events into into their Google calendar, or keep time blocks in their app.
- Check-off the time blocks when completed

## Nice-to-haves
1. Clock-in/Clock-out feature
2. Pomodoro timer that triggers when clocked-in.
3. Push notifications for upcoming tasks
4. Option to recalibrate time blocks when you miss or delete a block
5. Indicators on tasks that show whether or not you’re on track to finish them by their deadline.
6. Pattern recognition/insights feature.

## Technical Risks
- Google Calendar API might be too complicated to implement in time
    > If this turns out to be the case, I will instead use a simple calendar API (such EZCalDev), create dummy account, and populate it with dummy events in order demonstrate the core features of the app.
- Running out of time to set up the customer User settings feature
    > In this case, I can hard-code in what would be the default scheduling settings, such as giving a 15-minute buffer around pre-existing events.
   
---

![Data_Schema_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115933182-31c9b980-a443-11eb-85f0-5dc30ce9d617.png)
![userflow_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115933184-32fae680-a443-11eb-83fe-75323839bdb3.png)


