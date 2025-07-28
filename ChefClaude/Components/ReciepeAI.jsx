import '../style.css'
import {Loading} from "../Loading.jsx";
import {DropDownMenu} from "./DropDownMenu.jsx";
import {useEffect, useRef, useState} from "react";
import {Modal} from "antd";

const API_KEY = 'API_KEY';

export function RecipeAi(props) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showList, setShowList] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [ingredient, setIngredient] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const recipeSection = useRef(null)

    const handleShowList = () => {
        setShowList(prev => !prev);
    };


    useEffect(() => {
        if (showList && !loading && recipeSection.current) {
            recipeSection.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [showList, loading]);
    console.log(props.ingredients);
    const prompt = `what can i cooked using these ingredients:${props.ingredients}, a few suggestinos and full recipe each of them, value in grams`

    async function callApi(prompt) {
        setError('');
        setLoading(prev => !prev);
        if (!API_KEY) {
            setError('API key is not found!');
            setLoading(prev => !prev);
            return;
        }
        try {
            const api_url = `https://api.groq.com/openai/v1/chat/completions`;
            const payLoad = {
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: `user`,
                        content: prompt
                    }
                ]
            };
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payLoad)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
                if (response.status === 400) {
                    setError(`API access denied. This might be due to regional restrictions in your current location or an invalid request.`);
                    Modal.error({
                        className: 'Error',
                        title: errorData.message || 'INVALID REQUEST',
                        content: 'Please check your API key and region.'
                    });
                } else {
                    Modal.error({
                        className: 'Error',
                        title: `HTTP Error: ${response.status}`,
                        content: errorData.message || 'An unexpected error occurred.'
                    });
                }
                throw new Error(errorData.message || `HTTP error: ${response.status}`);
            }
            const result = await response.json();
            const content = result?.choices?.[0]?.message?.content?.trim();
            if (content) {
                return content;
            } else {
                throw new Error(`Unexpected API response structure or empty content.`);
            }
        } catch (error) {
            setError(error.message || 'Could not connect to the API or an unhandled error occurred.');
            Modal.error({
                className: 'Error',
                title: 'API Call Failed',
                content: error.message || 'Could not connect to the API or an unhandled error occurred.'
            });
        } finally {
            setLoading(prev => !prev);
        }
    }


    const handleClick = async () => {
        if (!showList) {
            setShowList(true);
        }
        setRecipes([]);
        setSuggestions([]);

        try {
            const response = await callApi(prompt);
            if (response) {
                const suggestionList = [...response.matchAll(/\*\*(.+?)\*\*/g)]
                    .map(match => match[1]
                        .replace(/\*/g, '')
                        .replace(/Dish \d+:/, '')
                        .trim()
                    );
                setSuggestions(suggestionList || []);
                const ingredient = [...response.matchAll(/Ingredients:\s*\n([\s\S]*?)(?:\n\n|$)/g)]
                    .map(match => match[1]
                        .replace(/\*/g, '')
                        .trim()
                    );
                setIngredient(ingredient || []);
                const recipe = [...response.matchAll(/Instructions:\s*\n([\s\S]*?)(?:\n\n|$)/g)]
                    .map(match => match[1]
                        .replace(/\*/g, '')
                        .trim()
                    );
                setRecipes(recipe || []);
                console.log('Ingredients:', ingredient);
                console.log('Recipes:', recipe);
            } else {
                setSuggestions([]);
                setRecipes([]);
            }

        } catch (err) {
            console.log(`Error during ingredient processing: ${err}`);
            setSuggestions([])
            setRecipes([]);
        }
    };



    return (
        <>
            <div className='recipe-list-container'>
                {showList ? (<button className='recipe-list-button' onClick={handleShowList}>
                        Hide recipe
                    </button>
                ) : (<button className='recipe-list-button' onClick={handleClick}>
                        Show recipe
                    </button>
                )}
                {loading && <Loading loading={loading}/>}
            </div>
            <div className='recipe-list-title'>
                {showList && !loading &&
                    <h2><u>Chef Claude Recommends</u></h2>
                }
            </div>
            <div className='recipe-list-error'>
                {error && <p>{error}</p>}
            </div>
            <div ref={recipeSection} className='recipe-list-content'>
                {showList && !loading &&(
                    <DropDownMenu recipes={recipes} suggestions={suggestions} ingredient={ingredient}/>
                )}
            </div>
        </>
    );
}