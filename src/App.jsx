import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Typed from 'typed.js';

function App() {
  const [settings, setSettings] = useState({
    length: 8,
    numberAllowed: false,
    charAllowed: false,
  });
  const [password, setPassword] = useState('');
  const passwordRef = useRef(null);
  const typedRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const passwordGenerator = useCallback(() => {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (settings.numberAllowed) str += '0123456789';
    if (settings.charAllowed) str += '!#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    for (let i = 0; i < settings.length; i++) {
      const char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [settings]);

  const copyToClipboard = useCallback(() => {
    if (passwordRef.current) {
      passwordRef.current.select();
      window.navigator.clipboard.writeText(password);
    }
  }, [password]);

  const toggleDisplay = () => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  };

  useEffect(() => {
    passwordGenerator();
  }, [settings, passwordGenerator]);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ['Password Copied To Clipboard Successfully'],
      typeSpeed: 40,
      backSpeed: 10,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, [isVisible]);

  const handleChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };

  return (
    <>
      <div className="container w-full max-w-4xl mx-auto shadow-md rounded-xl px-4 mt-40 h-80">
        <h1 className="text-white text-center text-2xl my-3">Password Generator</h1>
        <div className="flex items-center shadow rounded-lg overflow-hidden mt-16 mb-8">
          <input
            type="text"
            value={password}
            className="outline-none text-2xl w-full py-1 px-3 rounded-lg"
            placeholder="password"
            readOnly
            ref={passwordRef}
          />
          <button onClick={() => { copyToClipboard(); toggleDisplay(); }} className="button outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 mx-2 rounded-lg text-2xl">
            Copy
          </button>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-4 text-2xl">
          <div className="range-container flex items-center gap-x-2 w-full sm:w-auto">
            <input
              type="range"
              name="length"
              min={8}
              max={25}
              value={settings.length}
              className="cursor-pointer w-full sm:w-auto"
              id="slider"
              onChange={handleChange}
            />
            <label className="w-36">Length: {settings.length}</label>
          </div>
          <div className="flex items-center text-2xl w-full sm:w-auto">
            <input
              className="cursor-pointer checkBox-input"
              type="checkbox"
              name="numberAllowed"
              id="numberInput"
              checked={settings.numberAllowed}
              onChange={handleChange}
            />
            <label className="checkBox w-36" htmlFor="numberInput">Numbers</label>
          </div>
          <div className="flex items-center text-2xl w-full sm:w-auto">
            <input
              className="cursor-pointer checkBox-input"
              type="checkbox"
              name="charAllowed"
              id="characterInput"
              checked={settings.charAllowed}
              onChange={handleChange}
            />
            <label className="checkBox w-36" htmlFor="characterInput">Characters</label>
          </div>
        </div>
      </div>
      <div className="text-4xl w-full py-2" style={{ display: isVisible ? 'block' : 'none' }}>
        <h1 className="text-center text-white font-bold" ref={typedRef}></h1>
      </div>
    </>
  );
}

export default App;
