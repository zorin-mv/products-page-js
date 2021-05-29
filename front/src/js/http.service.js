import env from './environment';

export default class Http {
    constructor(path) {
        this.url = env.basePath + path;
    }

    getAll() {
        return fetch(this.url);
    }

    get(id) {
        return fetch(this.url + id)
    }

    getLimit(limit) {
        return fetch(this.url + `?limit=${limit}`)
    }

    getCategory(category) {
        return fetch(this.url + `category/${category}`)
    }

    add(data) {
        return fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    update(id, data) {
        return fetch(this.url + id, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    delete(id) {
        return fetch(this.url + id, {
            method: 'DELETE'
        })
    }
}