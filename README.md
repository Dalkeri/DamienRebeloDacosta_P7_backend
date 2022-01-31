# backend

This project is a MVP for a social media website.
This backend has been made with nodeJS and Sequelize. You can plug in your database but I already included models and migrations so you can type the command 
```
npx sequelize-cli db:migrate
```

You'll also need to create a .env file with a variable SECRET_PHRASE= containing your secret phrase to use with the jsonwebtoken (example: SECRET_PHRASE=mySecretPhrase)

## Project setup
You'll need npm so you can install everything needed with this command
```
npm install
```
to launch the server you can then type
```
nodemon server
```
