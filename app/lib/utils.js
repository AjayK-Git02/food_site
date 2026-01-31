// Generate WhatsApp order message
export function generateWhatsAppMessage(foodName, day, price) {
    const message = `Hi! I'd like to order *${foodName}* for *${day}* - ₹${price}`;
    return encodeURIComponent(message);
}

// Generate WhatsApp URL
export function getWhatsAppUrl(phoneNumber, message) {
    return `https://wa.me/${phoneNumber}?text=${message}`;
}

// Format currency
export function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

// Format date
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get day name from index
export function getDayName(index) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[index] || 'Monday';
}

// Slugify text
export function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}
