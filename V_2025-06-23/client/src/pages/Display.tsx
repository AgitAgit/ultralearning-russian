import React, { useState, useContext } from 'react';
import { AppContext } from '../components/StateCenter';

import Header from '../components/Header';
import Login from './Login';
import Home from './Home';
import PdfToServer from '../components/PdfToServer';
import ProfilePage from './ProfilePage';
import BooksPage from './BooksPage';
import PracticePage from './PracticePage';
import SingleBookPage from './SingleBookPage';

/**
 * Display component is the central app component.
 */
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
                {state.currentPage === "profile" &&
                    <ProfilePage />
                }
                {state.currentPage === "books" &&
                    <BooksPage />
                }
                {state.currentPage === "practice" &&
                    <PracticePage />
                }
                {state.currentPage === "singlebook" &&
                    <SingleBookPage />
                }
            </div>
    )
}

export default Display