import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';


const ProfilePage = () => {
    const { state, setState } = useContext(AppContext)

    return (
        <>
            This is the profile page
            { state.user && state.user.username &&
                <div>{`Hello ${state.user.username}`}</div>        
            }
        </>
    )
}

export default ProfilePage