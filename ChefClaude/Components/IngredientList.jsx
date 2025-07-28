import { useState} from "react";
import '../style.css'
import {RecipeAi} from "./ReciepeAI.jsx";

export function IngredientList(props) {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState('');

    function deleteAllIngredients() {
        props.updateIngredientsList([])
    }

    function deleteIngredient(index) {
        const updated = [...props.ingredients];
        updated.splice(index, 1);
        props.updateIngredientsList(updated);
    }

    function handleEdit(index) {
        setEditingIndex(index)
        setEditingText(props.ingredients[index])
        if (props.ingredients[index] === props.ingredients[index - 1]) {
            console.log(`${props.ingredients[index]} already exists.`)
        }
    }

    function handleChange(e) {
        setEditingText(e.target.value)
    }

    function handleBlur() {
        const updated = [...props.ingredients];
        updated[editingIndex] = editingText;
        props.updateIngredientsList(updated);
        setEditingIndex(null);
        setEditingText('');
    }
    return (<section>
            <h2>Ingredients on hand:</h2>
            <ul className='ingredients-list'>
                {props.ingredients.map((ingredient, index) => (<li key={index}>
                    {editingIndex === index ? (<>
                        <input
                            type='text'
                            value={editingText}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoFocus
                        />
                        <button className='edit-ingredient-button' onClick={() => handleEdit(index)}>
                            ✅
                        </button>
                    </>) : (<>
                        {ingredient}
                        <button className='edit-ingredient-button' onClick={() => handleEdit(index)}>
                            ✏️
                        </button>
                    </>)}
                    <button
                        onClick={() => deleteIngredient(index)}
                        className="delete-ingredient-button">
                        🗑️
                    </button>
                </li>))}
            </ul>
            <button onClick={deleteAllIngredients} className='del-all-ingredients-button'>
                DELETE INGREDIENTS
            </button>
            {props.ingredients.length >= 3 ? (<div className="get-recipe-container" ref={props.ref}>
                <div>
                    <h3>Ready for recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
            </div>) : (<p className='warning-get-recipe-container'>⚠️To get a recipe need to have at least 3 different
                ingredients</p>)}
            {props.ingredients.length >= 3 && <RecipeAi ingredients={props.ingredients} setIngridients={props.setIngredients}/>}
        </section>
    )
}