class UserDTO {
    constructor(id, username, email, password, role, mobileNumber, gender, dob, session = null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.mobileNumber = mobileNumber;
        this.gender = gender;
        this.dob = dob;
        this.session = session;
    }
}

export default UserDTO;