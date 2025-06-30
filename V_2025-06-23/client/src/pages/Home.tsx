import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../components/StateCenter';


const Home = () => {
    const { state, setState } = useContext(AppContext)

    // const [username, setUsername] = useState(state.user.username)

    // useEffect(() => {
    //     setUsername(state.user.username)
    // },[state.user])

    return (
        <>
            {/* <div>{`Hello ${username}`}</div>         */}
            <div>{`Hello ${state.user.username}`}</div>        
        </>
    )
}

export default Home