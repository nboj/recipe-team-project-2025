# Frontend

## Initial Setup (do this once)

1. install [Node.js](https://nodejs.org/en)
2. install dependencies

Ensure you're in the `frontend/` folder before you do this:

```bash
npm install
```

## To start a development session

```bash
npm run dev
```

View the local server at: [http://127.0.0.1:3000]

Everything that matters is located in [the app folder](./app/)

Pages are structured like this:

(app/page.tsx)[./app/page.tsx] = localhost:3000/ # the first page 

(app/folder/page.tsx)[./app/folder/page.tsx] = localhost:3000/folder # a page that is named `folder`

(app/recipes/page.tsx)[./app/recipes/page.tsx] = localhost:3000/recipes # a page that is named `recipes`

(app/recipes/\[recipe_id\]/page.tsx)[./app/recipes/[recipe_id]/page.tsx] # a special page that can be anything (or in this case, any recipe_id to display a page for specific recipes)
