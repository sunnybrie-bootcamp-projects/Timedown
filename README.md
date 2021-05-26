# Timedown

[Heroku Link](https://sb-timedown.herokuapp.com/) 
**Please look at the dummy profiles below to sign in with.*

Timedown is a flexible time management app designed to cultivate a healthy work-life balance while staying on top of your deadlines. It allows a user to submit a task and uses the information to determine how they should allocate their time spent working on it so they finish before the due date. It then synchronizes with a user's google calendar to suggest time blocks that fit into their schedule. 

## To Use 

### On Heroku
Timedown has not been officially verified by Google yet, so only designated test users can log in and try out this app. 
In order to try this app, you will need to either email the developer and ask to be added as a test user, or **try out one of these dummy test user accounts.**

![Sunny](https://lh3.googleusercontent.com/a-/AOh14Ghc3aZ3QNJXczLbp0HrOZR_4vkRJW2hW9sz2xi_=s96-c)
 -   **Email:** sunny.codetester@gmail.com
 -   **Password:** qwerd123
 -   **Persona:** Sunny Codetester is a busy, 21-year-old college student working a part-time job as a kitchen assistant. Wanting to build up her portfolio and work experience, she's been trying to squeeze in time to do freelance design work.

![Cody](https://lh3.googleusercontent.com/a-/AOh14GhFm6Uu2vvG1KoQqKbIBSxhf5PCTmvopo-ZHApo=s96-c)
 -   **Email:** cods7699@gmail.com
 -   **Password:** trewq321
 -   **Persona:** Sir Cody is knight from ye olden times, accidentally brought to the future via time machine several years back. He got a job as a consultant for movies and tv shows set in the middle ages. Sir Cody is managing to do surprisingly well for himself, given his strange circumstances, and is even considering writing a book.
   
**You are free to add/remove events from their google calendars**

**Please don't add anything innapropriate/NSFW**

*Profile pictures for these accounts were generated by [thispersondoesnotexist.com](https://thispersondoesnotexist.com/)*

---

### Locally
1. You will need to install and run [Docker](https://www.docker.com/?utm_source=google&utm_medium=cpc&utm_campaign=dockerhomepage&utm_content=namer&utm_term=dockerhomepage&utm_budget=growth&gclid=Cj0KCQjwna2FBhDPARIsACAEc_XLdggQ2swXvSxtB7aRugYq_aCHKQaTTA_d04oO00wfe2EGyKnsa4saAndkEALw_wcB).
2. Fork and clone this repo
3. Follow the first 15 minutes of [this video](https://www.youtube.com/watch?v=zrLf4KMs71E) to set up an API key and Client ID in order to use the Google API.
4. Create a `.env` file in the `app/` directory
5. Add two lines... 
```
REACT_APP_API_KEY=<copy/paste your api key here>
REACT_APP_CLIENT_ID=<copy/paste your client id here>
```
6. In your CLI, from the root directory, run the command `npm run db:init` to set up the database
7. Also from your root directory, run the command `npm start`
8. Timedown will be running on `localhost:3000`

## Technologies
- Technologies
- Postgresql Database
- Express
- React.js
- Node.js
- React Google Calendar API
- Google Calendar API
- OAuth 2.0 API

## MVP
Users should be able to...
- Log in with their Google account
- Synchronize with their Google Calendar.
- Set custom scheduling settings
- Submit new tasks
- Generate suggested time blocks for a task based on est. time needed and due date
- Insert suggested time blocks as events into into their Google calendar.


## Nice-to-haves
1. Manually adjust time blocks on their calendar
2. Check-off the time blocks when completed
3. Clock-in/Clock-out feature
4. Pomodoro timer that triggers when clocked-in.
5. Push notifications for upcoming tasks
6. Option to recalibrate time blocks when you miss or delete a block
7. Indicators on tasks that show whether or not you’re on track to finish them by their deadline.
8. Pattern recognition/insights feature.

## Technical Risks
- Google Calendar API might be too complicated to implement in time
    > If this turns out to be the case, I will instead use a simple calendar API (such EZCalDev), create dummy account, and populate it with dummy events in order demonstrate the core features of the app.
- Running out of time to set up the customer User settings feature
    > In this case, I can hard-code in what would be the default scheduling settings, such as giving a 15-minute buffer around pre-existing events.
   
---

## Data Schema

![Data_Schema_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115933182-31c9b980-a443-11eb-85f0-5dc30ce9d617.png)

## Userflow

![userflow_TIMEDOWN](https://user-images.githubusercontent.com/76143251/115935412-f67db980-a447-11eb-8b7e-88c015b69f03.png)

---
## Landscape Wireframes

![smallwireframes_landscape_TIMEDOWN](https://user-images.githubusercontent.com/76143251/119388298-f3602e00-bc7e-11eb-8647-b97ad7599c13.png)
![smallwireframes_landscape_TIMEDOWN2](https://user-images.githubusercontent.com/76143251/119388301-f3f8c480-bc7e-11eb-990d-ecb1300cc490.png)

---
## Mobile Wireframes

![smallwireframes_mobile_TIMEDOWN](https://user-images.githubusercontent.com/76143251/119388328-fce99600-bc7e-11eb-9b29-ee3cd2a9476d.png)
![smallwireframes_mobile_TIMEDOWN2](https://user-images.githubusercontent.com/76143251/119388332-fd822c80-bc7e-11eb-9aeb-16a104dfab19.png)


