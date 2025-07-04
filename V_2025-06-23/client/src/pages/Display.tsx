import React, { useState, useContext } from 'react';
import { AppContext } from '../components/StateCenter';

import Login from './Login';
import Home from './Home';
import PdfToServer from '../components/PdfToServer';
import Header from '../components/Header';


const Display = () => {
    const { state, setState } = useContext(AppContext)
    return (
            <div>
                <div style={{ }}>
                    <Header />
                </div>

                {state.currentPage === "login" &&
                    <Login />
                }
                {state.currentPage === "home" &&
                    <Home />
                }
                {state.currentPage === "pdftoserver" && 
                    <PdfToServer />
                }
            </div>
    )
}

export default Display