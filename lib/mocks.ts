import { Conversation, Message } from "./types";

export const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "React Component Optimization",
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    messages: [
      {
        id: "msg1",
        conversationId: "1",
        content: "How can I optimize rendering performance in a React component with a large list?",
        role: "user",
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: "msg2",
        conversationId: "1",
        content: `When working with large lists in React, rendering performance can become a bottleneck. Here are several strategies to optimize it:

### 1. Use virtualization
Virtualization is the most effective technique for handling large lists. It only renders items that are currently visible in the viewport.

\`\`\`jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={35}
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

### 2. Use React.memo for list items
Wrap your list item component with React.memo to prevent unnecessary re-renders:

\`\`\`jsx
const ListItem = React.memo(({ item }) => {
  return <div>{item.name}</div>;
});

function List({ items }) {
  return (
    <div>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
}
\`\`\`

### 3. Use stable keys
Always use stable, unique keys for list items:

\`\`\`jsx
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}
\`\`\`

### 4. Avoid anonymous functions in renders
\`\`\`jsx
// Bad
{items.map(item => (
  <ListItem 
    key={item.id} 
    item={item}
    onClick={() => handleClick(item.id)} // Creates new function every render
  />
))}

// Good
const handleItemClick = useCallback((id) => {
  // handle click
}, []);

{items.map(item => (
  <ListItem 
    key={item.id} 
    item={item}
    onClick={handleItemClick} 
    id={item.id}
  />
))}
\`\`\`

### 5. Use useMemo for derived data
\`\`\`jsx
const filteredItems = useMemo(() => {
  return items.filter(item => item.name.includes(searchTerm));
}, [items, searchTerm]);
\`\`\`

Implementing these techniques should significantly improve your React list performance.`,
        role: "assistant",
        createdAt: Date.now() - 86400000 * 2,
      },
    ],
  },
  {
    id: "2",
    title: "JavaScript Promises",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    messages: [
      {
        id: "msg3",
        conversationId: "2",
        content: "Can you explain how to use async/await with try/catch for error handling in JavaScript?",
        role: "user",
        createdAt: Date.now() - 86400000,
      },
      {
        id: "msg4",
        conversationId: "2",
        content: `# Using async/await with try/catch for error handling

Async/await is a modern JavaScript syntax that makes working with Promises more readable and maintainable. When combined with try/catch blocks, it provides an elegant way to handle errors in asynchronous code.

## Basic Pattern

\`\`\`javascript
async function fetchData() {
  try {
    // Await any promise-based operation
    const response = await fetch('https://api.example.com/data');
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // Process the data
    console.log(data);
    return data;
  } catch (error) {
    // Handle any errors that occurred in the try block
    console.error('There was a problem with the fetch operation:', error);
    // You can also rethrow the error if needed
    // throw error;
  } finally {
    // Optional finally block runs regardless of success or failure
    console.log('Fetch operation completed');
  }
}

// Call the async function
fetchData().then(result => {
  if (result) {
    console.log('Successfully retrieved data');
  }
});
\`\`\`

## Multiple Await Statements

You can have multiple await statements in a single try block:

\`\`\`javascript
async function fetchMultipleResources() {
  try {
    const userResponse = await fetch('https://api.example.com/user');
    const userData = await userResponse.json();
    
    const postsResponse = await fetch(\`https://api.example.com/posts?userId=\${userData.id}\`);
    const postsData = await postsResponse.json();
    
    return { user: userData, posts: postsData };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return null;
  }
}
\`\`\`

## Parallel Execution with Promise.all

For better performance, you can run multiple promises in parallel:

\`\`\`javascript
async function fetchParallel() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('https://api.example.com/users').then(res => res.json()),
      fetch('https://api.example.com/posts').then(res => res.json()),
      fetch('https://api.example.com/comments').then(res => res.json())
    ]);
    
    return { users, posts, comments };
  } catch (error) {
    // If any promise rejects, the catch block will execute
    console.error('One of the parallel requests failed:', error);
    return null;
  }
}
\`\`\`

## Error Handling with Specific Types

You can also check for specific types of errors:

\`\`\`javascript
async function fetchWithSpecificErrorHandling() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error or CORS issue:', error);
    } else if (error.name === 'SyntaxError') {
      console.error('Invalid JSON response:', error);
    } else {
      console.error('Unknown error:', error);
    }
    return null;
  }
}
\`\`\`

This approach provides a clean, synchronous-looking way to handle asynchronous operations with proper error handling.`,
        role: "assistant",
        createdAt: Date.now() - 86400000,
      },
    ],
  },
  {
    id: "3",
    title: "General Discussion",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    messages: [
      {
        id: "msg5",
        conversationId: "3",
        content: "What's the weather like today?",
        role: "user",
        createdAt: Date.now() - 3600000,
      },
      {
        id: "msg6",
        conversationId: "3",
        content: "I don't have access to real-time weather information or your location. To get the current weather, you could check a weather service like Weather.com, AccuWeather, or use a weather app on your device. Alternatively, you could specify your location and I can provide general information about seasonal weather patterns for that region.",
        role: "assistant",
        createdAt: Date.now() - 3600000,
      },
    ],
  },
];

export const mockMessages: Record<string, Message[]> = {
  "1": mockConversations[0].messages,
  "2": mockConversations[1].messages,
  "3": mockConversations[2].messages,
};