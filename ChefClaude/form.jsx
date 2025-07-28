import {useEffect, useRef, useState} from "react";
import "./style.css"
import {IngredientList} from "./Components/IngredientList.jsx";
import {InputIngredients} from "./Components/InputIngredients.jsx";
import {RecipeAi} from "./Components/ReciepeAI.jsx";

export function Form() {
    const [ingredients, setIngredients] = useState([])
    const [history, setHistory] = useState([])
    const [recipeShown, setRecipeShown] = useState(false)
    function updateIngredientsList(newIngredients) {
        setHistory(prevHistory => [...prevHistory, ingredients])
        setIngredients(newIngredients)
    }


    function showHideRecipe() {
        setRecipeShown(prevState => !prevState)
    }

    return (
        <>
            <InputIngredients
                ingredients={ingredients}
                setIngredients={setIngredients}
                history={history}
                setHistory={setHistory}
                updateIngredientsList={updateIngredientsList}
            />
            {ingredients.length > 0 && <IngredientList
                ingredients={ingredients}
                setIngredients={setIngredients}
                updateIngredientsList={updateIngredientsList}
                showHideRecipe={showHideRecipe}
                recipeShown={recipeShown}
                setRecipeShown={setRecipeShown}
            />}
        </>)
}