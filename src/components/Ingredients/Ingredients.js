import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import { db } from "../../config";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const httpReducer = (currhttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currhttpState, loading: false };
    case "CLEAR":
      return { ...currhttpState, error: null };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    default:
      throw new Error("Should not get reached!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    laoding: false,
    error: null,
  });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    console.log("Rendering Ingredients", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    dispatchHttp({
      type: "SEND",
    });
    fetch(db + ".json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        dispatchHttp({
          type: "RESPONSE",
        });
        return response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredient) => [
        //   ...prevIngredient,
        //   {
        //     id: responseData.name,
        //     ...ingredient,
        //   },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: {
            id: responseData.name,
            ...ingredient,
          },
        });
      });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId) => {
    dispatchHttp({
      type: "SEND",
    });
    fetch(`${db}/${ingredientId}.json`, {
      method: "DELETE",
    })
      .then((_) => {
        dispatchHttp({
          type: "RESPONSE",
        });
        // setUserIngredients((prevIngredient) =>
        //   prevIngredient.filter((ingredient) => {
        //     return ingredient.id !== ingredientId;
        //   })
        // );
        dispatch({
          type: "DELETE",
          id: ingredientId,
        });
      })
      .catch((_) => {
        dispatchHttp({
          type: "ERROR",
          errorMessage: "Something Went Wrong",
        });
      });
  }, []);

  const clearError = useCallback(() => {
    dispatchHttp({
      type: "CLEAR",
    });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredient={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
