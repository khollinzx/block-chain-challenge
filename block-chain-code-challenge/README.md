
## Installtion

### Prequisite

Install Docker (Mac OS or Windows), Ensure Docker is running


### Set Up

```
cp .env.example .env
Request for .env contents and replace
Run yarn install
Edit docker.compose.yml replace '${APP_PORT:-80}:80' with "8091:8091"
Run docker-compose build
Run docker-compose up dev
Database is MongoDB .. using Mongoose for connecction

```
### Postman Link

```
https://documenter.getpostman.com/view/10224661/2s9YC1XuMB
```