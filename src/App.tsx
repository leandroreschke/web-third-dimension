import { Canvas } from '@react-three/fiber';
import './App.css';
import React, { useState } from 'react';
import { Computer } from './components/Computer';
import { Space } from './components/Space';

import DiscMenu from './components/Disc3DMenu';

function App() {
  const [currentScene, setCurrentScene] = useState<number>(0);

  const scenes = [
    <Space zoom orbit />,
    <Canvas className="fade-in"><Computer /></Canvas>,
    <DiscMenu />,
  ]

  return (<div className='App'>
    <button onClick={() => setCurrentScene(currentScene + 1 === scenes.length ? 0 : currentScene + 1)}>Change scene</button>
    <div style={{ height: '100vh' }} >

      {scenes[currentScene]}
    </div>
  </div>
  )

}

export default App;
