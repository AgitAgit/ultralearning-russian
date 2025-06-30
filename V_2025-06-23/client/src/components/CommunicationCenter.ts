const SERVER_ADDRESS = "http://localhost:3000"

export async function login(username:string, password:string) {
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

export async function signup(username:string, password:string) {
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