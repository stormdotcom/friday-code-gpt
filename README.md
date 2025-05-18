# ChatGPT for Coding

A professional, production-ready web application that implements a ChatGPT-like interface specialized for coding assistance. Built with Next.js 14, TypeScript, React hooks, and styled with Tailwind CSS and shadcn UI components.

## Features

- **Threaded conversation interface** with syntax-highlighted code blocks
- **Left sidebar navigation** with conversation management (new, rename, delete) 
- **Rich message rendering** with Markdown support and syntax highlighting for multiple languages
- **File and image attachment support** with preview capabilities
- **Input box** with character counter and file upload support
- **Local storage persistence** for conversation history
- **Responsive design** optimized for all device sizes
- **Dark mode theme** with GPT's signature purple accents
- **Accessibility features** including proper contrast ratios and keyboard navigation

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chatgpt-for-coding.git
   cd chatgpt-for-coding
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - React components organized by feature/function
- `/context` - React context providers for state management
- `/lib` - Utility functions, types, and mock data

## Building for Production

```
npm run build
```

## Deployment

This application is configured for static site export and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Backend API Integration

This application includes stub endpoints for file uploads. In a production environment, you would need to implement:

1. A real file upload and storage service
2. Authentication and user management
3. Integration with an actual AI service (like OpenAI's API)

## License

This project is licensed under the MIT License - see the LICENSE file for details.