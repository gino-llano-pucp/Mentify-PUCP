/**
 * Generate a random hex color.
 * @return {string} Hex color code.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Generate a URL for an avatar image based on user's initials.
 * @param {string} nombres - User's first name.
 * @return {string} URL of the generated avatar image.
 */
function generateInitialsAvatar(nombres) {
    const initials = `${nombres[0]}`.toUpperCase();
    const background = getRandomColor();  // Use random color for the background
    const size = 100;  // The size of the avatar image.

    return `https://ui-avatars.com/api/?name=${initials}&color=fff&background=${background}&size=${size}`;
}

module.exports = generateInitialsAvatar;
