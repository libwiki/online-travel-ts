// 标签组件的事件（轮播事件）
import {I51CloudOption} from "/@/@types/config";
import mitt from "mitt";
// @ts-ignore
import CloudRenderer from "superapi-51world";
import _ from "lodash";
import {E51CloudCommands, E51CloudEvents, I51CloudEventsOption} from "/@/hooks/cloud51/lib/types/Events";
import {IComponent} from "/@/hooks/cloud51/lib/Interfaces";

export enum CloudEvents {
    onReady = "onReady",
    onEvent = "onEvent",
    onUpdate = "onUpdate",
    onDispose = "onDispose",
}


type MarkerEventType = {
    [k in CloudEvents]: any
}

export class Cloud51 {
    protected _domId?: string
    protected _host: string
    protected _option: I51CloudOption
    emitter = mitt<MarkerEventType>()
    protected _running = false
    protected width: number
    protected height: number
    protected _cloudRender?: any

    get cloudRender() {
        return this._cloudRender
    }

    components: IComponent[] = []; // 组件
    constructor(host: string, option: I51CloudOption, domId?: string) {
        this._domId = domId;
        this._host = host;
        this._option = option;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    get host() {
        return this._host
    }

    set host(host: string) {
        this._host = host
    }

    get option() {
        return this._option
    }

    set option(option: I51CloudOption) {
        this._option = option
    }

    set domId(domId: string) {
        this._domId = domId
    }

    get sceneName() {
        return this.option.name
    }

    get isRunning() {
        return this._running
    }

    // 正在启动 （false时将停止onUpdate的帧刷新）
    set isRunning(val: boolean) {
        const oldVal = this._running
        this._running = val
        if (val && val !== oldVal) { // 重新启动
            this.onUpdate(Date.now())
        }

    }

    getComponentByName<T extends IComponent>(name: string): T | void;
    getComponentByName<T extends IComponent>(name: string): IComponent | void {
        return this.components.find(v => v.name === name);
    }

    protected async _fetch51CloudUrl() {
        try {
            const {url} = await fetch(this.host, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                body: `order=${this.option.cloudId}&width=${this.width}&height=${this.height}`
            }).then(res => res.json());
            return url;
        } catch (e) {
            console.log('请求51cloud连接地址失败:', e.message)
        }
    }

    async onStart() {
        if (this._domId) {
            const url = await this._fetch51CloudUrl();
            if (!url) {
                return;
            }
            const cloudRender = new CloudRenderer('cloud-home-player', 0)
            cloudRender.SuperAPI('StartRenderCloud', url)
            cloudRender.SuperAPI('SetResolution', {
                width: this.width,
                height: this.height,
            });
            // 事件注册 (Callbakc event registration)
            cloudRender.SuperAPI('RegisterCloudResponse', (data: any) => {
                try {
                    const jsonObject = typeof data === 'object' ? _.cloneDeep(data) : (JSON.parse(data) || {})
                    this.onEvent(jsonObject)
                } catch (e) {
                    console.log('RegisterCloudResponse err', e)
                }

            })
            this._cloudRender = cloudRender;
        }
        this.components.forEach(v => v.onStart())

    }

    onReady(): void {
        this.components.forEach(v => v.onReady())
        this.isRunning = true
        this.emitter.emit(CloudEvents.onReady)
    }

    onUpdate(deltaTime: number): void {
        if (this.isRunning) { // 是否正在启动
            this.components.forEach(v => v.onUpdate(deltaTime))
            requestAnimationFrame(() => {
                this.onUpdate(Date.now())
            });
            this.emitter.emit(CloudEvents.onUpdate, deltaTime)
        }
    }

    async onDispose(reason = '页面卸载，自动关闭51cloud') {
        this.isRunning = false
        await Promise.all(this.components.map(v => v.onDispose()))
        this.cloudRender?.SuperAPI(E51CloudCommands.StopRenderCloud)
        this.emitter.emit(CloudEvents.onDispose)
    }

    onEvent(event: I51CloudEventsOption): void {
        console.log('event', event)
        switch (event.func_name) {
            case E51CloudEvents.APIAlready:
                console.log('APIAlready: 3D世界加载完成')
                // 云渲染场景加载完成 业务逻辑...
                this.onReady();
                break
        }
        this.components.forEach(v => v.onEvent(event))
        this.emitter.emit(CloudEvents.onEvent, event)
    }
}
