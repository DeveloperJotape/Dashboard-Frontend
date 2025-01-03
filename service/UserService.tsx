import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/user'
});

export class UserService {
    findUsers() {
        return axiosInstance.get('/findUsers');
    }
    findById() {}
    saveUser(user: Project.User) {
        return axiosInstance.post('/saveUser', user);
    }
    updateUser(id: number, user: Project.User) {
        return axiosInstance.put('/updateUser/' + id, user);
    }
    deleteUser(id: number) {
        return axiosInstance.delete('deleteUser/' + id);
    }
}
