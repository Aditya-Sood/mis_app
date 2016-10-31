function User() {
    var id,salutation,firstName,middleName,lastName,sex,email,picpath,role,address,department;
};


User.prototype = {

    setId: function(id) {
        this.id = id;
        return this;
    },

    setSalutation: function(salutation) {
        this.salutation = salutation;
        return this;
    },

    setFirstName: function(firstName) {
        this.firstName = firstName;
        return this;
    },
    
    setMiddleName: function(middleName) {
        this.middleName = middleName;
        return this;
    },

    setLastName: function(lastName) {
        this.lastName = lastName;
        return this;
    },

    setSex: function(sex) {
        this.sex = sex;
        return this;
    },
    
    setEmail: function(email) {
        this.email = email;
        return this;
    },

    setPicpath: function(picpath) {
        this.picpath = picpath;
        return this;
    },
    
    setRole: function(role) {
        this.role = role;
        return this;
    },
    
    setAddress: function(city, state, country, pincode) {
        this.address = {
            city: city,
            state: state,
            country: country,
            pincode: pincode
        };
        return this;
    },
    
    setContactNo: function(contactNo) {
        this.contactNo = contactNo;
        return this;
    },
    
    setDepartment: function(departmentName, departmentType) {
        this.department = {
            departmentName: departmentName,
            departmentType: departmentType
        };
        return this;
    },

};

module.exports = User;