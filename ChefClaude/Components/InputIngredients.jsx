import '../style.css'
import {useRef, useState} from 'react';

export function InputIngredients(props) {
    const inputRef = useRef(null);
    const [error, setError] = useState('');

    function handleUndo() {
        const prev = props.history[props.history.length - 1];
        props.setIngredients(prev);
        props.setHistory(prevHistory => prevHistory.slice(0, -1));
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const value = inputRef.current.value.trim()
        if (value === '') {
            setError('Ingredient name cannot be empty.')
            setTimeout(() => setError(''), 5000)
            return;
        }
        if (props.ingredients.includes(value)) {
            inputRef.current.value = '';
            setError(`${props.ingredients} already exists.`)
            setTimeout(() => setError(''), 5000)
            return;
        }
        setError('');
        props.updateIngredientsList([...props.ingredients, value]);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <form className="add-ingredient-form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                placeholder={error || "e.g. oregano"}
                type="text"
                aria-label="add ingredient"
                name="ingredient"
            />
            <button type='submit' className="add-ingredient-button">
                ADD INGREDIENTS
            </button>
            {props.history.length > 0
                && props.ingredients.length === 0
                && error.length === 0 && (
                    <button
                        type="button"
                        className="undo-button"
                        onClick={handleUndo}
                    >↩️</button>
                )}
        </form>
    );
}
