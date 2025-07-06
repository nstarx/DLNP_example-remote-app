# Documentation Features

## Overview
The Analytics Dashboard now includes a comprehensive documentation system with interactive Mermaid diagrams directly embedded in the HTML viewer.

## Features Added

### 1. Interactive Documentation Viewer
- **Location**: `/docs/index.html`
- **Features**:
  - Sidebar navigation
  - Markdown rendering
  - Live Mermaid diagrams
  - Dark mode support
  - Responsive design

### 2. Mermaid Diagrams
All diagrams are now embedded directly in the HTML documentation:

- **System Architecture Overview**: Shows the complete system structure
- **Component Architecture**: Visualizes component hierarchy
- **Data Flow**: Sequence diagram showing data flow
- **Module Federation Architecture**: Illustrates the build and runtime process
- **Component Lifecycle**: State diagram of component states
- **Directory Structure**: Visual file organization
- **Build and Deployment Flow**: CI/CD pipeline visualization
- **State Management Pattern**: Shows the composable pattern

### 3. UI Integration
- **Documentation Button**: Located in the dashboard header
- **Modal Component**: Full-screen popup for viewing documentation
- **Keyboard Friendly**: ESC key closes the modal

## Usage

### For End Users
1. Click the "Docs" button in the dashboard header
2. Browse documentation sections using the sidebar
3. View interactive diagrams that render automatically
4. Click outside the modal or the X button to close

### For Developers
The documentation system can be extended by:
1. Adding new sections to the `docs` object in `/public/docs/index.html`
2. Creating new Mermaid diagrams using standard syntax
3. Adding new markdown files to the `/public/docs/` directory

## File Structure
```
public/docs/
├── index.html              # Main documentation viewer
├── diagrams.md            # Mermaid diagrams source
├── DESIGN.md             # Design principles
├── ARCHITECTURE.md       # Architecture details
└── README-REFACTORED.md  # User guide

src/components/common/
├── DocumentationButton.vue  # Header button
└── DocumentationModal.vue   # Popup modal
```

## Benefits
- **Self-Documenting**: Complete architecture visualization
- **AI-Friendly**: Perfect for LLMs to understand the codebase
- **Developer Experience**: Easy onboarding for new developers
- **Maintainability**: Visual documentation stays with the code