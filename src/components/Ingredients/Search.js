import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";
import { db } from "../../config";

const Search = React.memo((props) => {
  const { onLoadIngredient } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
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
        onLoadIngredient(loadedIngredients);
      });
  }, [enteredFilter, onLoadIngredient]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(e) => {
              setEnteredFilter(e.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
