
declare abstract class EventDispatcher {
    dispatchEvent: (o: any) => any;
    addEventListener: (e: string, Function) => any;
    hasEventListener;
    removeEventListener;
    reset();
}