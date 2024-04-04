import {useState, useRef, useEffect } from 'react';
import {createConnection} from './chat.js';
import CatFriends from './friends.js';
import From from './focus.js';
import TodoList from './Todo.js';


function VideoPlayer ({src, isPlaying}) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playInline width="250" />;
}

function ChatRoom({roomId}) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
  return (
    <>
    <label>
      Server URL:{''}
      <input
      value={serverUrl}
      onChange={e => setServerUrl(e.target.value)}
      />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{''}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
      </>
      
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
    <input value={text} onChange={e => setText(e.target.value)} />  
    <button onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
    <VideoPlayer isPlaying={isPlaying} src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

    />
    <br />
    <br />
    <label>
      Choose the chat room:{''}
      <select
      value={roomId}
      onChange={e => setRoomId(e.target.value)}>
        <option value="general">general</option>
        <option value="music">music</option>
        <option value="travel">travel</option>
      </select>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
    </label>
    {show && <hr />}
    {show && <ChatRoom roomId={roomId}/>}
    <CatFriends/>
    <From />
    <br />
    <br />
    <TodoList />
    </>
  );
}

