var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var DoctorSchema = new mongoose.Schema({
    username:{type:String, unique: true},
    email:{type:String, unique: true},
    doctorid : {type:String},
    speciality : { type: String, trim: true },
    doctorDp: { data: Buffer, contentType: String },
    status : { type: String },
    Appointment : [{
        _id: { type: Schema.ObjectId, auto: true },
        description : { type: String},
        appointmentType : { type: String},
        appointmentTime : { type: String},
        rescheduledTime : { type: String},
        location: {type: String},
        createdOn : { type: Date, default: Date.now},
        updatedon : { type: Date, default: Date.now},
    }],
    follow: { type : Array , default : []},
    following: { type : Array , default : []},
    notification:[{
        _created_at:{type: Date, default: Date.now()},
        event:{type: Schema.Types.ObjectId, ref: 'OnCallSchema' },
        type: {type: String},
        text: {type: String},
        doctorId: {type: String},
        isRead: {type: Boolean, default: false},
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hash: String,
    salt:String
});
var OnCallSchema = new mongoose.Schema({
    doctor :{ type: Schema.Types.ObjectId, ref: 'Doctor' },
    location: {type: String},
    date: { type: String}
});
var locationSchema = new mongoose.Schema({
    location:{type:String, required:true, unique:true},
});
var typeSchema = new mongoose.Schema({
    location:{type:String, required:true, unique:true},
});
// var HospitalSchema = new mongoose.Schema({
//     name:{type:String, required:true, unique:true},
//     doctorid : {type:String, required:true},
//     speciality : { type: String, required: true, trim: true },
//     status : { type: String },
//     Address : [{
//         state : { type: String},
//         city : { type: String},
//         zipCode : { type: String},
//         area : { type: String},
//         street : { type: String},
//     }],
//     doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' }
// });


DoctorSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
        });
    });
});

DoctorSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');
};

DoctorSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha256').toString('hex');

    return this.hash === hash;
};


DoctorSchema.methods.generateJwt = function() {

    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);


    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp:parseInt(exp.getTime() /5000),
    },'secret');
}
 // DoctorSchema.plugin(arrayUniquePlugin);
var Doctor = mongoose.model('Doctor', DoctorSchema);
var OnCall = mongoose.model('OnCall', OnCallSchema);
var Location = mongoose.model('Location', locationSchema);
var Type = mongoose.model('Type', typeSchema);

module.exports = {
    Doctor: Doctor,
    Location: Location,
    Type: Type,
};
//
// module.exports = {
//     Doctor: Doctor,
// };







