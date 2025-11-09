// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';

// // ---------------- CONFIGURATION ----------------
// const API_BASE_URL = 'http://localhost:3001/api';

// // ---------------- UTILITY: Poseidon Hash ----------------
// // This function safely uses Poseidon hash from window.snarkjs (browser build)
// const calculateHash = async (pin) => {
//   const zk = window.snarkjs;

//   if (!zk) throw new Error("SnarkJS not loaded yet. Please refresh the page.");

//   // Some snarkjs builds expose poseidon directly instead of zk.crypto.poseidon
//   const poseidonFn = zk.crypto?.poseidon || zk.poseidon;
//   if (!poseidonFn) throw new Error("Poseidon hash not found in SnarkJS build.");

//   try {
//     const hashValue = await poseidonFn([pin]);
//     return hashValue.toString(); // Convert BigInt to string
//   } catch (err) {
//     console.error("Poseidon Hash Error:", err);
//     throw new Error("Failed to compute Poseidon hash.");
//   }
// };

// // ---------------- COMPONENT: Register ----------------
// const RegisterForm = ({ setView }) => {
//   const [formData, setFormData] = useState({ name: '', email: '', college: '', pin: '' });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [zkId, setZkId] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.pin.length < 5 || isNaN(formData.pin)) {
//       setMessage('PIN must be at least 5 digits (numeric).');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       const zk_id_hash = await calculateHash(formData.pin);

//       const response = await axios.post(`${API_BASE_URL}/register-id`, {
//         name: formData.name,
//         email: formData.email,
//         college: formData.college,
//         zk_id_hash: zk_id_hash,
//       });

//       setZkId(response.data.zk_id);
//       localStorage.setItem('zk_id_pass', response.data.zk_id);

//       setMessage('✅ Passport successfully created and registered on-chain!');
//     } catch (error) {
//       const msg = error.response?.data?.message || error.message || "Registration failed.";
//       setMessage(`❌ ${msg}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-zk-secondary rounded-xl shadow-2xl w-full max-w-lg">
//       <h2 className="text-3xl font-bold text-zk-highlight mb-4">Passport Office (Register)</h2>
//       <p className="text-gray-300 mb-6">Create your one-time ZK-Event-Pass ID.</p>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition"
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition"
//         />

//         <input
//           type="text"
//           name="college"
//           placeholder="College/Organization"
//           value={formData.college}
//           onChange={handleChange}
//           className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition"
//         />

//         <input
//           type="password"
//           name="pin"
//           placeholder="Private PIN (Numeric Secret)"
//           value={formData.pin}
//           onChange={handleChange}
//           required
//           className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition"
//         />

//         <button
//           type="submit"
//           disabled={loading || zkId}
//           className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${
//             loading ? 'bg-gray-500' : 'bg-zk-highlight hover:bg-zk-highlight/80'
//           }`}
//         >
//           {loading ? 'Creating Passport...' : 'Register ZK-Event-Pass'}
//         </button>
//       </form>

//       {message && (
//         <p
//           className={`mt-4 p-3 rounded-lg text-sm ${
//             message.startsWith('❌')
//               ? 'bg-red-900/50 text-red-300'
//               : 'bg-green-900/50 text-green-300'
//           }`}
//         >
//           {message}
//         </p>
//       )}

//       {zkId && (
//         <div className="mt-4 p-4 text-xs bg-zk-bg rounded-lg border border-green-500/50">
//           <p className="text-green-400 font-bold mb-2">Registration Success!</p>
//           <p>
//             Your Anonymous ZK-ID is: <code className="break-all">{zkId}</code>
//           </p>
//           <p className="mt-1 text-gray-400">
//             NOTE: Your private data is now secured in our DB, linked to this on-chain ZK-ID.
//           </p>
//           <button
//             onClick={() => setView('event')}
//             className="mt-3 w-full p-2 bg-zk-highlight/20 text-zk-highlight rounded-lg hover:bg-zk-highlight/30"
//           >
//             Go to Event
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // ---------------- COMPONENT: Event ----------------
// const EventForm = ({ setView }) => {
//   const [secretPin, setSecretPin] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [verifiedData, setVerifiedData] = useState(null);
//   const zkId = useMemo(() => localStorage.getItem('zk_id_pass'), []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     if (!zkId) {
//       setMessage('❌ Error: ZK-ID not found locally. Please register first.');
//       setLoading(false);
//       return;
//     }

//     const zk = window.snarkjs;
//     if (!zk) {
//       setMessage('❌ Error: SnarkJS is not loaded globally.');
//       setLoading(false);
//       return;
//     }

//     try {
//       setMessage('Generating ZK-Proof in browser...');

//       const input = { secret: secretPin };
//       const { proof, publicSignals } = await zk.groth16.fullProve(
//         input,
//         "/circuit.wasm",
//         "/circuit_final.zkey"
//       );

//       if (publicSignals[0] !== zkId) {
//         setMessage('❌ PIN is incorrect or does not match your registered ZK-ID.');
//         setLoading(false);
//         return;
//       }

//       setMessage('✅ Proof Generated. Sending to Server for On-Chain Verification...');

//       const response = await axios.post(`${API_BASE_URL}/register-for-event`, {
//         proof: proof,
//         publicHash: publicSignals[0],
//       });

//       setVerifiedData(response.data.verifiedData);
//       setMessage(`🚀 Success: ${response.data.message}`);
//     } catch (error) {
//       const msg = error.response?.data?.message || error.message || "Verification failed.";
//       setMessage(`❌ ${msg}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (verifiedData) {
//     return (
//       <div className="p-8 bg-green-900/40 rounded-xl shadow-2xl w-full max-w-lg border border-green-500/50">
//         <h2 className="text-3xl font-bold text-green-400 mb-4">Registration Complete!</h2>
//         <p className="text-gray-300 mb-6">You are successfully registered for the event.</p>
//         <div className="space-y-3 p-4 bg-zk-bg rounded-lg">
//           <p className="text-sm text-green-400">
//             Data provided to Organizer (Verified via ZK-Proof):
//           </p>
//           <p className="text-lg font-semibold">{verifiedData.name}</p>
//           <p className="text-sm">{verifiedData.email}</p>
//           <p className="text-xs text-gray-400 break-all">ZK-ID: {verifiedData.zk_id}</p>
//         </div>
//         <button
//           onClick={() => setView('register')}
//           className="mt-4 w-full p-2 bg-zk-highlight/20 text-zk-highlight rounded-lg hover:bg-zk-highlight/30"
//         >
//           Back to Register
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 bg-zk-secondary rounded-xl shadow-2xl w-full max-w-lg">
//       <h2 className="text-3xl font-bold text-zk-highlight mb-4">Event Registration</h2>
//       <p className="text-gray-300 mb-6">
//         Register using your ZK-Event-Pass.{" "}
//         <span className="text-red-300 block">
//           Your PIN proves ownership, without revealing it.
//         </span>
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//         <input
//           type="password"
//           placeholder="Enter Private PIN"
//           value={secretPin}
//           onChange={(e) => setSecretPin(e.target.value)}
//           required
//           className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition"
//         />
//         <button
//           type="submit"
//           disabled={loading || !zkId}
//           className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${
//             loading ? 'bg-gray-500' : 'bg-zk-highlight hover:bg-zk-highlight/80'
//           }`}
//         >
//           {loading ? 'Verifying ZK-Proof...' : 'Register with ZK-Event-Pass'}
//         </button>
//       </form>

//       {message && (
//         <p
//           className={`mt-4 p-3 rounded-lg text-sm ${
//             message.startsWith('❌')
//               ? 'bg-red-900/50 text-red-300'
//               : 'bg-green-900/50 text-green-300'
//           }`}
//         >
//           {message}
//         </p>
//       )}

//       <button
//         onClick={() => setView('register')}
//         className="mt-4 w-full p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30"
//       >
//         Back to Passport Office
//       </button>
//     </div>
//   );
// };

// // ---------------- MAIN APP ----------------
// function App() {
//   const [view, setView] = useState('register');
//   const [snarkjsLoaded, setSnarkjsLoaded] = useState(false);
//   const [retries, setRetries] = useState(0);

//   // Wait for snarkjs to load (up to 3 seconds)
//   useEffect(() => {
//     const maxRetries = 30;

//     if (window.snarkjs && (window.snarkjs.crypto || window.snarkjs.poseidon)) {
//       setSnarkjsLoaded(true);
//       return;
//     }

//     if (retries >= maxRetries) {
//       setSnarkjsLoaded(false);
//       return;
//     }

//     const timer = setTimeout(() => setRetries(r => r + 1), 100);
//     return () => clearTimeout(timer);
//   }, [retries]);

//   if (!snarkjsLoaded) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4">
//         <h1 className="text-4xl font-extrabold text-red-500 mb-6">
//           ZK-Proof Engine Loading...
//         </h1>
//         <div className="bg-red-900/30 p-6 rounded-xl max-w-xl shadow-lg border border-red-500/50">
//           <p className="text-red-300 mb-4 font-semibold">
//             ZK Engine is loading ({Math.min(retries * 100, 3000)}ms wait)...
//           </p>
//           <p className="text-sm text-gray-300">
//             If this screen does not disappear, please verify:
//           </p>
//           <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 mt-3">
//             <li>
//               Is <code className="text-green-400">/snarkjs.min.js</code> present in your
//               <code className="text-green-400"> public/ </code> folder?
//             </li>
//             <li>
//               Check DevTools → Network tab → it should show <b>200 OK</b>.
//             </li>
//           </ul>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <div className="text-center mb-10">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-white">
//           ZK-Event-Pass <span className="text-zk-highlight">Passport</span>
//         </h1>
//         <p className="text-lg text-gray-400 mt-2">
//           1-Click Verification for <span className="font-semibold text-green-400">High-Trust Events</span>
//         </p>
//       </div>

//       <div className="w-full max-w-lg">
//         {view === 'register' ? <RegisterForm setView={setView} /> : <EventForm setView={setView} />}
//       </div>

//       <p className="mt-8 text-xs text-gray-500">
//         Architecture: ZK-SNARKs (Poseidon Hash) | Sepolia Contracts | MongoDB (PII)
//       </p>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import * as circomlib from 'circomlibjs'; // For Poseidon hashing
import { Buffer } from 'buffer';
import process from 'process';
window.Buffer = Buffer;
window.process = process;


// ---------------- CONFIGURATION ----------------
const API_BASE_URL = 'http://localhost:3001/api';

// ---------------- UTILITY: Poseidon Hash ----------------
// Poseidon hashing handled by circomlibjs
const calculateHash = async (pin) => {
  try {
    const poseidon = await circomlib.buildPoseidon();
    const hashValue = poseidon.F.toString(poseidon([BigInt(pin)]));
    return hashValue;
  } catch (err) {
    console.error("Poseidon Hash Error:", err);
    throw new Error("Failed to calculate Poseidon hash.");
  }
};

// ---------------- COMPONENT: Register ----------------
const RegisterForm = ({ setView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', college: '', pin: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [zkId, setZkId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.pin.length < 5 || isNaN(formData.pin)) {
      setMessage('PIN must be at least 5 digits (numeric).');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 1️⃣ Compute ZK-ID hash using Poseidon
      const zk_id_hash = await calculateHash(formData.pin);

      // 2️⃣ Register on backend
      const response = await axios.post(`${API_BASE_URL}/register-id`, {
        name: formData.name,
        email: formData.email,
        college: formData.college,
        zk_id_hash: zk_id_hash,
      });

      // 3️⃣ Store locally
      setZkId(response.data.zk_id);
      localStorage.setItem('zk_id_pass', response.data.zk_id);

      setMessage('✅ Passport successfully created and registered on-chain!');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Registration failed.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-zk-secondary rounded-xl shadow-2xl w-full max-w-lg">
      <h2 className="text-3xl font-bold text-zk-highlight mb-4">Passport Office (Register)</h2>
      <p className="text-gray-300 mb-6">Create your one-time ZK-Event-Pass ID.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required
          className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition" />
        
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required
          className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition" />
        
        <input type="text" name="college" placeholder="College/Organization" value={formData.college} onChange={handleChange}
          className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition" />
        
        <input type="password" name="pin" placeholder="Private PIN (Numeric Secret)" value={formData.pin} onChange={handleChange} required
          className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition" />
        
        <button type="submit" disabled={loading || zkId}
          className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${loading ? 'bg-gray-500' : 'bg-zk-highlight hover:bg-zk-highlight/80'}`}>
          {loading ? 'Creating Passport...' : 'Register ZK-Event-Pass'}
        </button>
      </form>
      
      {message && (
        <p className={`mt-4 p-3 rounded-lg text-sm ${message.startsWith('❌') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
          {message}
        </p>
      )}

      {zkId && (
        <div className="mt-4 p-4 text-xs bg-zk-bg rounded-lg border border-green-500/50">
          <p className="text-green-400 font-bold mb-2">Registration Success!</p>
          <p>Your Anonymous ZK-ID is: <code className="break-all">{zkId}</code></p>
          <p className="mt-1 text-gray-400">NOTE: Your private data is now secured in our DB, linked to this on-chain ZK-ID.</p>
          <button onClick={() => setView('event')} className="mt-3 w-full p-2 bg-zk-highlight/20 text-zk-highlight rounded-lg hover:bg-zk-highlight/30">
            Go to Event
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------- COMPONENT: Event ----------------
const EventForm = ({ setView }) => {
  const [secretPin, setSecretPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);
  const zkId = useMemo(() => localStorage.getItem('zk_id_pass'), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!zkId) {
      setMessage('❌ Error: ZK-ID not found locally. Please register first.');
      setLoading(false);
      return;
    }

    const zk = window.snarkjs;
    if (!zk) {
      setMessage('❌ Error: SnarkJS is not loaded globally.');
      setLoading(false);
      return;
    }

    try {
      setMessage('Generating ZK-Proof in browser...');
      const input = { secret: secretPin };

      // Full proof generation (reads circuit files from public/)
      const { proof, publicSignals } = await zk.groth16.fullProve(
        input,
        "/circuit.wasm",
        "/circuit_final.zkey"
      );

      if (publicSignals[0] !== zkId) {
        setMessage('❌ PIN is incorrect or does not match your registered ZK-ID.');
        setLoading(false);
        return;
      }

      setMessage('✅ Proof Generated. Sending to Server for On-Chain Verification...');
      const response = await axios.post(`${API_BASE_URL}/register-for-event`, {
        proof: proof,
        publicHash: publicSignals[0],
      });

      setVerifiedData(response.data.verifiedData);
      setMessage(`🚀 Success: ${response.data.message}`);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Verification failed.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (verifiedData) {
    return (
      <div className="p-8 bg-green-900/40 rounded-xl shadow-2xl w-full max-w-lg border border-green-500/50">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Registration Complete!</h2>
        <p className="text-gray-300 mb-6">You are successfully registered for the event.</p>
        <div className="space-y-3 p-4 bg-zk-bg rounded-lg">
          <p className="text-sm text-green-400">Data provided to Organizer (Verified via ZK-Proof):</p>
          <p className="text-lg font-semibold">{verifiedData.name}</p>
          <p className="text-sm">{verifiedData.email}</p>
          <p className="text-xs text-gray-400 break-all">ZK-ID: {verifiedData.zk_id}</p>
        </div>
        <button onClick={() => setView('register')} className="mt-4 w-full p-2 bg-zk-highlight/20 text-zk-highlight rounded-lg hover:bg-zk-highlight/30">
          Back to Register
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-zk-secondary rounded-xl shadow-2xl w-full max-w-lg">
      <h2 className="text-3xl font-bold text-zk-highlight mb-4">Event Registration</h2>
      <p className="text-gray-300 mb-6">
        Register using your ZK-Event-Pass. 
        <span className="text-red-300 block">Your PIN proves ownership, without revealing it.</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input type="password" placeholder="Enter Private PIN" value={secretPin} onChange={(e) => setSecretPin(e.target.value)} required
          className="w-full p-3 rounded-lg bg-zk-bg border border-zk-highlight/20 focus:border-zk-highlight transition" />
        <button type="submit" disabled={loading || !zkId}
          className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${loading ? 'bg-gray-500' : 'bg-zk-highlight hover:bg-zk-highlight/80'}`}>
          {loading ? 'Verifying ZK-Proof...' : 'Register with ZK-Event-Pass'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 p-3 rounded-lg text-sm ${message.startsWith('❌') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
          {message}
        </p>
      )}

      <button onClick={() => setView('register')} className="mt-4 w-full p-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30">
        Back to Passport Office
      </button>
    </div>
  );
};

// ---------------- MAIN APP ----------------
function App() {
  const [view, setView] = useState('register');
  const [snarkjsLoaded, setSnarkjsLoaded] = useState(false);
  const [retries, setRetries] = useState(0);

  // ✅ Fixed: Detect Groth16 only (not Poseidon)
  useEffect(() => {
    const maxRetries = 30;
    if (window.snarkjs && window.snarkjs.groth16) {
      setSnarkjsLoaded(true);
      return;
    }
    if (retries >= maxRetries) return;
    const timer = setTimeout(() => setRetries(r => r + 1), 100);
    return () => clearTimeout(timer);
  }, [retries]);

  if (!snarkjsLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold text-red-500 mb-6">ZK-Proof Engine Loading...</h1>
        <div className="bg-red-900/30 p-6 rounded-xl max-w-xl shadow-lg border border-red-500/50">
          <p className="text-red-300 mb-4 font-semibold">
            ZK Engine is loading ({Math.min(retries * 100, 3000)}ms wait)...
          </p>
          <p className="text-sm text-gray-300">
            If this screen does not disappear, check:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 mt-3">
            <li><code className="text-green-400">/snarkjs.min.js</code> must be inside <code>public/</code> folder.</li>
            <li>Check DevTools → Network tab → must show <b>200 OK</b>.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          ZK-Event-Pass <span className="text-zk-highlight">Passport</span>
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          1-Click Verification for <span className="font-semibold text-green-400">High-Trust Events</span>
        </p>
      </div>

      <div className="w-full max-w-lg">
        {view === 'register' ? <RegisterForm setView={setView} /> : <EventForm setView={setView} />}
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Architecture: ZK-SNARKs (Poseidon Hash via Circomlib) | Sepolia Contracts | MongoDB (PII)
      </p>
    </div>
  );
}

export default App;

