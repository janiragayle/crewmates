// App.jsx
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [view, setView] = useState('home');
  const [name, setName] = useState('');
  const [speed, setSpeed] = useState('');
  const [color, setColor] = useState('');
  const [crewmates, setCrewmates] = useState([]);

  const fetchCrewmates = async () => {
    const { data, error } = await supabase.from('crewmates').select();
    if (!error) setCrewmates(data);
  };

  const handleCreate = async () => {
    if (!name || !speed || !color) return;
    await supabase.from('crewmates').insert([{ name, speed, color }]);
    setName('');
    setSpeed('');
    setColor('');
    fetchCrewmates();
    setView('gallery');
  };

  useEffect(() => {
    fetchCrewmates();
  }, []);

  return (
    <div className="app">
      <aside>
        <h3>Home</h3>
        <button onClick={() => setView('create')}>Create a Crewmate!</button>
        <button onClick={() => setView('gallery')}>Crewmate Gallery</button>
        <div className="logo" />
      </aside>

      <main>
        {view === 'home' && (
          <div className="center">
            <h1>Welcome to the Crewmate Creator!</h1>
            <p>Here is where you can create your very own set of crewmates before sending them off into space!</p>
            <img src="/crewmates.jpg" alt="Crewmates" />
            <img src="" alt="UFO" />
          </div>
        )}

        {view === 'create' && (
          <div className="center">
            <h1>Create a New Crewmate</h1>
            <img src="/crewmates.png" alt="Crewmates" />
            <div className="card">
              <label>Name:</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter crewmate's name" />
            </div>
            <div className="card">
              <label>Speed (mph):</label>
              <input value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="Enter speed in mph" />
            </div>
            <div className="card">
              <label>Color:</label>
              {["Red", "Green", "Blue", "Purple", "Yellow", "Orange", "Pink", "Rainbow"].map((clr) => (
                <div key={clr}>
                  <input type="radio" name="color" value={clr} onChange={(e) => setColor(e.target.value)} /> {clr}
                </div>
              ))}
            </div>
            <button onClick={handleCreate}>Create Crewmate</button>
          </div>
        )}

        {view === 'gallery' && (
          <div className="center">
            <h1>Your Crewmate Gallery!</h1>
            {crewmates.length === 0 ? (
              <>
                <p>You haven't made a crewmate yet!</p>
                <button onClick={() => setView('create')}>Create one here!</button>
              </>
            ) : (
              <div className="gallery">
                {crewmates.map((mate) => (
                  <div className="crewmate-card" key={mate.id}>
                    <p><strong>Name:</strong> {mate.name}</p>
                    <p><strong>Speed:</strong> {mate.speed} mph</p>
                    <p><strong>Color:</strong> {mate.color}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
