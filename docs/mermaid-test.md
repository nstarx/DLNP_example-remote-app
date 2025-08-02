# Mermaid Diagram Test

This document contains various Mermaid diagrams to test the rendering functionality.

## Flow Chart

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Click Documentation
    Frontend->>API: GET /api/docs
    API->>Database: Query docs
    Database-->>API: Return docs list
    API-->>Frontend: JSON response
    Frontend-->>User: Display docs
```

## Class Diagram

```mermaid
classDiagram
    class DocsViewer {
        +docs: Array
        +selectedDoc: Object
        +loading: Boolean
        +fetchDocs()
        +selectDoc()
        +renderMermaid()
    }
    
    class APIService {
        +getDocs()
        +getDocContent()
    }
    
    DocsViewer --> APIService : uses
```

## Gantt Chart

```mermaid
gantt
    title Documentation Feature Development
    dateFormat  YYYY-MM-DD
    section Backend
    API Endpoints           :done,    des1, 2024-01-01, 1d
    File Serving Logic      :done,    des2, after des1, 1d
    section Frontend
    DocsViewer Component    :done,    des3, after des1, 2d
    Mermaid Integration     :active,  des4, after des3, 1d
    section Testing
    Integration Tests       :         des5, after des4, 1d
```

## Pie Chart

```mermaid
pie title Project Time Distribution
    "Backend Development" : 25
    "Frontend Development" : 40
    "Testing" : 20
    "Documentation" : 15
```

## Regular Text

This is regular markdown text that should render normally, not as a diagram.

### Code Block (Non-Mermaid)

```javascript
// This is a regular code block
function hello() {
    console.log("Hello, World!");
}
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : Fetch Docs
    Loading --> Success : Data Received
    Loading --> Error : Request Failed
    Success --> Viewing : Select Doc
    Viewing --> Loading : Select Another
    Error --> Loading : Retry
    Viewing --> [*]
```

This concludes the mermaid diagram test document.