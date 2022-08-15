// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import React, { useState, cloneElement, Children } from 'react'
import { Switch } from '../switch'

function Toggle({ children }) {
    const [on, setOn] = useState(false)
    const toggle = () => setOn(!on)

    // 📜 https://reactjs.org/docs/react-api.html#reactchildren
    // 📜 https://reactjs.org/docs/react-api.html#cloneelement

    // return <Switch on={on} onClick={toggle} />
    return Children.map(children, child => {
        const newChild = cloneElement(child, { on, toggle })
        // console.log(child)
        if (typeof child.type === 'string') return child

        return newChild
    })
}

// 🐨 Flesh out each of these components

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({ on, children }) => (on ? children : null)

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({ on, children }) => (on ? null : children)

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = ({ on, toggle, ...props }) => (
    <Switch {...{ on }} onClick={toggle} {...props} />
)

function App() {
    return (
        <div>
            <Toggle>
                <ToggleOn>The button is on</ToggleOn>
                <ToggleOff>The button is off</ToggleOff>
                <span>hello</span>
                <ToggleButton />
            </Toggle>
        </div>
    )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
