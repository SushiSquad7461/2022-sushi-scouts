## Sushi Scouts: FRC Scouting

This is an FRC Scouting web app. Currently this app is built around
Rapid React, however this app is specificity designed for it to be easy
to modify scouting inputs. It is designed during competitions with no wifi
so it is intended to be used with bluetooth pan or ethernet.

## Requirments

* Node.js Installed
* Git Installed
* Backend Computer such as Raspberry Pi
* Bluetooth setup or network switch with DHCP server
* Front end devices for scouting

## Recommendations

* Admin laptop for checking accuracy and submission statistics

## Setup

First download the code from github

Next download all of the libraries,

```bash
npm i
```

After that run the build script:

```bash
npm run build
# or
yarn build
```

After that run the start script

```bash
npm run start
# or
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes/Recommendations

1. We have found that bluetooth pan is fairly unreliable and slow as such
we are currently recommending teams to use a wired connection.


## Tech Stack
Front End: Next.js
Back End: Node.js
Database: Prisma