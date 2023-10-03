import React from 'react';

const HandwrittenSignature = ({ name }) => {
    return (
        <>
            <div>{new Date().toLocaleDateString('fr-FR')}</div>
            <div style={{fontFamily: 'Indie Flower',fontSize:"3rem"}}>{name}</div>
    </>)
};

export default HandwrittenSignature;