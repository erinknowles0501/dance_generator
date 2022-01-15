// TODO Add 'roll percentage' - ie percentage(20) where it returns true or false with a 20% distribution.

export function getRandomToMax(max) {
    // TODO check math to ensure even distribution
    return Math.floor(Math.random() * max + 1);
}

export function getRandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * max + min);
}
