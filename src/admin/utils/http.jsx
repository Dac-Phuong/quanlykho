import axios from 'axios'
import { getUserData } from './function'
const userData = getUserData()
function createHttp() {
    return axios.create({
        // baseURL: 'https://qlbanhang.5chaumedia.com',
        baseURL: 'http://localhost:8000/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.token}`
        }
    })
}

export const http = createHttp()
