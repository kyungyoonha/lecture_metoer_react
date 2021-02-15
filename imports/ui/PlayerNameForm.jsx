import React, { useState } from 'react';

export const PlayerNameForm = ({ onSubmit }) => {

    const [name, setName] = useState('')
    return(
        <div className="name-form">
            <form onSubmit={(evt) => {
                evt.preventDefault();
                onSubmit(name)
            }}>
                <p>Type Your name and hit Enter</p>
                <input 
                    type="text" 
                    value={name} 
                    onChange={evt=> {
                    setName(evt.target.value)
                    }} 
                />
            </form>
        </div>
    )
}