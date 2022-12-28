import request from '../utils/net';
import {canSetParams} from "../utils/helpers";
import _ from "lodash";

export class HttpProxy {
    config: Partial<any>

    constructor(config = {}) {
        this.config = config
    }

    getConfigs(configs = {}) {
        return _.cloneDeep({
            ...this.config,
            ...(configs || {})
        })
    }

    put(url: string, data = {}, configs = {}) {
        return request.put<any, any>(url, data, this.getConfigs(configs));
    }

    post(url: string, data = {}, configs = {}) {
        return request.post<any, any>(url, data, this.getConfigs(configs));
    }

    patch(url: string, data = {}, configs = {}) {
        return request.patch<any, any>(url, data, this.getConfigs(configs));
    }

    options(url: string, data = {}, configs = {}) {
        return this.request(url, 'options', data, configs);
    }

    get(url: string, data = {}, configs = {}) {
        return this.request(url, 'get', data, configs);
    }

    head(url: string, data = {}, configs = {}) {
        return this.request(url, 'head', data, configs);
    }

    delete(url: string, data = {}, configs = {}) {
        return this.request(url, 'delete', data, configs);
    }

    request<T extends any>(url: string, method: string, data = {}, configs = {}): Promise<T> {
        const can = canSetParams(method);
        return request.request({
            url,
            method,
            data: can ? {} : data,
            params: can ? data : {},
            ...this.getConfigs(configs),
        });
    }
}

export const Http = new HttpProxy({})
export const JsonHttp = new HttpProxy({
    baseURL: "http://localhost:8080/"
})
