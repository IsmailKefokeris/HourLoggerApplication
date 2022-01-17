# COM519 Assignment
## Hour Logger Application
### [Hosted Application - Heroku](https://www.heroku.com)
### [Github repository](https://github.com/IsmailKefokeris/HourLoggerApplication)


## Introduction
The assessment tasked me to create, test, and deploy, a proof of concept data-driven full stack web-application. I was handed
the option to either make sense of existing data or solve a problem in my work or social life. I have chosen the latter. I will
be creating and designing a time logging app which will allow individual users to sign in and log hours worked from their job 
(indipendently from the company).

I am desiging and creating this because of a problem that a friend of mine ran into recently, they were paid after a months work but werent sure if they were paid the full correct amount, we painstakingly counted the days back tallying all the hours she had worked to figure out what they were owed. If only there were a tool easy to use and access that could have prevented this situation or atleast helped us in tallying.

## System Overview

__The System contains the following features:__
   - Allows the user to register.
   - Allows the user to Login, saving their data.
   - Calculates amount earned daily, weekly, and monthly.
   - Allows the user to input/edit/update/delete the day they worked. (Tracker Object)
   - Allows the user to add/edit/update/delete multiple Jobs to their account. (Job Object)

__Completed Features__

   [] Registering new account
   [] Ability to Login to account
   [] Create a new Job
   [] Create a tracker object linked to a Job


## Key Design Decisions
![InitialDesign](static/img/readme/initialDesign.PNG)

Initial Design for application, designed on bootstrap studio 5.


### Database Design

The Database will contain three collections:
   - User: Stores User Data
   - Tracker: Stores tracking data for each day worked
   - Job: Stores Data from the Job worked

__User Object__

__Job Object__
There will be a Job Object which will contain information about the job

__Tracker__
Tracker object which will contain information about the time worked and what job it belongs to


### Security and Scalability



## Conclusion and Reflection
https://stackoverflow.com/questions/21554603/calculate-duration-between-two-date-times-in-javascript