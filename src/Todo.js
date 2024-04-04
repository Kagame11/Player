import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
    const listRef = useRef(null);
    const [text, setText] = useState('');
    const [todos, setTodos] = useState(initialTodos);
    const [showActive, setShowActive] = useState(false);
    
    const activeTodos = todos.filter(todo => !todo.completed);
    
    const visibleTodos = showActive ? activeTodos.slice(15) : todos.slice(0, 15).map((todo, index) => ({
        ...todo,
        completed: index < 15, 
     })).concat(todos.slice(15));

    
     const handleToggleShowActive = () => {
        setShowActive(prevState => !prevState);
    };
     
    const remainingTodosCount = todos.length - 15;

    function handleAdd(){
        const newTodo= {id: nextId++, text: text};
        flushSync(() => {
            setText('');
            setTodos([...todos, newTodo]);
        });
        listRef.current.lastChild.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    return (
        <>
        <button onClick={handleAdd}>
            Add
        </button>
        <input
        value={text}
        onChange={e => setText(e.target.value)}
        />

        <label>
            <input
            type="checkbox"
            checked={showActive}
            onChange={handleToggleShowActive}
            />
            Show only active todos
        </label>
        <ul>
            {visibleTodos.map(todo => (
                <li key={todo.id}>
                    {todo.completed ? <s>{todo.text}</s> : todo.text}
                </li>
            ))
            }
        </ul>
        <footer>
            {remainingTodosCount} todos left
        </footer>
        </>
    );
}

let nextId = 0;
    let initialTodos = [];
    for (let i =0; i < 20; i++) {
    initialTodos.push({
        id: nextId++,
        text: 'Todo #' + (i + 1),
        
        
    });
    }
 

