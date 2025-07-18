
export async function login(SERVER_ADDRESS:string, username:string, password:string) {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You might add other headers here if needed, e.g., for authentication tokens
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // // Check if the request was successful (status code 2xx)
        // if (!response.ok) {
        //     // If the response is not OK, throw an error with the status and a message
        //     const errorData = await response.json(); // Attempt to parse error message from server
        //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        // }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Login failed:", error);
        // Re-throw the error or return a specific error object
        throw error; // Let the caller handle the error
    }
}

export async function signup(SERVER_ADDRESS:string, username:string, password:string) {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // You might add other headers here if needed, e.g., for authentication tokens
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // // Check if the request was successful (status code 2xx)
        // if (!response.ok) {
        //     // If the response is not OK, throw an error with the status and a message
        //     const errorData = await response.json(); // Attempt to parse error message from server
        //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        // }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Signup failed:", error);
        // Re-throw the error or return a specific error object
        throw error; // Let the caller handle the error
    }
}

export async function getUserVocab(SERVER_ADDRESS:string, username:string) {
    try {
        const response = await fetch(`${SERVER_ADDRESS}/users/words/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // You might add other headers here if needed, e.g., for authentication tokens
            }
        });

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
            // If the response is not OK, throw an error with the status and a message
            const errorData = await response.json(); // Attempt to parse error message from server
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched user vocabulary...:", data);
        return data;

    } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Re-throw the error or return a specific error object
        throw error; // Let the caller handle the error
    }
}
// bookmark last here 2025-07-05
export async function getBooks(SERVER_ADDRESS:string, limit:number = 10, offset:number = 0, language = null, author = null, title = null) {
    try {
        let queryString = "";
        queryString += `limit=${limit}&&offset=${offset}`
        if(language) queryString += `&&language=${language}`
        if(author) queryString += `&&author=${author}`
        if(title) queryString += `&&title=${title}`
        const response = await fetch(`${SERVER_ADDRESS}/books?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // You might add other headers here if needed, e.g., for authentication tokens
            }
        });

        // Check if the request was successful (status code 2xx)
        if (!response.ok) {
            // If the response is not OK, throw an error with the status and a message
            const errorData = await response.json(); // Attempt to parse error message from server
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Fetched books data...:", data);
        return data;

    } catch (error) {
        console.error("Failed to fetch books data:", error);
        // Re-throw the error or return a specific error object
        throw error; // Let the caller handle the error
    }
}

export async function getBookPercent(SERVER_ADDRESS:string, username:string, title:string, author:string, language:string){
    try {
        const response = await fetch(`${SERVER_ADDRESS}/users/known-words-percent`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                title,
                author,
                language
            })
        })
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(error)
    }
}

export async function addToUserVocab(SERVER_ADDRESS:string, username:string, words:string[]){
    try {
        const response = await fetch(`${SERVER_ADDRESS}/users/add-words`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                words
            })
        })
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(error)
    }
}

export async function removeFromUserVocab(SERVER_ADDRESS:string, username:string, words:string[]){
    try {
        const response = await fetch(`${SERVER_ADDRESS}/users/remove-words`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                words
            })
        })
        const data = await response.json()
        return data;
    } catch (error) {
        console.log(error)
    }
}