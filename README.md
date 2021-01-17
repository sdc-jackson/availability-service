# Availability Calendar

> This repo is a reproduction of the Availability Calendar service from an AirBnb room listing page. End goal is to be able to phish people. Just kidding.

## Related Projects

  - https://github.com/Mauve-Mishka/title-service
  - https://github.com/Mauve-Mishka/photos-service
  - https://github.com/Mauve-Mishka/summary-service
  - https://github.com/Mauve-Mishka/amenities-service
  - https://github.com/Mauve-Mishka/more-places-service
  - https://github.com/Mauve-Mishka/user-service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Run 'npm run server-dev' in one terminal
> Run 'npm run react-dev' in another terminal
> Open localhost:5001
> You can click on the 'check-in' and 'check-out' dates to view the calendar and select dates
> localhost:5001/:id/minNightlyRate will return the minimum nightly rate of the stay

> For linting with Eslint, run: eslint client/src/* database/db.js server/index.js

## Requirements

- Node 12.19.0


## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```