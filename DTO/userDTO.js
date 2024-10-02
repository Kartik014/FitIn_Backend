class UserDTO {
    constructor(id, username, password, role, mobileNumber = null, gender = null, dob = null, email = null, session = null) {
        this.id = id;
        this.username = username;
        this.password = this.validatePassword(password);
        this.role = this.validateRole(role);
        this.mobileNumber = this.validateMobileNumber(mobileNumber);
        this.gender = gender;
        this.dob = dob;
        this.email = this.validateEmail(email);
        this.session = session;
    }

    validateEmail(email) {
        if (email === null) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
        return email;
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            throw new Error('Password must be at least 8 characters long, contain at least one uppercase letter, and one special character');
        }
        return password;
    }

    validateMobileNumber(mobileNumber) {
        if (mobileNumber === null) return null;
        const mobileRegex = /^\+?[0-9]{10,15}$/;
        if (!mobileRegex.test(mobileNumber)) {
            throw new Error('Invalid mobile number format');
        }
        return mobileNumber;
    }

    validateRole(role) {
        const allowedRoles = ['user', 'influencer'];
        if (!allowedRoles.includes(role.toLowerCase())) {
            throw new Error(`Invalid role: ${role}. Allowed roles are 'user' or 'influencer'.`);
        }
        return role.toLowerCase();
    }

}

export default UserDTO;