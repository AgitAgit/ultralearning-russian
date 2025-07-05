import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';


const PracticePage = () => {
    const { state, setState } = useContext(AppContext)

    return (
        <>
            This is the practice page
            { state.user && state.user.username &&
                <div>{`Hello ${state.user.username}`}</div>        
            }
        </>
    )
}

export default PracticePage