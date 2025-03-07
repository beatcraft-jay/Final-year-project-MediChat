import React from 'react';

const Loader = () => (
    <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

export default Loader;