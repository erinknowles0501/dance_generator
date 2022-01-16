export function rollPercentage(percent) {
    // Percentage is int from 1-99.
    // Has a [percent]% chance of returning true.
    // TODO check math to ensure even distribution. Note: I set the percentage to 100, meaning Math.random() < 1 which it literally should be, but it still returned false a couple of times...

    return Math.random() < percent / 100;
}

export function getRandomFromZeroToMax(max) {
    // From: https://stackoverflow.com/a/1527820
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1));
}

export function getRandomFromMinToMax(min, max) {
    // From: https://stackoverflow.com/a/1527820
    return Math.floor(Math.random() * (max - min + 1) + min);
}
