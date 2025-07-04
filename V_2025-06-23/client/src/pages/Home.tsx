import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';


const Home = () => {
    const { state, setState } = useContext(AppContext)

    return (
        <>
            This is the home page
            { state.user && state.user.username &&
                <div>{`Hello ${state.user.username}`}</div>        
            }
        </>
    )
}

export default Home