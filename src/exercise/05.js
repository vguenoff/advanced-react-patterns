// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import React, { useState, useRef, useReducer } from 'react'
import { Switch } from '../switch'

const callAll =
    (...fns) =>
    (...args) =>
        fns.forEach(fn => fn?.(...args))

const actionTypes = {
    TOGGLE: 'TOGGLE',
    RESET: 'RESET',
}

function toggleReducer(state, { type, initialState }) {
    const { TOGGLE, RESET } = actionTypes

    switch (type) {
        case TOGGLE:
            return { on: !state.on }
        case RESET:
            return initialState
        default:
            throw new Error(`Unsupported type: ${type}`)
    }
}

function useToggle({ initialOn = false, reducer = toggleReducer } = {}) {
    const { TOGGLE, RESET } = actionTypes

    const { current: initialState } = useRef({ on: initialOn })
    const [state, dispatch] = useReducer(reducer, initialState)
    const { on } = state

    const toggle = () => dispatch({ type: TOGGLE })
    const reset = () => dispatch({ type: RESET, initialState })

    const getTogglerProps = ({ onClick, ...props } = {}) => {
        return {
            'aria-pressed': on,
            onClick: callAll(onClick, toggle),
            ...props,
        }
    }

    const getResetterProps = ({ onClick, ...props } = {}) => {
        return {
            onClick: callAll(onClick, reset),
            ...props,
        }
    }

    return {
        on,
        reset,
        toggle,
        getTogglerProps,
        getResetterProps,
    }
}

function App() {
    const [timesClicked, setTimesClicked] = useState(0)
    const clickedTooMuch = timesClicked >= 4
    const { TOGGLE } = actionTypes

    function toggleStateReducer(state, action) {
        if (action.type === TOGGLE && timesClicked >= 4) {
            return { on: state.on }
        }

        return toggleReducer(state, action)
    }

    const { on, getTogglerProps, getResetterProps } = useToggle({
        reducer: toggleStateReducer,
    })

    return (
        <div>
            <Switch
                {...getTogglerProps({
                    disabled: clickedTooMuch,
                    on: on,
                    onClick: () => setTimesClicked(count => count + 1),
                })}
            />
            {clickedTooMuch ? (
                <div data-testid="notice">
                    Whoa, you clicked too much!
                    <br />
                </div>
            ) : timesClicked > 0 ? (
                <div data-testid="click-count">Click count: {timesClicked}</div>
            ) : null}
            <button
                {...getResetterProps({ onClick: () => setTimesClicked(0) })}
            >
                Reset
            </button>
        </div>
    )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
