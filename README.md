# Movie Recomendation Backend

## Getting Started
To get the project running first it is required to have Docker (including docker-compose)
### Up
`docker-compose up`

### Build
`docker-compose build --no-cache`

### Down
`docker-compose down`

### Lint
`docker-compose run movie-rec lint`

The Backend is now avaliable on http://localhost:3001/

## Code Style
We make use of eslint to ensure a consistent code style throughout the project.
We write the code in an ES2015+ style  and we prefer the use
of classes and the ```import``` statement.
We follow the Airbnb javascript style guidelines: https://github.com/airbnb/javascript.
