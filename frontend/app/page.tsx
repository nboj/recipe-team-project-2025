'use client'
import { useState } from "react";

const recipes = [
  {
    title: "title goes here",
    description: "description here",
  },
  {
    title: "Recipe #2",
    description: "tasty noodles",
  },
  {
    title: "Apple Pie",
    description: "apples and yummyness",
  },
  {
    title: "Pumpkin Pie",
    description: "pumpkins",
  },
]

export default function Home() {
  const [variable, setVariable] = useState<number>(0);

  const increaseNumber = () => {
    setVariable(previous => previous + 1)
  }

  const decreaseNumber = () => {
    setVariable(previous => previous - 1)
  }

  return (
    <main>
      <h1>Hello, World</h1>
      <p>this is the current variable: {variable}</p>
      <button onClick={increaseNumber}>(increase +)</button>
      <p></p>
      <button onClick={decreaseNumber}>(decrease -)</button>

      <hr/>
      <h1>Recipes</h1>
      {
        recipes.map((recipe, index) => {
          return (
            <div key={index}>
              <h5 className="font-bold">{recipe.title}</h5>
              <p>{recipe.description}</p>
            </div>
          )
        })
      }
    </main>
  );
}
