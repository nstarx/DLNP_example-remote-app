# Simple Mermaid Test

Testing mermaid diagram rendering.

## Simple Flow Chart

```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[End]
    C -->|No| B
```

## Code Block Test

Here's a regular code block to test syntax highlighting:

```javascript
function calculateSum(a, b) {
    return a + b;
}

const result = calculateSum(5, 3);
console.log("The sum is:", result);
```

Another code example:

```python
def greet(name):
    """Simple greeting function"""
    return f"Hello, {name}!"

# Call the function
message = greet("World")
print(message)
```

## Another Mermaid Diagram

```mermaid
graph LR
    A[Frontend] --> B[API Gateway]
    B --> C[Backend]
    C --> D[Database]
```

That's all for this test!