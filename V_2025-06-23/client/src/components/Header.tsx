import React, { useContext } from 'react';
import { AppContext } from './StateCenter';

function Header() {
    const { state, setState } = useContext(AppContext)
    const pages = ["Login", "Home", "pdf to server", "Profile", "Books", "Practice"]
    return (
        <header style={{
            // border:"1px solid black"
            }}>
            {pages.map(page =>
                <button
                    onClick={() => setState(prev => { return { ...prev, currentPage: page.toLowerCase().replaceAll(" ","") } })}>
                    {page}
                </button>)}
            <label>Target Language:</label>
            <select  onChange={(e) => setState(prev => { return { ...prev, currentTargetLanguage: e.target.value } })}>
                <option value="russian">Russian</option>
                <option value="english">English</option>
            </select>
            <label>User's Language:</label>
            <select onChange={(e) => setState(prev => { return { ...prev, currentSourceLanguage: e.target.value } })}>
                <option value="english">English</option>
                <option value="russian">Russian</option>
            </select>
        </header>
    );
}

export default Header;