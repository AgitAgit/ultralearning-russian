import { createContext, useContext, useState, useEffect } from 'react';
import { getUserVocab } from './CommunicationCenter';
import { addToUserVocab } from '../components/CommunicationCenter';

type AppState = {
  serverAddress: string; // The address of the server
  theme: 'light' | 'dark'; // Theme of the application
  user: {
    username: string | null; // Username of the logged-in user
    vocabulary: string[]; // Vocabulary list for the user
  }; // User information, can be an object or null
  addWordToUserVocab: (word: string, username:string) => Promise<void>; // Function to add a word to the user's vocabulary
  removeWordFromUserVocab: (word: string, username:string) => Promise<void>; // Function to remove a word from the user's vocabulary
  notifications: string[]; // Array of notifications
  currentPage: string; // Current page in the application (e.g., "login", "home", etc.)
  currentTargetLanguage: "russian" | "english"; // Current target language for the user
  currentSourceLanguage: "english" | "hebrew"; // Current source language for the user

}

const initialAppState: AppState = {
  serverAddress: 'http://localhost:3000', // Default server address
  theme: 'light',
  user: {
    username: null,
    vocabulary: [],
  }, // Can be an object { id: string, name: string, isLoggedIn: boolean } or null
  notifications: [], // Array of strings
  currentPage: "login",
  currentTargetLanguage: "russian", // Default target language
  currentSourceLanguage: "english", // Default source language
  // Add more state properties as needed
};

// Create the Context.
// We give it an initial value that can be destructured for default properties,
// though the Provider will override this.
export const AppContext = createContext({
  state: initialAppState,
  setState: (prev) => { }, // Placeholder for the setState function
});

/**
 * StateCenter is a React Context Provider component that holds the central state
 * for the application. It makes the state and a setState function available
 * to all its child components.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 */
const StateCenter = ({ children }) => {
  // Use React's useState hook to manage the central application state.
  const [state, setState] = useState(initialAppState);

  useEffect(() => {
    const fetchUserVocab = async (username) => {
      const vocab = await getUserVocab(state.serverAddress, username);
      setState(prevState => ({ ...prevState, user: { ...prevState.user, vocabulary: vocab } }));
    }
    if (state.user.username) {
      fetchUserVocab(state.user.username)
    }
  }, [state.user.username]);

  async function addWordToUserVocab(word: string, username: string) {
    console.log("state.user.username:", state.user.username);
    console.log("@ss")
    console.log("Adding word:", word);
    const words = word.split(/[, .]+/).map(w => w.trim().toLowerCase()).filter(w => w !== '');
    await addToUserVocab(state.serverAddress, username, words);
    // should add a check to see if the words were added successfully
    setState((prevState) => ({
      ...prevState,
      user: {
        ...prevState.user,
        vocabulary: [...prevState.user.vocabulary, ...words]
      }
    }));

  }
  useEffect(() => {
    console.log("Setting addWordToUserVocab function in state");
    setState((prevState) => ({ ...prevState, addWordToUserVocab }));
  }, []);

  // The context value that will be provided to consumers.
  // This object contains the current state and the function to update it.
  const contextValue = {
    state,
    setState,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Create a Custom Hook to easily consume the context.
/**
 * useAppState is a custom hook to conveniently access the application state
 * and the setState function from the StateCenter context.
 *
 * @returns {object} An object containing the current AppState and the setState function.
 * @throws {Error} If `useAppState` is used outside of a `StateCenter` Provider.
 */
const useAppState = () => {
  const context = useContext(AppContext);
  // Optional: Add a check if you want to enforce that useAppState is used within StateCenter
  // if (context === undefined) {
  //   throw new Error('useAppState must be used within a StateCenter Provider');
  // }
  return context;
};

// Export the component and the hook for use in your application.
export default StateCenter;
// export { useAppState };

/*
// Example Usage in your main App.js or index.js:
import React from 'react';
import StateCenter, { useAppState } from './StateCenter'; // Adjust path as needed

// A child component that consumes the state
const ThemeChanger = () => {
  const { state, setState } = useAppState();

  const toggleTheme = () => {
    setState(prevState => ({
      ...prevState,
      theme: prevState.theme === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: state.theme === 'dark' ? '#333' : '#f0f0f0', color: state.theme === 'dark' ? '#eee' : '#333' }}>
      <p className="text-lg">Current Theme: <span className="font-bold">{state.theme.toUpperCase()}</span></p>
      <button
        onClick={toggleTheme}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Toggle Theme
      </button>
    </div>
  );
};

const UserInfo = () => {
  const { state, setState } = useAppState();

  const login = () => {
    setState(prevState => ({
      ...prevState,
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        isLoggedIn: true,
      },
    }));
  };

  const logout = () => {
    setState(prevState => ({
      ...prevState,
      user: null,
    }));
  };

  return (
    <div className="mt-8 p-4 rounded-lg shadow-lg" style={{ backgroundColor: state.theme === 'dark' ? '#444' : '#fff', color: state.theme === 'dark' ? '#eee' : '#333' }}>
      <h2 className="text-xl font-semibold mb-3">User Status</h2>
      {state.user && state.user.isLoggedIn ? (
        <>
          <p>Logged in as: <span className="font-bold">{state.user.name}</span></p>
          <p>Email: {state.user.email}</p>
          <button
            onClick={logout}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p>No user logged in.</p>
          <button
            onClick={login}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

const NotificationDisplay = () => {
  const { state, setState } = useAppState();
  const [newNotification, setNewNotification] = useState('');

  const addNotification = () => {
    if (newNotification.trim()) {
      setState(prevState => ({
        ...prevState,
        notifications: [...prevState.notifications, newNotification.trim()],
      }));
      setNewNotification('');
    }
  };

  const clearNotifications = () => {
    setState(prevState => ({
      ...prevState,
      notifications: [],
    }));
  };

  return (
    <div className="mt-8 p-4 rounded-lg shadow-lg" style={{ backgroundColor: state.theme === 'dark' ? '#444' : '#fff', color: state.theme === 'dark' ? '#eee' : '#333' }}>
      <h2 className="text-xl font-semibold mb-3">Notifications</h2>
      <input
        type="text"
        value={newNotification}
        onChange={(e) => setNewNotification(e.target.value)}
        placeholder="Add a new notification..."
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ backgroundColor: state.theme === 'dark' ? '#555' : '#fff', color: state.theme === 'dark' ? '#eee' : '#333' }}
      />
      <div className="flex gap-2 mb-4">
        <button
          onClick={addNotification}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 ease-in-out flex-grow"
        >
          Add Notification
        </button>
        <button
          onClick={clearNotifications}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300 ease-in-out flex-grow"
        >
          Clear All
        </button>
      </div>

      {state.notifications.length > 0 ? (
        <ul className="list-disc list-inside">
          {state.notifications.map((notif, index) => (
            <li key={index} className="text-sm py-1">{notif}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};


// Main App component
const App = () => {
  // Load Tailwind CSS script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="font-sans antialiased min-h-screen flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      <StateCenter>
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col gap-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 ease-in-out">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
            Central State Management
          </h1>
          <ThemeChanger />
          <UserInfo />
          <NotificationDisplay />
        </div>
      </StateCenter>
    </div>
  );
};

export default App;
*/