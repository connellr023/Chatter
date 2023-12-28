# <img style="width: 280px" src="https://github.com/connellr023/Chatter/blob/main/chatter-client/src/assets/logo_white.png?raw=true">

> A web based chat application that is entirely oriented around temporary sessions.

<div align="left">
 <img src="https://img.shields.io/badge/client-Vue-seagreen">
 <img src="https://img.shields.io/badge/api-TypeScript-blue">
 <img src="https://img.shields.io/badge/developer-Connell Reffo-crimson">
</div>

<br />

### Overview
Chatter is a web app centered around a global chat system. It features isolated chat rooms that users can connect to without
requiring an account. Currently, all chat rooms are global, however there is infrastructure in place within the server the API to allow for private
chat rooms in the future.

<br />

### Installing Dependencies
Dependencies for the API and client projects can be installed by running,
```bash
npm i
```
in their respective directories.

<br />

### API Test Suite
In order to run the API test suite see the **Actions** tab or execute the following,
```bash
cd chatter-api
```
```bash
npm run test
```
The test suite for the API includes **unit** and **networking** tests in order to simulate user interaction in an automated environment.

<br />

### Client Test Suite
The client test suite is also visible in the **Actions** tab. Otherwise, run the following commands,
```bash
cd chatter-client
```
```bash
npm run test
```
<br />

### Building
This web app is not currently deployed. However, in order to do so, build the client by,
```bash
cd chatter-client
```
```bash
npm run build
```
This will create a directory called `build` in `chatter-api/src` containing the static webpage. The hostname and port
the client will attempt to connect to is `localhost:8000` by default. If the server is not able to run on port `8000`, then
this can be changed in `stream.ts`. The server API attempts to host on `process.env.PORT` or `8000` if not set. The server API
can be run in production mode by,
```bash
npm run start
```

<br />

### Tools
- The server API was built with **express.js** and **socket.io** and tested with **Jest**.
- The client was built with the **Vue** framework and tested with **Vitest**.

<br />

### History Of The Project
Chatter was first conceived around 2018 (8th grade for me) as my first **PHP** project.
The scope then was actually larger than this iteration of Chatter as the original included
an account system stored on an **SQL** database through **phpMyAdmin** running on an Acer chromebook that was emulating Ubuntu.
The messaging system consisted of constant **HTTP polling** requests made by the client. It worked,
but of course it was not sustainable for a larger user base. Unfortunately the code is long gone.
That's what happens when you use Google Drive as version control.

The second iteration of Chatter was developed by me in 2020 however it was never completed to my satisfaction. In terms of the software, it used
completely different technologies than the original. For instance, the client was created using the **React** javascript framework
and the server used **Node.js** with **MongoDB** for storing account data. I still have this project private (it will never see the light of day).

This project is the third Chatter incarnation.

**Interesting Note:** The logo used in all versions of Chatter has remained the same since 2018.
That is the only shared aspect this iteration has with the original.

<br />

### Acknowledgements
This software was built and tested by *Connell Reffo* in 2023/2024.

<br />

### License
This software is distributed under **MIT License**. See `LICENSE` for more information.

<br />

### Screenshots Of The Client
<img style="width: 600px" src="https://github.com/connellr023/Chatter/blob/screenshots/screenshots/home.PNG?raw=true">
<img style="width: 600px" src="https://github.com/connellr023/Chatter/blob/screenshots/screenshots/empty_chat.PNG?raw=true">
<img style="width: 600px" src="https://github.com/connellr023/Chatter/blob/screenshots/screenshots/chat.PNG?raw=true">
<img style="width: 600px" src="https://github.com/connellr023/Chatter/blob/screenshots/screenshots/connection_error.PNG?raw=true">