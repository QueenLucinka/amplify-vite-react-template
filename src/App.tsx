import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    // Subscribe to data updates
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, []);

  // Delete function
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={() => client.models.Todo.create({ content: window.prompt("Enter a new todo:") })}>
        + New Todo
      </button>
      <ul>
  {todos.map((todo) => (
    <li
      key={todo.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <span style={{ marginRight: "16px" }}>{todo.content}</span>
      <button
        onClick={() => deleteTodo(todo.id)}
        style={{
          padding: "4px 8px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>

      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
