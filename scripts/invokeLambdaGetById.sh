sam build getByIdFunction
sam local invoke --env-vars env.json \
 -e events/event-get-by-id.json getByIdFunction