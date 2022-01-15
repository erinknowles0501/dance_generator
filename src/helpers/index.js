// TODO Add 'roll percentage' - ie percentage(20) where it returns true or false with a 20% distribution.
// Should be easy easy to plug into settings controller.

export function rollPercentage(percent) {
    // Percentage is int from 1-99.
    // Has a [percent]% chance of returning true.
    // TODO check math to ensure even distribution. Note: I set the percentage to 100, meaning Math.random() < 1 which it literally should be, but it still returned false a couple of times...

    return Math.random() < percent / 100;
}

export function getRandomFromZeroToMax(max) {
    // TODO check math to ensure even distribution
    return Math.floor(Math.random() * max + 1);
}

export function getRandomFromMinToMax(min, max) {
    return Math.floor(Math.random() * max + min);
}
