const express = require('express')
const { createDoctor, createDepartment, createService, createAbout, createReview, createCare, createPartner, createBlogCategory, createBlog, deleteBlog, createBanner, getDepartments, getDepartmentById, editDepartment, deleteDepartment, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor, readAllServices, readServiceById, updateService, deleteService, getAbouts, getAboutById, updateAbout, deleteAbout, readReviews, readOneReview, updateReview, deleteReview, getCare, updateCare, deleteCare, getPartners, updatePartner, deletePartner, getAllBlogCategories, getBlogCategoryById, updateBlogCategory, deleteBlogCategory, readBlogs, readBlogById, updateBlog } = require('../controller/ApiController')
const Upload = require('../utils/Image')
const { authCheck } = require('../middleware/adminAuth')
const Router = express.Router()

//routes
Router.post('/create-banner', Upload.single('image'), createBanner)
Router.post('/create-department', Upload.single('image'), createDepartment)
Router.get('/get-departments', getDepartments)
Router.get('/get-single-department/:id', getDepartmentById)
Router.post('/edit-department/:id', Upload.single('image'), editDepartment)
Router.delete('/delete-department/:id', deleteDepartment)
Router.post('/create-doctor', Upload.single('image'), createDoctor)
Router.get('/get-doctors', getAllDoctors)
Router.get('/get-doctor/:id', getDoctorById)
Router.put('/update-doctor/:id', Upload.single('image'), updateDoctor)
Router.delete('/delete-doctor/:id', deleteDoctor)
Router.post('/create-service', Upload.single('image'), createService)
Router.get('/all-services', readAllServices)
Router.get('/service/:id', readServiceById)
Router.put('/update-service/:id', Upload.single('image'), updateService)
Router.delete('/delete-service/:id', deleteService)
Router.post('/create-about', Upload.single('image'), createAbout)
Router.get('/all-abouts', getAbouts)
Router.get('/get-about/:id', getAboutById)
Router.put('/update-about/:id', Upload.single('image'), updateAbout)
Router.delete('/delete-about/:id', deleteAbout)
Router.post('/create-review', Upload.single('image'), createReview)
Router.get('/all-reviews', readReviews)
Router.get('/read-review/:id', readOneReview)
Router.put('/update-review/:id', Upload.single('image'), updateReview)
Router.delete('/delete-review', deleteReview)
Router.post('/create-care', createCare)
Router.get('/fetch-care', getCare)
Router.put('/update-care', updateCare)
Router.delete('/delete-care', deleteCare)
Router.post('/create-partner', Upload.single('image'), createPartner)
Router.get('/fetch-partners', getPartners)
Router.put('/update-partner', Upload.single('image'), updatePartner)
Router.delete('/delete-partner', deletePartner)
Router.post('/create-blogCategory', createBlogCategory)
Router.get('/all-blogCategories', getAllBlogCategories)
Router.get('/blogCategory/:id', getBlogCategoryById)
Router.put('/update/blogCategory/:id', updateBlogCategory)
Router.delete('/delete/blogCategory/:id', deleteBlogCategory)
Router.post('/create-blog', Upload.single('image'), authCheck, createBlog)
Router.get('/all-blogs', readBlogs)
Router.get('/getBlog/:id', readBlogById)
Router.put('/update/blog/:id', updateBlog)
Router.delete('/delete-blog/:id', deleteBlog)


module.exports = Router;