import React, { useState, useContext } from 'react';
import { login, signup } from '../components/CommunicationCenter';
import { AppContext } from '../components/StateCenter';

const Login = () => {
    // State variables for username, password, loading status, and error messages
    const { state, setState } = useContext(AppContext); // Assuming AppContext provides state and setState
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true); // New state to toggle between login and signup

    /**
     * Handles changes in the input fields and updates the corresponding state.
     * @param {Object} e - The event object from the input change.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    /**
     * Handles the form submission for login or signup.
     * Prevents default form submission, calls the appropriate API, and manages
     * loading, success, and error states.
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        setError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages
        setIsLoading(true); // Set loading state to true

        try {
            if (isLogin) {
                // Call the login function
                const userData = await login(username, password);
                if (userData.login) {
                    console.log("Login successful:", userData);
                    setSuccessMessage("Login successful! Welcome.");
                    // last here bookmark check what does userData looks like.
                    setState((prev) => { return { ...prev, user: { username: userData.username }, currentPage:"home" } })
                    // In a real app, you'd store user data/token and redirect.
                } else {
                    throw new Error("Login failed");
                }
            } else {
                // Call the signup function
                const userData = await signup(username, password);
                if (userData.username) {
                    console.log("Signup successful:", userData);
                    setSuccessMessage("Account created successfully! You can now log in.");
                    // Optionally, switch to login form after successful signup
                    setIsLogin(true);
                }
            }
            setUsername(''); // Clear form fields on success
            setPassword('');
        } catch (err) {
            console.error(`${isLogin ? 'Login' : 'Signup'} failed:`, err.message);
            setError(err.message || `An unexpected error occurred during ${isLogin ? 'login' : 'signup'}.`);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const toggleFormType = () => {
        setIsLogin(prevIsLogin => !prevIsLogin);
        setError(''); // Clear errors when toggling
        setSuccessMessage(''); // Clear success message when toggling
        setUsername(''); // Clear fields when toggling
        setPassword('');
    };

    // Inline style objects
    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6', // Equivalent to bg-gray-100
        padding: '1rem', // Equivalent to p-4
        fontFamily: 'Inter, sans-serif' // Equivalent to font-sans
    };

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '2rem', // Equivalent to p-8
        borderRadius: '1rem', // Equivalent to rounded-2xl
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // Equivalent to shadow-xl
        width: '100%',
        maxWidth: '28rem', // Equivalent to max-w-md
        border: '1px solid #e5e7eb' // Equivalent to border border-gray-200
    };

    const headingStyle = {
        fontSize: '1.875rem', // Equivalent to text-3xl
        fontWeight: '800', // Equivalent to font-extrabold
        color: '#1f2937', // Equivalent to text-gray-800
        marginBottom: '1.5rem', // Equivalent to mb-6
        textAlign: 'center'
    };

    const formGroupStyle = {
        marginBottom: '1.5rem' // Equivalent to space-y-6 (used as margin-bottom on direct children of form)
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem', // Equivalent to text-sm
        fontWeight: '500', // Equivalent to font-medium
        color: '#374151', // Equivalent to text-gray-700
        marginBottom: '0.25rem' // Equivalent to mb-1
    };

    const inputStyle = {
        marginTop: '0.25rem', // Equivalent to mt-1
        display: 'block',
        width: '100%', // Equivalent to w-full
        padding: '0.5rem 1rem', // Equivalent to px-4 py-2
        border: '1px solid #d1d5db', // Equivalent to border border-gray-300
        borderRadius: '0.5rem', // Equivalent to rounded-lg
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Equivalent to shadow-sm
        fontSize: '0.875rem', // Equivalent to sm:text-sm
        transition: 'all 150ms ease-in-out' // Equivalent to transition duration-150 ease-in-out
    };

    const inputFocusStyle = {
        outline: 'none', // Equivalent to focus:outline-none
        borderColor: '#3b82f6', // Equivalent to focus:border-blue-500
        ringColor: '#3b82f6', // Equivalent to focus:ring-blue-500
        ringWidth: '2px', // Equivalent to focus:ring-2
    };

    const baseButtonStyle = {
        width: '100%', // Equivalent to w-full
        display: 'flex',
        justifyContent: 'center',
        padding: '0.5rem 1rem', // Equivalent to py-2 px-4
        border: '1px solid transparent', // Equivalent to border border-transparent
        borderRadius: '0.5rem', // Equivalent to rounded-lg
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // Equivalent to shadow-sm
        fontSize: '1.125rem', // Equivalent to text-lg
        fontWeight: '600', // Equivalent to font-semibold
        color: '#fff', // Equivalent to text-white
        transition: 'all 200ms ease-in-out', // Equivalent to transition duration-200 ease-in-out
        cursor: 'pointer'
    };

    const loadingButtonStyle = {
        backgroundColor: '#93c5fd', // Equivalent to bg-blue-400
        cursor: 'not-allowed'
    };

    const regularButtonStyle = {
        backgroundColor: '#2563eb', // Equivalent to bg-blue-600
        // Hover effect needs CSS or a separate style library for true hover states
    };

    const toggleButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#6b7280', // A neutral gray for the toggle button
        marginTop: '1rem', // Add some margin above it
        fontSize: '0.875rem', // Smaller text for toggle
        padding: '0.375rem 0.75rem', // Smaller padding
        boxShadow: 'none',
    };

    const errorBoxStyle = {
        backgroundColor: '#fee2e2', // Equivalent to bg-red-100
        border: '1px solid #ef4444', // Equivalent to border border-red-400
        color: '#b91c1c', // Equivalent to text-red-700
        padding: '1rem', // Equivalent to px-4 py-3
        borderRadius: '0.75rem', // Equivalent to rounded-xl
        marginBottom: '1rem', // Equivalent to mb-4
        fontSize: '0.875rem' // Equivalent to text-sm
    };

    const successBoxStyle = {
        backgroundColor: '#dcfce7', // Equivalent to bg-green-100
        border: '1px solid #22c55e', // Equivalent to border border-green-400
        color: '#15803d', // Equivalent to text-green-700
        padding: '1rem', // Equivalent to px-4 py-3
        borderRadius: '0.75rem', // Equivalent to rounded-xl
        marginBottom: '1rem', // Equivalent to mb-4
        fontSize: '0.875rem' // Equivalent to text-sm
    };

    const boldTextStyle = {
        fontWeight: 'bold'
    };

    const spinnerStyle = {
        animation: 'spin 1s linear infinite', // Equivalent to animate-spin
        marginLeft: '-0.25rem', // Equivalent to -ml-1
        marginRight: '0.75rem', // Equivalent to mr-3
        height: '1.25rem', // Equivalent to h-5
        width: '1.25rem', // Equivalent to w-5
        color: '#fff' // Equivalent to text-white
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={headingStyle}>
                    {isLogin ? 'Login to Your Account' : 'Create Your Account'}
                </h2>

                {/* Display error message if present */}
                {error && (
                    <div style={errorBoxStyle} role="alert">
                        <p style={boldTextStyle}>{isLogin ? 'Login Error!' : 'Signup Error!'}</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Display success message if present */}
                {successMessage && (
                    <div style={successBoxStyle} role="alert">
                        <p style={boldTextStyle}>Success!</p>
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}> {/* space-y-6 */}
                    {/* Username Input */}
                    <div style={formGroupStyle}>
                        <label htmlFor="username" style={labelStyle}>
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            required
                            style={{ ...inputStyle, ...(isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
                            placeholder="Enter your username"
                            aria-label="Username"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={formGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            required
                            style={{ ...inputStyle, ...(isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}
                            placeholder="Enter your password"
                            aria-label="Password"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            style={{ ...baseButtonStyle, ...(isLoading ? loadingButtonStyle : regularButtonStyle) }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    style={spinnerStyle}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        style={{ opacity: 0.25 }}
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        style={{ opacity: 0.75 }}
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                isLogin ? 'Log In' : 'Sign Up'
                            )}
                        </button>
                    </div>
                </form>

                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={toggleFormType}
                    style={toggleButtonStyle}
                    disabled={isLoading}
                >
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
                </button>
            </div>
        </div>
    );
};

export default Login;