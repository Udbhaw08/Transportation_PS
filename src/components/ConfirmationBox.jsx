import React from 'react';

const ConfirmationBox = () => {
  const boxStyle = {
    position: 'fixed',
    bottom: '12px',
    left: '10px',
    width: '280px', // ... changed from 400px to 280px ...abhi
    backgroundColor: '#1e3a8a', 
    color: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    fontSize: '0.875rem',
    zIndex: 50,
    height:240,
  };

  const headingStyle = {
    fontWeight: '600',
    marginBottom: '8px',
    fontSize: '1rem',
  };

  const labelStyle = {
    fontWeight: '500',
  };

  const paragraphStyle = {
    marginBottom: '4px',
  };

  const lastParagraphStyle = {
    marginBottom: '12px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  };

  const cancelButtonStyle = {
    backgroundColor: '#374151', // ...abhi
    color: 'white',
    padding: '4px 16px',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
  };

  const verifyButtonStyle = {
    backgroundColor: '#2563eb', // ...abhi
    color: 'white',
    padding: '4px 16px',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={boxStyle}>
      <h2 style={headingStyle}>Confirm verification for exit of</h2>
      <p style={paragraphStyle}><span style={labelStyle}>Convoy:</span> 15B-2025A52</p>
      <p style={paragraphStyle}><span style={labelStyle}>Heading:</span> Haryana cantonment</p>
      <p style={paragraphStyle}><span style={labelStyle}>Exact:</span> TCP03 (KGR/GSB1)</p>
      <p style={paragraphStyle}><span style={labelStyle}>Duration:</span> 10h 48mins</p>
      <p style={paragraphStyle}><span style={labelStyle}>Size:</span> W8 (16 Vehicles)</p>
      <p style={lastParagraphStyle}><span style={labelStyle}>Command VOOC:</span> Col. Vijay Pratap (ID: 57-1J)</p>

      <div style={buttonContainerStyle}>
        <button style={cancelButtonStyle}>Cancel</button>
        <button style={verifyButtonStyle}>Verify</button>
      </div>
    </div>
  );
};

export default ConfirmationBox;
