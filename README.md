# Electron React TypeScript Boilerplate

A secure, type-safe, and well-structured boilerplate for building modern desktop applications using Electron, React, TypeScript, and Vite.

## Features

- 🔒 **Secure by Design**: IPC validation, CSP implementation, and proper permission handling
- 🧩 **Type Safety**: Full TypeScript support with strict type checking
- 🚦 **Modern Routing**: React Router with file-based routing structure
- 🎨 **UI Components**: Shadcn/UI components with Tailwind CSS
- 🏗️ **Architecture**: Clean architecture with separation of concerns
- 🔄 **State Management**: Zustand for simple and effective state management
- 🧪 **Testing**: Jest and React Testing Library setup
- 📦 **Packaging**: Electron Builder configuration for all platforms

## Project Structure

```
├── src/
│   ├── app/                  # React application
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-based modules
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Layout components
│   │   ├── lib/              # Utility functions and constants
│   │   ├── providers/        # Context providers
│   │   ├── routes/           # Application routes
│   │   ├── services/         # API and service functions
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main App component
│   │   └── main.tsx          # React entry point
│   │
│   ├── electron/             # Electron main process
│   │   ├── main/             # Main process modules
│   │   ├── preload/          # Preload scripts
│   │   ├── ipc/              # IPC handlers and types
│   │   ├── utils/            # Utility functions
│   │   ├── security/         # Security-related code
│   │   ├── main.ts           # Main entry point
│   │   └── preload.ts        # Preload script entry point
│   │
│   └── shared/               # Shared code between app and electron
│       ├── constants/        # Shared constants
│       └── types/            # Shared type definitions
│
├── public/                   # Static assets
├── tests/                    # Test files
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── electron-builder.json     # Electron Builder configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/electron-react-typescript-boilerplate.git
cd electron-react-typescript-boilerplate

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# Lint the code
npm run lint

# Run tests
npm run test
```

### Building

```bash
# Build for macOS
npm run dist:mac

# Build for Windows
npm run dist:win

# Build for Linux
npm run dist:linux

# Build for all platforms
npm run dist
```

## Key Implementation Details

### IPC Communication

The application uses a secure IPC (Inter-Process Communication) system to enable communication between the Electron main process and the renderer process:

1. **Type Safety**: All IPC messages are strongly typed using TypeScript interfaces.
2. **Validation**: IPC messages are validated for both origin and payload to prevent security issues.
3. **Channels**: Predefined IPC channels are used for specific operations (system info, window control, file operations, etc.).

Example of IPC usage in renderer:

```typescript
// Get system information
const cpuInfo = await window.electron.getSystemInfo('CPU');

// Control window
window.electron.controlWindow('MINIMIZE');
```

### Window Management

The application implements proper window management with:

1. **Draggable Regions**: Custom CSS classes (`app-drag-region` and `app-no-drag`) for creating draggable areas.
2. **Platform-Specific Settings**: Different window configurations for macOS and Windows/Linux.
3. **Window State Persistence**: Window position and size are saved and restored between sessions.

### Security Features

This boilerplate implements several security best practices:

1. **Context Isolation**: Enabled by default to prevent preload scripts from accessing the renderer process.
2. **IPC Validation**: All IPC messages are validated to prevent malicious inputs.
3. **CSP**: Content Security Policy to prevent XSS attacks.
4. **Node Integration**: Disabled to prevent access to Node.js APIs from the renderer.
5. **Permission Handling**: Proper permission handling for file system access, notifications, etc.

## Troubleshooting

### Common Issues

1. **Electron API not available**: Make sure the preload script is correctly configured and the path is correct.
2. **Window not draggable**: Check that the draggable regions are properly set up with the CSS classes.
3. **IPC communication failing**: Verify that the IPC channels are correctly defined in both main and renderer processes.

## License

MIT
