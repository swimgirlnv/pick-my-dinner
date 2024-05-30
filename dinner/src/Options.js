import React from 'react';

const Options = ({ setChoice }) => (
  <div>
    <button onClick={() => setChoice('stay-in')}>Stay In</button>
    <button onClick={() => setChoice('go-out')}>Go Out</button>
  </div>
);

export default Options;
