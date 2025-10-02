# Pinpoint. Share the problem, make a solution.

## Overview
### Features
- Ability to post problems.
- Connect with experts.
- Come up with solutions.

### Potential 
- For developers:
  - You can start a business.
  - You can work on a fun a project.
  - You can build your resume with real world solutions made by you.
- For workers and business owners:
  - You can improve productivity. 
  - You can solve reoccuring issues. 

## How to develop
- First clone this repo to your machine
- Then run `npm install` in the project root directory
- Local supabase stuff
  - To run the local supabase development backend you have to do these things:
  - `npx supabase start`
    - This should share some urls and stuff. But what we really need is the API URL and the Publishable key.
    - Make a new file called `.env.local`, and inside it put `NEXT_PUBLIC_SUPABASE_URL=the-api-url` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=the-publishable-key`
  - Now run `npx supabase link --project-ref your-project-ref` to link the local db to the production db
    - replace `your-project-ref` with the project id found in the settings of the production db
  - `npx supabase reset` - this applies the migrations to the local db
- Once you've done these things all you must run `npm run dev` to run the local development server

