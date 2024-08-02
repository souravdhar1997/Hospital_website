const DepartmentModel = require('../model/Department')
const DoctorModel = require('../model/Doctor')
const ServicesModel = require('../model/Services')
const AboutModel = require('../model/About')
const ReviewModel = require('../model/Review')
const CareModel = require('../model/Care')
const PartnerModel = require('../model/Partners')
const Blog = require('../model/Blog')
const BlogCategory = require('../model/BlogCategory')
const Comment = require('../model/Comment')
const Contact = require('../model/Contact')
const AppointmentModel = require('../model/Appointment')
const UserModel = require('../model/User')
const { hashPassword, comparePasswords, createToken } = require('../middleware/userAuth')
const config = require('../config/config')
const Banner = require('../model/Banner')
const Feature = require('../model/Features')
const AboutIndex = require('../model/AboutIndex')
const Awards = require('../model/Awards')
const Cta = require('../model/Cta')
const Footer = require('../model/Footer')
const mongoose = require('mongoose')
const Title = require('../model/Title')
const Token = require('../model/Token')
const utils = require('../utils/utils')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const ContactInfo = require('../model/ContactInfo')


class frontendController {

    index = async (req, res) => {

        const features = await Feature.find()
        const banner = await Banner.find()
        const aboutSections = await AboutIndex.find()
        const reviews = await ReviewModel.find()
        const cares = await CareModel.find()
        const partners = await PartnerModel.find()
        const departments = await DepartmentModel.find()
        const doctors = await DoctorModel.find()
        const footer = await Footer.find()
        // Replace backslashes with forward slashes in the image path
        banner.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('index', {
                title: "Index Page",
                features,
                banner,
                aboutSections,
                reviews,
                cares,
                partners,
                departments,
                doctors,
                footer,
                user: req.user
            })
        } catch (error) {
            console.error();
        }

    }


    about = async (req, res) => {

        const titleData = await Title.find()
        const abouts = await AboutModel.find();
        const awards = await Awards.find();
        const reviews = await ReviewModel.find();
        const footer = await Footer.find()
        const doctors = await DoctorModel.aggregate([
            {
                $lookup: {
                    from: "departments", // The name of the department collection
                    localField: "department", // The field in the doctor documents
                    foreignField: "_id", // The field in the department documents
                    as: "department"
                }
            },
            {
                $unwind: "$department" // Unwind the array to denormalize the data
            }
        ]);

        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('about', {
                title: "About Page",
                titleData,
                abouts,
                doctors,
                awards,
                reviews,
                footer,
                user: req.user
            });
        } catch (error) {
            console.error('Error fetching data for the about page:', error);
        }
    }


    appointment = async (req, res) => {

        const titleData = await Title.find()
        const allDepartments = await DepartmentModel.find()
        const allDoctors = await DoctorModel.find()
        const footer = await Footer.find()
        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('appointment', {
                title: "Appointment Page",
                titleData,
                allDepartments,
                allDoctors,
                footer,
                user: req.user,
                flashMessage4: req.flash('message4')
            })
        } catch (error) {
            console.error();
        }

    }

    make_Appointment = async (req, res) => {
        try {
            const userId = req.user.id;
            const { department, doctor, date, time, name, phone, message } = req.body
            // validation
            if (!(department && doctor && date && time && name && phone && message)) {
                req.flash("message4", "all inputs are required");
                res.redirect('back');
            }
            const newAppointment = new AppointmentModel({
                user: userId, department, doctor, date, time, name, phone, message
            })
            await newAppointment.save()

            // add the appointment to the user's database
            const a_user = await UserModel.findById(userId)
            a_user.appointment.push(newAppointment._id)
            await a_user.save()

            res.redirect('/confirmation')
        }
        catch (error) {
            console.error();
        }
    }


     blog_sidebar = async (req, res) => {
        try {
            const titleData = await Title.find();
            const page = parseInt(req.query.page) || 1;
            const limit = 2; // Number of blogs per page
            const skip = (page - 1) * limit;
    
            const searchQuery = req.query.search || '';
            const selectedCategory = req.query.category || '';
    
            // Search blogs by title, content, or any other fields you want
            let searchCriteria = searchQuery ? { 
                $or: [
                    { title: new RegExp(searchQuery, 'i') },
                    { excerpt: new RegExp(searchQuery, 'i') }
                ]
            } : {};
    
            // Filter by category if selected
            if (selectedCategory) {
                searchCriteria = {
                    ...searchCriteria,
                    category: selectedCategory
                };
            }
    
            const blogs = await Blog.find(searchCriteria)
                .skip(skip)
                .limit(limit)
                .populate('comment');
            
            const categories = await BlogCategory.find();
            const popularPosts = await Blog.find().sort({ views: -1 }).limit(5);
            const footer = await Footer.find();
    
            // Get total number of blogs to calculate total pages
            const totalBlogs = await Blog.countDocuments(searchCriteria);
            const totalPages = Math.ceil(totalBlogs / limit);
    
            // Replace backslashes with forward slashes in the image path
            titleData.forEach(item => {
                item.image = item.image.replace(/\\/g, '/');
            });
    
            res.render('blog-sidebar', {
                title: "Blog-sidebar Page",
                titleData,
                blogs,
                categories,
                popularPosts,
                footer,
                user: req.user,
                currentPage: page,
                totalPages,
                searchQuery,
                selectedCategory
            });
        } catch (error) {
            console.error(error);
        }
    };
    
    


     blog_single = async (req, res) => {
        try {
            const id = req.params.id;
            const blogDetails = await Blog.findById(id).populate('category').populate('comment');
    
            // Increment views by 1
            blogDetails.views += 1;
            await blogDetails.save();
    
            const searchQuery = req.query.search || '';
            const selectedCategory = req.query.category || '';
    
            // Search criteria for popular posts
            let searchCriteria = searchQuery ? { 
                $or: [
                    { title: new RegExp(searchQuery, 'i') },
                    { excerpt: new RegExp(searchQuery, 'i') }
                ]
            } : {};
    
            // Filter by category if selected
            if (selectedCategory) {
                searchCriteria = {
                    ...searchCriteria,
                    category: selectedCategory
                };
            }
    
            const popularPosts = await Blog.find(searchCriteria).sort({ views: -1 }).limit(5);
            const categories = await BlogCategory.find();
            const footer = await Footer.find();
            const titleData = await Title.find();
    
            // Replace backslashes with forward slashes in the image path
            titleData.forEach(item => {
                item.image = item.image.replace(/\\/g, '/');
            });
    
            res.render('blog-single', {
                title: "Blog-single Page",
                titleData,
                blogDetails,
                popularPosts,
                categories,
                footer,
                user: req.user,
                searchQuery,
                selectedCategory
            });
        } catch (error) {
            console.error(error);
        }
    };
    

    addComment = async (req, res) => {
        try {
            // Extract the blog ID from the request parameters
            const blogId = req.params.id;

            const { name, email, content } = req.body;

            const newComment = new Comment({
                name,
                email,
                content,
                blog: blogId
            });

            const savedComment = await newComment.save();

            // Update the blog with the new comment
            await Blog.findByIdAndUpdate(blogId, { $push: { comment: savedComment._id } });

            res.redirect(`/blog-single/${blogId}`);
        } catch (error) {
            console.error();
        }
    }

    confirmation = async (req, res) => {
        const footer = await Footer.find()
        res.render('confirmation', {
            title: "Confirmation Page",
            footer,
            user: req.user
        })
    }

     contact = async (req, res) => {
        try {
            const titleData = await Title.find();
            const ourContactInfo = await ContactInfo.find()
            const footer = await Footer.find();
    
            // Replace backslashes with forward slashes in the image path
            titleData.forEach(item => {
                item.image = item.image.replace(/\\/g, '/');
            });
    
            res.render('contact', {
                title: "Contact Page",
                titleData,
                ourContactInfo,
                footer,
                user: req.user
            });
        } catch (error) {
            console.error(error);
        }
    };
    

    createContact = async (req, res) => {
        try {
            const contactDetails = new Contact({
                fullName: req.body.name,
                email: req.body.email,
                topic: req.body.topic,
                phone: req.body.phone,
                message: req.body.message
            })
            await contactDetails.save()
            res.redirect('/contact')
        } catch (error) {
            console.error();
        }
    }

    department_single = async (req, res) => {

        const titleData = await Title.find()
        const singleDepartment = await DepartmentModel.findById(req.params.id)
        const footer = await Footer.find()
        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('department-single', {
                title: "Department Single Page",
                titleData,
                singleDepartment,
                footer,
                user: req.user
            })
        } catch (error) {
            console.error();
        }

    }

    department = async (req, res) => {

        const titleData = await Title.find()
        const departments = await DepartmentModel.find()
        const footer = await Footer.find()
        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('department', {
                title: "Department Page",
                titleData,
                departments,
                footer,
                user: req.user
            })
        } catch (error) {

        }

    }

    doctor_single = async (req, res) => {

        const titleData = await Title.find()
        const id = req.params.id;
        const footer = await Footer.find()
        const doctor = await DoctorModel.findById(id).populate('department')
        if (!doctor) {
            return res.status(404).send('Doctor not found');
        }
        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('doctor-single', {
                title: "Doctor Single Page",
                titleData,
                doctor,
                footer,
                user: req.user
            })
        } catch (error) {
            res.redirect('/doctor')
        }
    }

    doctor = async (req, res) => {
        const titleData = await Title.find()
        const departments = await DepartmentModel.find()
        const doctors = await DoctorModel.find().populate('department')
        const cta = await Cta.find()
        const footer = await Footer.find()
        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('doctor', {
                title: "Doctor Page",
                titleData,
                departments,
                doctors,
                cta,
                footer,
                user: req.user
            })
        } catch (error) {
            console.log(error);
        }
    }

    service = async (req, res) => {

        const titleData = await Title.find()
        const services = await ServicesModel.find()
        const cta = await Cta.find()
        const footer = await Footer.find()

        // Replace backslashes with forward slashes in the image path
        titleData.forEach(item => {
            item.image = item.image.replace(/\\/g, '/');
        });
        try {
            res.render('service', {
                title: "Service Page",
                titleData,
                services,
                cta,
                footer,
                user: req.user
            })
        } catch (error) {
            console.error();
        }

    }

    registration_page = async (req, res) => {
        const footer = await Footer.find()
        res.render('userRegistration', {
            title: 'Registration Page',
            footer,
            user: req.user,
            flashMessage2: req.flash('message2'),
            flashMessage1: req.flash('message1')
        })
    }

    // user registration post
    registerUser = async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
    
            // Check if user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                req.flash('message2', 'Email already exists.');
                return res.redirect('/getRegistration');
            }
    
            // Hash the password
            const hashedPwd = await bcrypt.hash(password, 10);
    
            // Create a new user
            const user = new UserModel({ name, email, phone, password: hashedPwd });
            await user.save();
    
            // Generate a verification token
            const token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex'),
                type: 'verification'
            });
            await token.save();
    
            // Configure the email transporter
            const senderEmail = "itsmeratul97@gmail.com";
            const senderPassword = "dhnsnyhmwjzfircv";
            const transporter = utils.transport(senderEmail, senderPassword);
    
            // Prepare the verification email
            const mailOptions = {
                from: 'itsmeratul97@gmail.com',
                to: email,
                subject: 'Account Verification',
                text: `Hello ${name},\n\nPlease verify your account by clicking the link: \nhttp:\/\/${req.headers.host}\/confirmation\/${email}\/${token.token}\n\nThank You!\n`
            };
    
            // Send the verification email
            await utils.mailSender(req, res, transporter, mailOptions);
    
            req.flash('message1', 'User registered successfully. Please verify your email.');
            res.redirect('/getRegistration');
        } catch (error) {
            console.log("Error occurred during registration:", error);
            req.flash('message2', 'Registration failed. Please try again.');
            res.redirect('/getRegistration');
        }
    };

    //user confirmation
    confirmEmail = (req, res) => {
    Token.findOne({token : req.params.token})
    .then(token =>{
        if(!token){
            console.log("verification link may be expired");
        }else{
            UserModel.findOne({_id : token._userId, email : req.params.email})
            .then(user =>{
                if(!user){
                    req.flash("message5","User not found")
                    res.redirect("/getLogin")
                }else if(user.isVerified){
                    req.flash("message5","user is already verified");
                }else{
                    user.isVerified = true;
                    user.save()
                    .then((result) => {
                        req.flash("message5","user verified successFully")
                        res.redirect("/getLogin")
                    }).catch((err) => {
                        console.log("somthing went wrong",err);
                    });
                }
            }).catch(err =>{
                console.log("error while finding user",err);
            })
        }
    }).catch(err =>{
        console.log("error while finding token",err);
    })
    }
    

    // show forgot password form
    showForgotPasswordForm = (req, res) => {
        res.render('forgotPassword', { messages: req.flash() });
    };
    

    //forgot password
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });
    
            if (!user) {
                req.flash('message2', 'No account with that email address exists.');
                return res.redirect('/forgotPassword');
            }
    
            const token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex'),
                type: 'passwordReset'
            });
            await token.save();
    
            const senderEmail = "itsmeratul97@gmail.com";
            const senderPassword = "dhnsnyhmwjzfircv";
            const transporter = utils.transport(senderEmail, senderPassword);
    
            const mailOptions = {
                from: 'itsmeratul97@gmail.com',
                to: email,
                subject: 'Password Reset',
                text: 'Hello,\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/resetPassword\/' + token.token + '\n\nThank You!\n'
            };
    
            await utils.mailSender(req, res, transporter, mailOptions);
            req.flash('message1', 'An email has been sent to ' + email + ' with further instructions.');
            res.redirect('/forgotPassword');
        } catch (error) {
            console.log("Error occurred during password reset request:", error);
            req.flash('message2', 'Error occurred during password reset request. Please try again.');
            res.redirect('/forgotPassword');
        }
    };

    //show reset pswd form
    showResetPasswordForm = (req, res) => {
        const { token } = req.params;
        res.render('resetPassword', { token, messages: req.flash() });
    };

    //reset password
    resetPassword = async (req, res) => {
        try {
            const { token: tokenParam } = req.params;
            const { password, confirmPassword } = req.body;
    
            if (password !== confirmPassword) {
                req.flash('message2', 'Passwords do not match.');
                return res.redirect('/resetPassword/' + tokenParam);
            }
    
            const token = await Token.findOne({ token: tokenParam, type: 'passwordReset' });
    
            if (!token) {
                req.flash('message2', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgotPassword');
            }
    
            const user = await UserModel.findOne({ _id: token._userId });
    
            if (!user) {
                req.flash('message2', 'No account with that email address exists.');
                return res.redirect('/forgotPassword');
            }
    
            const hashedPwd = await bcrypt.hash(password, 10);
            user.password = hashedPwd;
            await user.save();
    
            req.flash('message1', 'Password has been successfully reset.');
            res.redirect('/getLogin');
        } catch (error) {
            console.log("Error occurred during password reset:", error);
            req.flash('message2', 'Error occurred during password reset. Please try again.');
            res.redirect('/resetPassword/' + req.params.token);
        }
    };


    login_page = async (req, res) => {
        const footer = await Footer.find()
        res.render('login', {
            title: 'User Login Page',
            footer,
            user: req.user,
            flashMessage1: req.flash('message1'),
            flashMessage2: req.flash('message2'),
            flashMessage3: req.flash('message3'),
            flashMessage5: req.flash('message5')
        })
    }

    //login post
    loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await UserModel.findOne({ email });

            if (!user) {
                req.flash('message2', "Email does not exist.");
                console.log('User does not exist with this email...');
                return res.redirect('/getLogin');
            }

            if (user) {
                if (user.role === "USER") {

                    // Compare passwords
                    const passwordMatch = await comparePasswords(password, user.password);

                    if (!passwordMatch) {
                        req.flash('message2', "Incorrect password.");
                        console.log('Password does not match.');
                        return res.redirect('/getLogin');
                    }

                    // Create token
                    const token = await createToken({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role,
                    })
                    if (token) {
                        res.cookie('tokenData', token);
                        console.log('Login successful', user);
                        return res.redirect('/dashboard');
                    }

                } else {
                    // for users with other roles
                    req.flash('message2', "You are not permitted to Log in!");
                    console.log('User does not have permission to Log in!');
                    return res.redirect('/getLogin');
                }
            }
        }
        catch (error) {
            console.error('Error in logging in User:', error);
            req.flash('message2', 'An error occurred. Please try again.');
            return res.redirect('/getLogin');
        }
    };


    userAuthCheck = (req, res, next) => {
        if (req.user) {
            next()
        } else {
            req.flash('message3', 'Please login first!')
            console.log('plz login first!');
            res.redirect("/getLogin");
        }
    }

    dashboard_user = async (req, res) => {
        const footer = await Footer.find()
        
        try {
            res.render('UserDashboard', {
                title: 'User Dashboard Page',
                footer,
                user: req.user
            })
        } catch (error) {
            console.error();
        }

    }

    user_appointments = async (req, res) => {
        try {
            const footer = await Footer.find();
            const userId = new mongoose.Types.ObjectId(req.user.id);

            const appointments = await AppointmentModel.aggregate([
                { $match: { user: userId } },
                {
                    $lookup: {
                        from: 'doctors',
                        localField: 'doctor',
                        foreignField: '_id',
                        as: 'doctor'
                    }
                },
                { $unwind: '$doctor' },
                {
                    $lookup: {
                        from: 'departments',
                        localField: 'department',
                        foreignField: '_id',
                        as: 'department'
                    }
                },
                { $unwind: '$department' },
                {
                    $project: {
                        user: 1,
                        date: 1,
                        time: 1,
                        name: 1,
                        phone: 1,
                        'doctor.name': 1,
                        'department.department': 1,
                    }
                }
            ]);

            res.render('table-appointments', {
                title: 'User Appointments',
                appointments,
                footer,
                user: req.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    };


    logout = (req, res) => {
        res.clearCookie("tokenData")
        res.redirect('/getLogin')
    }

}


module.exports = new frontendController()