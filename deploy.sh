#!/bin/sh
# First, set the secrets for the running app
flyctl secrets import < .env.local

# Second, deploy and pass the secrets to the build
flyctl deploy --remote-only 
