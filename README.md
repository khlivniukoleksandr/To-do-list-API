# To-do-list-API

## API для керування списком завдань (To-Do List)


## Installing using GitHub
### Requirements
Before you begin, make sure you have the following installed:

- Docker
- Docker Compose
- Git
- Pycharm Pro

## How to run

 - Clone repository
 - change directory to backend `cd backend`
 - install all packages `pip install requirements.txt` 
 - Create database PostgreSQL `createdb train_station_db`
 - Create .env file like .env.sample
 - Run migrations `python manage.py makemigrations`
 - run server and open localhost

## Run with Docker

- Run Docker-compose `docker-compose up --build`

## API Documentation
 - Swagger is available at: api/doc/swagger/

## How to log in

 - First u need to register, go to /api/user/register and enter valid email and password
 - Then go to /api/user/token/ and enter ur data in fields
 - After successful authorization u have 2 tokens: refresh and access
 - Install package "ModHeader" in your browser
 - Open ModHeader and write in "Name" - Authorization, Value - your access token
 - 
 - !!! Lifetime access token - 1 day. U can change this in todolist->settings.py