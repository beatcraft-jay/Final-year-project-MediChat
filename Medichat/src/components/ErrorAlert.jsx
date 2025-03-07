// components/ErrorAlert.jsx
import React from 'react';

const ErrorAlert = ({ message }) => (
  <div className="alert alert-danger m-3" role="alert">
    <h4 className="alert-heading">Error</h4>
    <p className="mb-0">{message}</p>
  </div>
);

export default ErrorAlert;