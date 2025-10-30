'use client'
import { useState } from "react";


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
    </main>
  );
}
