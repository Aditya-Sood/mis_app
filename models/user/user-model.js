function User() {};


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
    }

    getDepartment: function(){
        return this.department;
    }

    getContactNo: function(){
        return this.contactNo;
    }

    getAddress: function(){
        return this.address;
    }

    getRole: function(){
        return this.role;
    }

    getPicPath: function(){
        return this.picpath;
    }

    getEmail: function(){
        return this.email;
    }

    getSex: function(){
        return this.sex;
    }

    getFirstName: function(){
        return this.firstName;
    }

    getLastName: function(){
        return this.lastName;
    }

    getMiddleName: function(){
        return this.middleName;
    }

    getSalutation: function(){
        return this.salutation;
    }

    getId:function(){
        return this.id;
    }
};

module.exports = User;