import './style.css'
import chef from './assets/chef.png'
import {Form} from './form.jsx'

export function ChefClaude() {
    return(
        <>
            <header className="header">
                <img className='chef-logo' src={chef} alt="Chef Logo"/>
                <h2>Chef Claude</h2>
            </header>
            <Form className='chef-form'/>
        </>
    )
}