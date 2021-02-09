
open cmd

heroku login

heroku container:login

heroku create -a pokemon-file-cors

heroku container:push frontend backend --recursive -a pokemon-file-cors

heroku container:release frontend backend -a pokemon-file-cors

heroku ps:scale frontend=1 -a pokemon-file-cors

heroku open -a pokemon-file-cors

heroku logs --tail  -a pokemon-file-cors
