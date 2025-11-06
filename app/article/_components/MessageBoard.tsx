'use client';
import { useState } from 'react';

export default function MessageBoard() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">💬 Message Board</h2>
      <div className="space-y-3 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-gray-100 px-4 py-2 rounded shadow-sm">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// 'use client';
// import { useState } from 'react';

// export default function MessageBoard() {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (input.trim()) {
//       setMessages([...messages, input]);
//       setInput('');
//     }
//   };

//   return (
//     <div className="mt-10 border-t pt-6">
//       <h2 className="text-lg font-semibold mb-4">Message Board</h2>
//       <div className="space-y-2 mb-4">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="bg-gray-100 p-2 rounded">{msg}</div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border px-3 py-2 rounded"
//           placeholder="Write a message..."
//         />
//         <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
//       </div>
//     </div>
//   );
// }
