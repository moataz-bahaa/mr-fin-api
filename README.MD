## MR.Fin Consulting Application

### Author
Moataz Bahaa  
Email: moatazbahaa20@gmail.com  

### Technologies Used
- Node.js
- MySQL
- PNPM

### Running the Project
To run this project on your device, ensure the following dependencies are installed:

1. MySQL
2. Node.js version 20.14.0 or above
3. npm version 10.7.0 or above
4. pnpm version 9.1.4 or above

You can install PNPM globally by running:

`npm i -g pnpm`


After installing PNPM, run the following command to install required packages:

`pnpm install`



### .env File Configuration
Create a `.env` file with the following variables:

```

DATABASE_URL=

JWT_SECRET=

API_KEY=

PORT=

NEXT_APP_BASE_URL=

ZOOM_ACCOUNT_ID=

ZOOM_CLIENT_ID=

ZOOM_CLIENT_SECRET=

```


### Setting Up the Application
Follow these steps to set up and run the application:

1. Apply database migrations:
`pnpm prisma db push`

2. Seed the databse
`pnpm seed`

3. Run the application in development mode
`pnpm dev`

4. Run the application in production mode
`pnpm start`


### Cron jobs
i have a cron jobs that run every day to create tasks depending on service repeatedEvery column
check `/jobs/add-tasks.js`