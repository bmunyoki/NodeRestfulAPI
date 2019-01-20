const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length > 0){
                return res.status(409).json({
                    message: "Email address already in use"
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({
                            message: "Error hashing password!",
                            error: err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(user => {
                                const response = {
                                    count: user.length,
                                    user: user.map(usr => {
                                        return {
                                            id: usr._id,
                                            first_name: usr.first_name,
                                            last_name: usr.last_name,
                                            email: usr.email,
                                            created_at: usr.created_at,
                                            updated_at: usr.updated_at
                                        }
                                    })
                                }

                                res.status(201).json(response)
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: "Error creating user",
                                    error: err
                                })
                            })
                    }
                });
            }
        })
}

exports.users_login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length != 1){
                return res.status(404).json({
                    message: "Authentication failed!"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: "Auth failed!",
                        error: err
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.SECRET_KEY,
                        {
                            expiresIn: "90d"
                        }
                    );

                    return res.status(200).json({
                        message: "Auth success!",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.users_get_all_users = (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(user => {
                    return {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        created_at: user.created_at,
                        updated_at: user.updated_at
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.users_delete_user = (req, res, next) => {
    User.findOneAndRemove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}