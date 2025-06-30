import React, { useState, useContext } from 'react';
import { AppContext } from '../components/StateCenter';

import Login from '../components/Login';

const Display = () => {
    const { state, setState } = useContext(AppContext)
    return (
        <>
            { state.currentPage === "login" &&
                <Login/>
            }
        </>
    )
}

export default Display