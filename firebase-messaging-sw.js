self.addEventListener('push', (event) => {
    try {
        const data = event.data.json();

        // Extract title and body from the notification object in your payload
        const title = data.notification.title;
        const body = data.notification.body;

        const options = {
            body: body,
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (error) {
        console.error('Error parsing push data:', error);
    }
});