

class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = { id, name, room };
        this.users.push(user);
        return this.users;
    }

    getUser(id) {
        let user = this.users.filter(u => {
            return u.id === id; 
        })[0];
        return user;
    }

    getUsers() {
        return this.users;
    }

    getUsersByRoom(room) {
        let users = this.users.filter(u => {
            return u.room === room; 
        });
        return users;
    }

    deleteUser(id) {
        let oldUser = this.getUser(id);
        this.users = this.users.fill(u => {
            return user.id !== id;
        });
        return oldUser;
    }

}

module.exports = {
    Users
};
