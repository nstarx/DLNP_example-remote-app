// Suppress ResizeObserver loop errors
// This is a known issue with ResizeObserver that doesn't affect functionality
const resizeObserverErrorHandler = (e) => {
    if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
        if (resizeObserverErr) {
            resizeObserverErr.style.display = 'none';
        }
        return;
    }
};

// Only apply in development
if (process.env.NODE_ENV === 'development') {
    window.addEventListener('error', resizeObserverErrorHandler);
}

export default resizeObserverErrorHandler;