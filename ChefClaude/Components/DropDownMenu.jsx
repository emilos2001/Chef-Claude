import '../style.css'
import React, { useState, useEffect, useRef } from 'react'
export function DropDownMenu(props) {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const recipeRef = useRef(null)
    let displayedIngredients = null
    let displayedRecipe = null

    useEffect(() => {
        if (isOpen && recipeRef.current) {
            recipeRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [isOpen, selected])

    const findIndex = props.suggestions.findIndex(
        (suggestionItem) => suggestionItem === selected
    )

    if (selected && props.suggestions && props.ingredient){

        if (findIndex !== -1 && props.ingredient[findIndex] !== undefined){
            displayedIngredients = <p>{props.ingredient[findIndex]}</p>
        } else {
            displayedIngredients = <p>No Ingredients Found</p>
        }
    }

    if (selected && props.recipes && props.ingredient){
        if (findIndex !== -1 && props.recipes[findIndex] !== undefined){
            displayedRecipe = <p>{props.recipes[findIndex]}</p>
        } else {
            displayedRecipe = <p>No Ingredients Found</p>
        }
    }

    const toggleOpenClose = (recipe) => {
        if (selected === recipe && isOpen){
            setIsOpen(false)
            setSelected(null)
        } else {
            setSelected(recipe)
            setIsOpen(true)
        }
    }

    return(
        <>
            <h3>Suggestions</h3>
            <ul>
                {props.suggestions.map((suggestion, index) => (
                    <li style={{listStyleType: 'none'}} key={index}>
                        <button
                            className="suggestions"
                            onClick={() => toggleOpenClose(suggestion)}
                        >
                            {suggestion}
                        </button>
                    </li>
                ))}
            </ul>
            {isOpen && selected && (
                <>
                    <strong>{selected}</strong>
                    <div ref={recipeRef} className='recipe-content'>
                        <button className='close-recipe' onClick={() => toggleOpenClose(selected)}>X</button>
                        <strong style={{marginLeft:'21px'}}>Ingredients:</strong>
                        {displayedIngredients}
                        <strong style={{marginLeft:'21px'}}>Recipe:</strong>
                        {displayedRecipe}
                    </div>
                </>
            )}
        </>
    )
}