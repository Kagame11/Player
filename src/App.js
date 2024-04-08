import {useState, useRef, useEffect } from 'react';
import {createConnection} from './chat.js';
import CatFriends from './friends.js';
import From from './focus.js';
import TodoList from './Todo.js';
import Form from './message.js';
import { showNotification } from './notifications.js';
import Timer from './counter.js';
import {FadeInAnimation} from './animation.js';
import { useOnlineStatus} from './useOnlineStatus.js';
import {useFormInput} from './useFormInput.js';
import {useCounter} from './UseCounter.js';
import {usePointerPosition} from './UsePointerPosition.js';


function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
    <label>
      Tick duration: {delay} ms
      <br />
      <input
      type="range"
      value={delay}
      min="10"
      max="2000"
      onChange={e => setDelay(Number(e.target.value))}
      />
    </label>
    <hr />
    <h1>Ticks: {count}</h1>
    </>
  )
}

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;

}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
      console.log('✅ Progress saved')
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
        {isOnline ? 'Save progress' : 'Reconecting...'}
    </button>
);
}

function Welcome({duration}) {
  const ref = useRef(null);
  const [animation, setAnimation] = useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const newAnimation = new FadeInAnimation(ref.current);
    setAnimation(newAnimation);

    return ()  => {
      if (animation) {
        animation.stop();
      }
    };
  }, [])

  useEffect(() => {
    if (animation) {
      animation.start(duration);
    }
  }, [animation, duration]);

  return (
    <h1
    ref={ref}
    style={{
      opacity: 0,
      color: 'white',
      padding: 50,
      textAlign: 'center',
      fontSize: 50,
      backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
   
    }}>Welcome</h1>
  );
}



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

function ChatRoom({roomId, isDark}) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      if (!notificationShown) {
        showNotification('Connected!', isDark ? 'dark' : 'light');
        setNotificationShown(true);
      }
      
    });
    connection.connect();
    return () => {
      
      connection.disconnect();
    };
  }, [roomId, isDark, notificationShown, setNotificationShown ]);
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

function Form2(){
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
    <label>
      First name:
      <input {...firstNameProps} />
      </label>
      <br />
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}</b></p>
      </>
  );
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  const [newThem, setNewTheme] = useState('light');
  const [notificationShown, setNotificationShown] = useState(false);
  const [duration, setDuration] = useState(1000);
  const [shown, setShown] = useState(false);
  
  

  useEffect(() => {
    const body = document.body;
    if(isDark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme')
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prevIsDark) => !prevIsDark);
    const theme = isDark ? 'light' : 'dark';
    setNotificationShown(false);
    setNewTheme(theme);
    
    
  };

  const handleOpenChat = () => {
    setShow(true);
    // showNotification('Connected!', newTheme);
    setNotificationShown(false);
  };

  const handleCloseChat = () => {
    setShow(false);
    setNotificationShown(false);
  };
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
      
      {!show ? (
        <button onClick={handleOpenChat}>Open chat</button>
      ) : (
        <button onClick={handleCloseChat}>Close chat</button>
      )}
    </label>
    <label>
        <input
        type="checkbox"
        checked={isDark}
        onChange={handleToggleTheme}
        />
        Use dark theme
      </label>
      <br />
      <br />
      <label>
        <input
        type="range"
        min="100"
        max="3000"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShown(!shown)}>
        {shown ? 'Remove' : 'Shown'}
      </button>
      <hr />
      {shown && <Welcome duration={duration }/>}
      <br />
      <br />
    {show && <hr />}
    {show && <ChatRoom roomId={roomId} isDark={isDark} setNotificationShown={setNotificationShown}/>}
    <CatFriends/>
    <From />
    <br/>
    <br/>
    <Form />
    <br />
    <br />
    <TodoList />
    <br />
    <br />
    <Timer />
    <br />
    <br />
    <SaveButton />

        <StatusBar />
        <br />
        <br />
        <Form2 />
        <br />
      <br />
      <Counter />
      <br />
      <br />
      <useDelayedValue />
      <Canvas />
      <Dot />
    </>
    
  );
}
<hr />

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);

  return (
    <>
    <Dot position={pos1} opacity={1} />
    <Dot position={pos2} opacity={0.8} />
    <Dot position={pos3} opacity={0.6} />
    <Dot position={pos4} opacity={0.4} />
    <Dot position={pos5} opacity={0.2} />
    </>
  );

}

function Dot({position, opacity}) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: 'translate(${position.x}px, $(position.y}px)',
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
