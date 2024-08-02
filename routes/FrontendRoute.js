const express = require('express')
const { index, about, appointment, blog_sidebar, blog_single, confirmation, contact, department_single, department, doctor_single, doctor, service, addComment, createContact, make_Appointment, registerUser, registration_page, login_page, loginUser, logout, userAuthCheck, dashboard_user, user_appointments, confirmEmail, forgotPassword, resetPassword, showResetPasswordForm, showForgotPasswordForm, showUpdatePasswordForm } = require('../controller/FrontendController')
const { jwtAuth } = require('../middleware/userAuth')
const { checkEmail } = require('../middleware/verify')


const Router = express.Router()

//routes
Router.use(jwtAuth)

Router.get('/', index)
Router.get('/about', about)
Router.get('/appointment', appointment)
Router.get('/blog-sidebar', blog_sidebar)
Router.get('/blog-single/:id', blog_single)
Router.post('/blog-single/:id/comment', userAuthCheck, addComment)
Router.get('/confirmation', confirmation)
Router.get('/contact', contact)
Router.post('/contact-post', createContact)
Router.get('/department-single/:id', department_single)
Router.get('/department', department)
Router.get('/doctor-single/:id', doctor_single)
Router.get('/doctor', doctor)
Router.get('/service', service)
Router.post('/make-appointment', userAuthCheck, make_Appointment)
Router.post('/register', checkEmail, registerUser)
Router.get('/getRegistration', registration_page)
Router.get('/confirmation/:email/:token', confirmEmail);
Router.get('/forgotPassword', showForgotPasswordForm);
Router.post('/forgotPassword', forgotPassword);
Router.get('/resetPassword/:token', showResetPasswordForm);
Router.post('/resetPassword/:token', resetPassword);
Router.get('/getLogin', login_page)
Router.post('/login', loginUser)
Router.get('/dashboard', userAuthCheck, dashboard_user)
Router.get('/appointment_details', userAuthCheck, user_appointments)
Router.get('/logout', logout)

module.exports = Router