class DedicatedWorkerClass {
    
    constructor(onMessageCtxNFunc = null) {
        if(window.Worker) {
            this.worker = new Worker(new URL('./worker.js', import.meta.url));
            this.worker.onmessage = (e) => {
                this.onMessage(e);
            }
            this.userCallbacks = {
                onMessageCtxNFunc
            }
        }
        else {
            throw new Error('WebWorker not supported by browser. Please use an updated browser.');
        }
    }

    postMessage(data = {}, transferData = []) {
        this.worker.postMessage(data, transferData)
    }

    onMessage(e) {
        // console.log('Message from worker thread', e.data)
        this.userCallbacks.onMessageCtxNFunc && 
            this.userCallbacks.onMessageCtxNFunc.apply(this.userCallbacks.onMessageCtxNFunc, [e.data])
    }
}

export default DedicatedWorkerClass;