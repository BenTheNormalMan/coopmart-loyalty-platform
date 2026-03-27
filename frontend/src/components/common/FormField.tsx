import React from 'react';
import './FormField.css';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, className = '', ...props }: FormFieldProps) {
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id} className="form-label">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input 
        id={id} 
        className={`form-input ${error ? 'input-error' : ''}`} 
        {...props} 
      />
      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
