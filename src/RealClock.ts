import Clock from "./Clock";

export default class RealClock implements Clock {
    getDate() {
        return new Date()
    }
}