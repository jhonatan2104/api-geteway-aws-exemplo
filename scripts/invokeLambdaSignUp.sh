sam build signUpFunction
sam local invoke --env-vars env.json \
 -e events/event-api-signup.json signUpFunction