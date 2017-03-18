# Telegraph Clone

Simplified clone of [telegraph](http://telegra.ph/)

# Project Goals

The code is written for educational purposes. Training course for web-developers - [DEVMAN.org](https://devman.org)

The running online site could be verified [here](https://whispering-depths-75337.herokuapp.com/)

## Requirements:
Before start project we need to setup environment:
```
pip3 install -r requirements.txt
```
and create database:
```
python3 db_create.py
```
## Usage:
Start site:
```
python3 server.py
```
and check the [site](http://localhost:5000)

Post edit/delete authorisation is based on cookies.
If you want to edit the post later - please provide passphrase.
Next time, if cookies are lost you'll restore access by this passphrase.

Also the site provides simple search for post's title.
