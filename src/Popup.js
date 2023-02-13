
import React from 'react'
import ReactDom from 'react-dom'

const POPUP_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '50px',
    zIndex: 1000
}

const OUTER_REGION_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .6)',
    zIndex: 1000
}

const Popup = ({ open, onClose, children }) => {
    if (!open) return null

    return ReactDom.createPortal(
        <>
            <div style={OUTER_REGION_STYLES} />
            <div style={POPUP_STYLES}>
                <div>ID: {children.id}</div>
                <div>Name: {children.name}</div>
                <div>Value: {children.value}</div>
                <div>Row: {children.row}</div>
                <div>Column: {children.col}</div>
                <div>Color: {children.color}</div>
                <br></br>
                <button onClick={onClose}>Close Popup</button>
            </div>
        </>,
        document.getElementById('popup')
    )
}

export default Popup