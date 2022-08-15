// Context Module Functions
// http://localhost:3000/isolated/exercise/01.js

import React, { useState, createContext, useContext, useReducer } from 'react'
import { dequal } from 'dequal'

// ./context/user-context.js

import * as userClient from '../user-client'
import { useAuth } from '../auth-context'

const UserContext = createContext()
UserContext.displayName = 'UserContext'

function userReducer(state, action) {
    switch (action.type) {
        case 'START_UPDATE': {
            return {
                ...state,
                user: { ...state.user, ...action.updates },
                status: 'pending',
                storedUser: state.user,
            }
        }
        case 'FINISH_UPDATE': {
            return {
                ...state,
                user: action.updatedUser,
                status: 'resolved',
                storedUser: null,
                error: null,
            }
        }
        case 'FAIL_UPDATE': {
            return {
                ...state,
                status: 'rejected',
                error: action.error,
                user: state.storedUser,
                storedUser: null,
            }
        }
        case 'RESET': {
            return {
                ...state,
                status: null,
                error: null,
            }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function UserProvider({ children }) {
    const { user } = useAuth()
    const [state, dispatch] = useReducer(userReducer, {
        status: null,
        error: null,
        storedUser: user,
        user,
    })
    const value = [state, dispatch]

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

function useUser() {
    const context = useContext(UserContext)

    if (context === undefined) {
        throw new Error(`useUser must be used within a UserProvider`)
    }

    return context
}

const updateUser = async (dispatch, user, updates) => {
    dispatch({ type: 'START_UPDATE', updates: updates })

    try {
        const updatedUser = await userClient.updateUser(user, updates)
        dispatch({ type: 'FINISH_UPDATE', updatedUser })
        return updateUser
    } catch (error) {
        dispatch({ type: 'FAIL_UPDATE', error })
        throw error
    }
}

// export {UserProvider, useUser, updatedUser}

// src/screens/user-profile.js
// import {UserProvider, useUser, updatedUser} from './context/user-context'
function UserSettings() {
    const [{ user, status, error }, userDispatch] = useUser()
    const [formState, setFormState] = useState(user)

    const isPending = status === 'pending'
    const isRejected = status === 'rejected'
    const isChanged = !dequal(user, formState)

    const handleChange = e =>
        setFormState({ ...formState, [e.target.name]: e.target.value })

    function handleSubmit(e) {
        e.preventDefault()

        updateUser(userDispatch, user, formState)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block' }} htmlFor="username">
                    Username
                </label>
                <input
                    id="username"
                    name="username"
                    disabled
                    readOnly
                    value={formState.username}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block' }} htmlFor="tagline">
                    Tagline
                </label>
                <input
                    id="tagline"
                    name="tagline"
                    value={formState.tagline}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block' }} htmlFor="bio">
                    Biography
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formState.bio}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                />
            </div>
            <div>
                <button
                    type="button"
                    onClick={() => {
                        setFormState(user)
                        userDispatch({ type: 'RESET' })
                    }}
                    disabled={!isChanged || isPending}
                >
                    Reset
                </button>
                <button
                    type="submit"
                    disabled={(!isChanged && !isRejected) || isPending}
                >
                    {isPending
                        ? '...'
                        : isRejected
                        ? '✖ Try again'
                        : isChanged
                        ? 'Submit'
                        : '✔'}
                </button>
                {isRejected ? (
                    <pre style={{ color: 'red' }}>{error.message}</pre>
                ) : null}
            </div>
        </form>
    )
}

function UserDataDisplay() {
    const [{ user }] = useUser()
    return <pre>{JSON.stringify(user, null, 2)}</pre>
}

function App() {
    return (
        <div
            style={{
                minHeight: 350,
                width: 300,
                backgroundColor: '#ddd',
                borderRadius: 4,
                padding: 10,
            }}
        >
            <UserProvider>
                <UserSettings />
                <UserDataDisplay />
            </UserProvider>
        </div>
    )
}

export default App
