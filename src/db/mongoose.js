const mongoose = require('mongoose');
const validator = require('validator');
const passwordValidator = require('password-validator');

// connect to mongodb

mongoose.connect('mongodb://localhost/task-manager-api');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// models

//set up password schema
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.has().symbols()
.is().not().oneOf(['password']);

// set up user schema

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (value) => {
                return validator.isLength(value, { min: 3 });
            },
            message: 'Name must be at least 3 characters'
        }
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value <= 0) {
                throw new Error('Age must be a positive number');
            }

            if (value % 1 !== 0) {
                throw new Error('Age must be an integer');
            }

            if (value > 120) {
                throw new Error('Age must be less than or equal to 120');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!passwordSchema.validate(value)) {
                throw new Error('Password is invalid');
            }
        }            
}});


User.index = { name: 1 };

const pawel = new User({ name: 'pawel', age: 20, email: 'user_email2@example.com', password: "Password123!" });

pawel.save().then( () => {
    console.log(pawel);
}).catch( (err) => {
  console.log('Error: ', err);
});

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
        validator: (value) => {
            return validator.isLength(value, { min: 5 });
        },
        message: 'Description must be at least 5 characters'
    }
  },
  completed: {
    type: Boolean,
    default: false,
    required: false,
  },
})

Task.index = { description: 1 };

const task = new Task({
  description: 'Learn how to play violin'
});

task.save().then( () => {
    console.log(task);
}).catch( (err) => {
  console.log('Error: ', err);
});

