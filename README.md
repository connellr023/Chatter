# <img style="width: 280px" src="https://github.com/connellr023/Chatter/blob/main/chatter-client/src/assets/logo_white.png?raw=true">

> A web based chat application that is entirely session based.

<div align="left">
 <img src="https://img.shields.io/badge/client-Vue-seagreen">
 <img src="https://img.shields.io/badge/api-TypeScript-blue">
 <img src="https://img.shields.io/badge/developer-Connell Reffo-crimson">
</div>

<br />

### Overview
Chatter is a web app centered around a global chat system. It features isolated chat rooms that users can connect to without
requiring an account. Currently, all chat rooms are global, however there is infrastructure in place in the API to allow for private
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

### Client Test Suite *(WIP)*
The client test suite is also visible in the **Actions** tab. Otherwise, navigate to the client folder,
```bash
cd chatter-client
```
Now, the test suite for the client is seperated into two types of tests: **unit** and **end-to-end** tests. The unit tests can be executed by,
```bash
npm run test:unit
```
The **end-to-end** tests can be run by,
```bash
npm run test:e2e
```

<br />

### Tools
- The server API was built with **express.js** and **socket.io** and tested with **Jest**.
- The client was built with the **Vue** framework and tested with **Vitest** and **Playwright**.

<br />

### Acknowledgements
This software was built and tested by *Connell Reffo* in 2023/2024.

<br />

### License
This software is distributed under **MIT License**. See `LICENSE` for more information.