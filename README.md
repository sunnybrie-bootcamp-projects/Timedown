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
![userflow_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115935412-f67db980-a447-11eb-8b7e-88c015b69f03.png)

---
## Landscape Wireframes

![wireframes_landscape_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115933333-89682500-a443-11eb-9a06-d60c3faf2cc5.png)
![wireframes_landscape_TIMEDOWN2](https://user-images.githubusercontent.com/76143251/115933334-8a995200-a443-11eb-8b50-a598dafc0d29.png)
---
## Mobile Wireframes

![wireframes_mobile_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115933335-8b31e880-a443-11eb-80ae-89ea8b59e57c.png)
![wireframes_mobile_TIMEDOWN2](https://user-images.githubusercontent.com/76143251/115933337-8bca7f00-a443-11eb-8bca-343b5f5ec95e.png)

