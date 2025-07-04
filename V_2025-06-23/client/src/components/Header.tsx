import React, { useContext } from 'react';
import { AppContext } from './StateCenter';

function Header() {
    const { state, setState } = useContext(AppContext)
    const pages = ["Login", "Home", "pdf to server"]
    return (
        <header style={{
            // border:"1px solid black"
            }}>
            {pages.map(page =>
                <button
                    onClick={() => setState(prev => { return { ...prev, currentPage: page.toLowerCase().replaceAll(" ","") } })}>
                    {page}
                </button>)}
        </header>
    );
}

export default Header;