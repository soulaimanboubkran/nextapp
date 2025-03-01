import React, { useState } from 'react';

export default function Test() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');

  const handleSet = async () => {
    const response = await fetch('/api/redis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    const data = await response.json();
    setResult(data.message);
  };

  const handleGet = async () => {
    const response = await fetch(`/api/redis?key=${key}`);
    const data = await response.json();
    setResult(`Value for key "${key}": ${data.value}`);
  };

  return (
    <div>
      <h1>Redis with Next.js (API Route)</h1>
      <div>
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleSet}>Set Value</button>
        <button onClick={handleGet}>Get Value</button>
      </div>
      <div>
        <p>{result}</p>
      </div>
    </div>
  );
}