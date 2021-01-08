import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import { db } from "../../config";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  useEffect(() => {
    fetch(db)
      .then((response) => response.json())
      .then((responseData) => {
        // console.log(responseData);
        const loadedIngredients = [];
        for (const key in responseData) {
          // console.log(responseData[key].ingredient);
          loadedIngredients.push({
            id: key,
            title: responseData[key].ingredient.title,
            amount: responseData[key].ingredient.amount,
          });
        }
        setUserIngredients(loadedIngredients);
        // console.log(loadedIngredients);
      });
  }, []);

  const filteredIngredientsHandler = (filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  };

  const addIngredientHandler = (ingredient) => {
    fetch(db, {
      method: "POST",
      body: JSON.stringify({ ingredient }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredient) => [
          ...prevIngredient,
          {
            id: responseData.name,
            ...ingredient,
          },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredient) =>
      prevIngredient.filter((ingredient) => {
        return ingredient.id !== ingredientId;
      })
    );
  };
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredient={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
