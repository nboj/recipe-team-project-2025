"use client";
import { useState } from "react";

const _recipes = [
  {
    id: 1,
    title: "title goes here",
    description: "description here",
  },
  {
    id: 2,
    title: "Recipe #2",
    description: "tasty noodles",
  },
  {
    id: 3,
    title: "Apple Pie",
    description: "apples and yummyness",
  },
  {
    id: 4,
    title: "Pumpkin Pie",
    description: "pumpkins",
  },
];

export default function Home() {
  const [variable, setVariable] = useState<number>(0);
  const [recipes, setRecipes] = useState(_recipes)

  const increaseNumber = () => {
    setVariable((previous) => previous + 1);
  };

  const decreaseNumber = () => {
    setVariable((previous) => previous - 1);
  };

  const handleForm = (data: FormData) => {
    const title = data.get("title") as string
    const description = data.get("description") as string
    console.log(title, description); // FIXME: remove me later

    setRecipes(previous => [...previous, {id: previous.length+1, title: title, description: description}])
  }

  const removeRecipe = (id: number) => {
    setRecipes(previous => previous.filter(item => item.id != id))
  }

  return (
    <main>
      <h1>Hello, World</h1>
      <p>this is the current variable: {variable}</p>
      <button onClick={increaseNumber}>(increase +)</button>
      <p></p>
      <button onClick={decreaseNumber}>(decrease -)</button>

      <hr />
      <h1>Recipes</h1>
      {recipes.map((recipe, index) => {
        return (
          <div key={`${index}-${recipe.id}`} className="my-5">
            <h5 className="font-bold">{recipe.title}</h5>
            <p>{recipe.description}</p>
            <button className="border-2 px-[.5rem] py-[.3rem] rounded-2xl" onClick={() => {removeRecipe(recipe.id)}}>REMOVE ME</button>
          </div>
        );
      })}
      <form action={handleForm}>
        <input name="title" type="text" className="border-1" placeholder="title" />
        <input name="description" type="text" className="border-1" placeholder="description" />
        <button>add</button>
      </form>
    </main>
  );
}
