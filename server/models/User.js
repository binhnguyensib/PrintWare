class IUser {
    userName = '';
    userId = '';
    userRole = '';
    email = '';
    loginCount = 0;

    constructor(userName = '', userId = '', userRole = '', email = '', loginCount = 0) {
        this.userName = userName;
        this.userId = userId;
        this.userRole = userRole;
        this.email = email;
        this.loginCount = loginCount;
    }

    convertToJSON() {}
    setInfoFromJSON(json) {}
}

export class Customer extends IUser {
    phoneNum = '';
    hcmutId = '';
    faculty = '';
    major = '';
    academicYear = '';
    classId = '';
    avatar = '';
    coverPhoto = '';
    documents = [];

    constructor(userName = '', userId = '', userRole = '', email = '', loginCount = 0, phoneNum = '', hcmutId = '', faculty, major = '', academicYear = '', classId = '', avatar = '', coverPhoto = '', documents = []) {
        super(userName, userId, userRole, email, loginCount);
        this.phoneNum = phoneNum;
        this.hcmutId = hcmutId;
        this.faculty = faculty;
        this.major = major;
        this.academicYear = academicYear;
        this.classId = classId;
        this.avatar = avatar;
        this.coverPhoto = coverPhoto;
        this.documents = documents;
    }

    convertToJSON() {
        return {
            userName: this.userName?? '',
            userId: this.userId?? '',
            userRole: this.userRole?? '',
            email: this.email?? '',
            loginCount: this.loginCount,
            phoneNum: this.phoneNum?? '',
            hcmutId: this.hcmutId?? '',
            faculty: this.faculty?? '',
            major: this.major?? '',
            academicYear: this.academicYear?? '',
            classId: this.classId?? '',
            avatar: this.avatar?? '',
            coverPhoto: this.coverPhoto?? '',
            documents: this.documents?? []
        };
    }

    setInfoFromJSON(json) {
        this.userName = json.userName?? '';
        this.userId = json.userId?? '';
        this.userRole = json.userRole?? '';
        this.email = json.email?? '';
        this.loginCount = parseInt(json.loginCount) || 0;
        this.phoneNum = json.phoneNum?? '';
        this.hcmutId = json.hcmutId?? '';
        this.faculty = json.faculty?? '';
        this.major = json.major?? '';
        this.academicYear = json.academicYear?? '';
        this.classId = json.classId?? '';
        this.avatar = json.avatar?? '';
        this.coverPhoto = json.coverPhoto?? '';
        this.documents = json.documents?? [];
    }
}

export class SPSO extends IUser {
    highestAuthority = false;
    employeeId = '';
    address = '';
    phoneNum = '';
    lastLogin = '';

    constructor(userName = '', userId = '', userRole = '', email = '', loginCount = 0, highestAuthority = false, employeeId = '', address = '', phoneNum = '', lastLogin = '') {
        super(userName, userId, userRole, email, loginCount);
        this.highestAuthority = highestAuthority;
        this.employeeId = employeeId;
        this.address = address;
        this.phoneNum = phoneNum;
        this.lastLogin = lastLogin;
    }

    convertToJSON() {
        return {
            userName: this.userName?? '',
            userId: this.userId?? '',
            userRole: this.userRole?? '',
            email: this.email?? '',
            loginCount: this.loginCount?? 0,
            highestAuthority: this.highestAuthority?? false,
            employeeId: this.employeeId?? '',
            address: this.address?? '',
            phoneNum: this.phoneNum?? '',
            lastLogin: this.lastLogin?? ''
        };
    }

    setInfoFromJSON(json) {
        this.userName = json.userName?? '';
        this.userId = json.userId?? '';
        this.userRole = json.userRole?? '';
        this.email = json.email?? '';
        this.loginCount = parseInt(json.loginCount) || 0;
        this.highestAuthority = json.highestAuthority?? false;
        this.employeeId = json.employeeId?? '';
        this.address = json.address?? '';
        this.phoneNum = json.phoneNum?? '';
        this.lastLogin = json.lastLogin?? '';
    }
}