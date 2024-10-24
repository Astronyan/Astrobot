export default(callback: () => void, hour: number, minute = 0) => {
    function getNextExecutionTime() {
        const now = new Date();
        const nextExecution = new Date();

        nextExecution.setHours(hour, minute, 0, 0);

        if (nextExecution <= now) {
            nextExecution.setDate(nextExecution.getDate() + 1);
        }

        return nextExecution.getTime() - now.getTime();
    }

    function scheduleNextExecution() {
        const timeout = getNextExecutionTime();
        setTimeout(() => {
            callback();
            scheduleNextExecution();
        }, timeout);
    }

    scheduleNextExecution();
}
