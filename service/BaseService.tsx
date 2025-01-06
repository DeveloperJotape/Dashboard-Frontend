import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/'
});

export class BaseService {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    findAll() {
        return axiosInstance.get(this.url + '/findAll');
    }
    save(object: any) {
        return axiosInstance.post(this.url + '/save', object);
    }
    update(id: number, object: any) {
        return axiosInstance.put(this.url + '/update/' + id, object);
    }
    delete(id: number) {
        return axiosInstance.delete(this.url + '/delete/' + id);
    }
    findById(id: number) {
        return axiosInstance.get(this.url + '/findById' + id);
    }
}
