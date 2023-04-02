# Example project

Built with : Nuxt3, Vu3, Node, Apollo Server 4, Typescript, Prisma, Posgresql 14, and others

---

# Requirements to run locally

1. Docker
2. docker compose as a plugin  https://docs.docker.com/compose/install/compose-plugin/
3. Port 80, 8080 should not be blocked (rest of the ports can be edited in the .env file)

**_NOTE:_** Application was tests on Ubuntu.22

---

# How to start

```shell
make init
make start
make seeds 
```

**_NOTE:_** The application uses [traefik](https://doc.traefik.io/traefik/getting-started/quick-start/) to provide a
reverse proxy to the ui app and api app.

### Open the App at the url: http://ffdc.localhost/

Graphql server is available at: http://ffdc-api.localhost/graphql

---

# Stop the app

```shell
make stop
```

---

### Debugging the app

```shell
make logs
```


