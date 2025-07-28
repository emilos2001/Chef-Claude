import chef from './assets/chef.png'
import './style.css'

export function Loading(props){

    return (
        <>
            {props.loading && (
                <div className="loading">
                    <img className='loading-img' src={chef} alt="Loading..." />
                    <h2 className='loading-text'>Loading...</h2>
                </div>
            )}
        </>
    );
}