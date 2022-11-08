export {}
declare global {
    declare module '*.js'
    interface Window {
        _configs: any;
    }
}

