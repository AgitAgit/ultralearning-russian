import React, { useState, useContext } from 'react';
import { AppContext } from '../components/StateCenter';

import Login from './Login';
import Home from './Home';

const Display = () => {
    const { state, setState } = useContext(AppContext)
    return (
        <>
            { state.currentPage === "login" &&
                <Login/>
            }
            { state.currentPage === "home" &&
                <Home/>
            }
        </>
    )
}

export default Display