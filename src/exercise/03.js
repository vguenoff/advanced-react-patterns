// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import React, { useState, createContext, useContext } from 'react'
import { Switch } from '../switch'

const ToggleContext = createContext()
ToggleContext.displayName = 'ToggleContext'

const Toggle = ({ children }) => {
    const [on, setOn] = useState(false)
    const toggle = () => setOn(!on)

    return <ToggleContext.Provider value={{ on, toggle }} {...{ children }} />
}

const useToggleValue = () => {
    const context = useContext(ToggleContext)

    if (context === undefined) {
        throw new Error('useToggleValue must be used within a context provider')
    }

    return context
}

const ToggleOn = ({ children }) => {
    const { on } = useToggleValue()

    return on ? children : null
}

const ToggleOff = ({ children }) => {
    const { on } = useToggleValue()

    return on ? null : children
}

const ToggleButton = ({ ...props }) => {
    const { on, toggle } = useToggleValue()

    return <Switch {...{ on }} onClick={toggle} {...props} />
}

function App() {
    // return <ToggleButton />

    return (
        <div>
            <Toggle>
                <ToggleOn>The button is on</ToggleOn>
                <ToggleOff>The button is off</ToggleOff>
                <div>
                    <ToggleButton />
                </div>
            </Toggle>
        </div>
    )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
