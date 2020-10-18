sam build loginFunction
sam local invoke --env-vars env.json \
 -e events/event-api-login.json loginFunction