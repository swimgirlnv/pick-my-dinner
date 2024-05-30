import React, { useState } from 'react';

const ManualSuggestions = ({ setSuggestions }) => {
  const [input, setInput] = useState('');

  const handleAddSuggestion = () => {
    setSuggestions(prev => [...prev, input]);
    setInput('');
  };

  return (
    <div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Enter suggestion" 
      />
      <button onClick={handleAddSuggestion}>Add</button>
    </div>
  );
};

export default ManualSuggestions;
