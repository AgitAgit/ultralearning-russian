import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';
import { getUserVocab } from '../components/CommunicationCenter';

const ProfilePage = () => {
    const { state, setState } = useContext(AppContext)
    const vocab = state.user.vocabulary || [];

    return (
        <>
            This is the profile page
            { state.user && state.user.username &&
                <div>{`Hello ${state.user.username}`}</div>        
            }
            <div>
                <h2>Your Vocabulary</h2>
                {vocab.length > 0 ? (
                    <ul>
                        {vocab.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No vocabulary words found.</p>
                )}
            </div>
        </>
    )
}

export default ProfilePage