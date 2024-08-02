const DoctorModel = require('../model/Doctor')
const DepartmentModel = require('../model/Department')
const ServicesModel = require('../model/Services')
const AboutModel = require('../model/About')
const ReviewModel = require('../model/Review')
const CareModel = require('../model/Care')
const PartnerModel = require('../model/Partners')
const BlogCategory = require('../model/BlogCategory')
const Blog = require('../model/Blog')
const CommentModel = require('../model/Comment')
const Contact = require('../model/Contact')
const { Validator } = require('node-input-validator')
const path = require('path')
const Banner = require('../model/Banner')

class apiController {

    createBanner = async (req, res) => {
        try {
            const { title, sub_title, description } = req.body
            const banner = new Banner({
                title, sub_title, description
            })
            if (req.file) {
                banner.image = req.file.path
            }
            await banner.save()
            return res.status(201).json({
                status: true,
                message: "Banner created successfully",
                banner
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Banner failed to create",
                error: error.message
            })
        }
    }
    
    createDepartment = async (req, res) => {
        try {
            const { department, title, description, details, timings, services } = req.body;
            const dept = new DepartmentModel({ department, title, description, details, timings: JSON.parse(timings), services: JSON.parse(services) })
            if (req.file) {
                dept.image = req.file.path;
            }
            const deptData = await dept.save()
            return res.status(201).json({
                status: true,
                message: "Department created successfully",
                deptData
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Department failed to add",
                error: error.message
            })
        }
    }

    getDepartments = async (req, res) => {
        try {
            const departments = await DepartmentModel.find({});
            return res.status(200).json({
                status: true,
                message: "Departments fetched successfully",
                departments
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Failed to fetch departments",
                error: error.message
            });
        }
    }

    getDepartmentById = async (req, res) => {
        try {
            const department = await DepartmentModel.findById(req.params.id);
            if (!department) {
                return res.status(404).json({
                    status: false,
                    message: "Department not found"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Department fetched successfully",
                department
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Failed to fetch department",
                error: error.message
            });
        }
    }
    
    editDepartment = async (req, res) => {
        try {
            const { department, title, description, details, timings, services } = req.body;
            const deptData = {
                department,
                title,
                description,
                details,
                timings: JSON.parse(timings),
                services: JSON.parse(services)
            };
            if (req.file) {
                deptData.image = req.file.path;
            }
            const updatedDepartment = await DepartmentModel.findByIdAndUpdate(req.params.id, deptData, { new: true });
            if (!updatedDepartment) {
                return res.status(404).json({
                    status: false,
                    message: "Department not found"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Department updated successfully",
                updatedDepartment
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Failed to update department",
                error: error.message
            });
        }
    }
    
    deleteDepartment = async (req, res) => {
        try {
            const deletedDepartment = await DepartmentModel.findByIdAndDelete(req.params.id);
            if (!deletedDepartment) {
                return res.status(404).json({
                    status: false,
                    message: "Department not found"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Department deleted successfully",
                deletedDepartment
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: false,
                message: "Failed to delete department",
                error: error.message
            });
        }
    }
    

    createDoctor = async (req, res) => {
        try {
            const { name, department, description, qualifications, skills, appointment } = req.body;
            const validation = new Validator(req.body, {
                name: 'required',
                department: 'required',
                description: 'required',
                qualifications: 'required',
                skills: 'required',
                appointment: 'required'
            })
            const matched = await validation.check()
            if (!matched) {
                return res.status(422).json({
                    status: false,
                    message: 'All entries required',
                    error: validation.errors
                })
            }
            const doctor = new DoctorModel({
                name,
                department,
                description,
                qualifications: JSON.parse(qualifications),
                skills: JSON.parse(skills),
                appointment: JSON.parse(appointment)
            })
            if (req.file) {
                doctor.image = req.file.path;
            }
            const data = await doctor.save()
            return res.status(201).json({
                status: true,
                message: "Doctor created successfully",
                data
            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            })

        }
    }

    getAllDoctors = async (req, res) => {
        try {
            const doctors = await DoctorModel.find().populate('department');
            return res.status(200).json({
                status: true,
                data: doctors
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            });
        }
    };

    getDoctorById = async (req, res) => {
        try {
            const doctor = await DoctorModel.findById(req.params.id).populate('department');
            if (!doctor) {
                return res.status(404).json({
                    status: false,
                    message: 'Doctor not found'
                });
            }
            return res.status(200).json({
                status: true,
                data: doctor
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: error.message
            });
        }
    };

    // Update Doctor
    updateDoctor = async (req, res) => {
    try {
        const { name, department, description, qualifications, skills, appointment } = req.body;

        const validation = new Validator(req.body, {
            name: 'required',
            department: 'required',
            description: 'required',
            qualifications: 'required',
            skills: 'required',
            appointment: 'required'
        });
        const matched = await validation.check();
        if (!matched) {
            return res.status(422).json({
                status: false,
                message: 'All entries required',
                error: validation.errors
            });
        }

        let doctor = await DoctorModel.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                status: false,
                message: 'Doctor not found'
            });
        }

        doctor.name = name;
        doctor.department = department;
        doctor.description = description;
        doctor.qualifications = JSON.parse(qualifications);
        doctor.skills = JSON.parse(skills);
        doctor.appointment = JSON.parse(appointment);

        if (req.file) {
            doctor.image = req.file.path;
        }

        const updatedDoctor = await doctor.save();
        return res.status(200).json({
            status: true,
            message: 'Doctor updated successfully',
            data: updatedDoctor
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
};

deleteDoctor = async (req, res) => {
    try {
        const doctor = await DoctorModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status: true,
            message: 'Doctor deleted successfully',
            doctor
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
};
    
    createService = async (req, res) => {
        try {
            const { service, title } = req.body
            const services = new ServicesModel({
                service, title
            })
            if (req.file) {
                services.image = req.file.path
            }
            const data = await services.save()
            return res.status(201).json({
                status: true,
                message: "Service created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Service NOT created",
                error: error.message
            })

        }
    }

    readAllServices = async (req, res) => {
        try {
            const services = await ServicesModel.find();
            return res.status(200).json({
                status: true,
                message: "Services retrieved successfully",
                data: services
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to retrieve services",
                error: error.message
            });
        }
    };
    
    readServiceById = async (req, res) => {
        try {
            const { id } = req.params;
            const service = await ServicesModel.findById(id);
            if (!service) {
                return res.status(404).json({
                    status: false,
                    message: "Service not found"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Service retrieved successfully",
                data: service
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to retrieve service",
                error: error.message
            });
        }
    };

     updateService = async (req, res) => {
        try {
            const { id } = req.params;
            const { service, title } = req.body;
            const updateData = { service, title };
    
            if (req.file) {
                updateData.image = req.file.path;
            }
    
            const updatedService = await ServicesModel.findByIdAndUpdate(id, updateData, { new: true });
    
            if (!updatedService) {
                return res.status(404).json({
                    status: false,
                    message: "Service not found"
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Service updated successfully",
                data: updatedService
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Service NOT updated",
                error: error.message
            });
        }
    };

     deleteService = async (req, res) => {
        try {
            const { id } = req.params;
            const deletedService = await ServicesModel.findByIdAndDelete(id);
    
            if (!deletedService) {
                return res.status(404).json({
                    status: false,
                    message: "Service not found"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Service deleted successfully",
                data: deletedService
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Service NOT deleted",
                error: error.message
            });
        }
    };
    
    

    createAbout = async (req, res) => {
        try {
            const { title, description, review_person, review_title, review } = req.body
            const about = new AboutModel({
                title, description, review_person, review_title, review
            })
            if (req.file) {
                about.image = req.file.path
            }
            const data = await about.save()
            return res.status(201).json({
                status: true,
                message: "About created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "About NOT created",
                error: error.message
            })

        }
    }

    // Read
     getAbouts = async (req, res) => {
    try {
        const abouts = await AboutModel.find();
        return res.status(200).json({
            status: true,
            message: "About entries fetched successfully",
            data: abouts
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed to fetch About entries",
            error: error.message
        });
    }
};

     getAboutById = async (req, res) => {
    try {
        const about = await AboutModel.findById(req.params.id);
        if (!about) {
            return res.status(404).json({
                status: false,
                message: "About entry not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "About entry fetched successfully",
            data: about
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed to fetch About entry",
            error: error.message
        });
    }
};

updateAbout = async (req, res) => {
    try {
        const { title, description, review_person, review_title, review } = req.body;
        let updateData = { title, description, review_person, review_title, review };
        if (req.file) {
            updateData.image = req.file.path;
        }
        const about = await AboutModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!about) {
            return res.status(404).json({
                status: false,
                message: "About entry not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "About entry updated successfully",
            data: about
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed to update About entry",
            error: error.message
        });
    }
};

deleteAbout = async (req, res) => {
    try {
        const about = await AboutModel.findByIdAndDelete(req.params.id);
        if (!about) {
            return res.status(404).json({
                status: false,
                message: "About entry not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "About entry deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed to delete About entry",
            error: error.message
        });
    }
};
    
    createReview = async (req, res) => {
        try {
            const { person, title, review } = req.body
            const reviewed = new ReviewModel({
                person, title, review
            })
            if (req.file) {
                reviewed.image = req.file.path
            }
            const data = await reviewed.save()
            return res.status(201).json({
                status: true,
                message: "Review created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Review NOT created",
                error: error.message
            })

        }
    }

     readReviews = async (req, res) => {
        try {
            const reviews = await ReviewModel.find();
            return res.status(200).json({
                status: true,
                message: "Reviews fetched successfully",
                data: reviews
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to fetch reviews",
                error: error.message
            });
        }
    };

    readOneReview = async (req, res) => {
        try {
            const review = await ReviewModel.findById(req.params.id);
            if (!review) {
                return res.status(404).json({
                    status: false,
                    message: "Review not found"
                });
            }
            return res.status(200).json({
                status: true,
                message: "Review fetched successfully",
                data: review
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to fetch review",
                error: error.message
            });
        }
    };
    
     updateReview = async (req, res) => {
        try {
            const { person, title, review } = req.body;
            const updateData = { person, title, review };
    
            if (req.file) {
                updateData.image = req.file.path;
            }
    
            const updatedReview = await ReviewModel.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );
    
            if (!updatedReview) {
                return res.status(404).json({
                    status: false,
                    message: "Review not found"
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Review updated successfully",
                data: updatedReview
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to update review",
                error: error.message
            });
        }
    };
    
    deleteReview = async (req, res) => {
        try {
            const deletedReview = await ReviewModel.findByIdAndDelete(req.params.id);
    
            if (!deletedReview) {
                return res.status(404).json({
                    status: false,
                    message: "Review not found"
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Review deleted successfully",
                data: deletedReview
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to delete review",
                error: error.message
            });
        }
    };

    createCare = async (req, res) => {
        try {
            const { care, logo, words } = req.body
            const cared = new CareModel({
                care, logo, words
            })
            const data = await cared.save()
            return res.status(201).json({
                status: true,
                message: "Care created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Care NOT created",
                error: error.message
            })

        }
    }

    getCare = async (req, res) => {
        try {
            const cares = await CareModel.find();
            return res.status(200).json({
                status: true,
                message: "Cares retrieved successfully",
                data: cares
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Error retrieving cares",
                error: error.message
            });
        }
    }

    updateCare = async (req, res) => {
        try {
            const { id } = req.params;
            const { care, logo, words } = req.body;
    
            const updatedCare = await CareModel.findByIdAndUpdate(
                id,
                { care, logo, words },
                { new: true, runValidators: true }
            );
    
            if (!updatedCare) {
                return res.status(404).json({
                    status: false,
                    message: "Care not found"
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Care updated successfully",
                data: updatedCare
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Error updating care",
                error: error.message
            });
        }
    }

    deleteCare = async (req, res) => {
        try {
            const { id } = req.params;
    
            const deletedCare = await CareModel.findByIdAndDelete(id);
    
            if (!deletedCare) {
                return res.status(404).json({
                    status: false,
                    message: "Care not found"
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Care deleted successfully"
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Error deleting care",
                error: error.message
            });
        }
    }


    createPartner = async (req, res) => {
        try {
            const partner = new PartnerModel({
                image: req.file.path
            })
            const data = await partner.save()
            return res.status(201).json({
                status: true,
                message: "Partner created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Partner NOT created",
                error: error.message
            })

        }
    }

    getPartners = async (req, res) => {
        try {
            const partners = await PartnerModel.find();
            return res.status(200).json({
                status: true,
                message: "Partners retrieved successfully",
                data: partners
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to retrieve partners",
                error: error.message
            });
        }
    };

    updatePartner = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = {
                image: req.file.path
            };
    
            const partner = await PartnerModel.findByIdAndUpdate(id, updatedData, { new: true });
    
            if (!partner) {
                return res.status(404).json({
                    status: false,
                    message: "Partner not found",
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Partner updated successfully",
                data: partner
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to update partner",
                error: error.message
            });
        }
    };

    deletePartner = async (req, res) => {
        try {
            const { id } = req.params;
            const partner = await PartnerModel.findByIdAndDelete(id);
    
            if (!partner) {
                return res.status(404).json({
                    status: false,
                    message: "Partner not found",
                });
            }
    
            return res.status(200).json({
                status: true,
                message: "Partner deleted successfully",
            });
            } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Failed to delete partner",
                error: error.message
            });
        }
    };
    

    createBlogCategory = async (req, res) => {
        try {
            const { name } = req.body
            const category = new BlogCategory({
                name
            })
            const data = await category.save()
            return res.status(201).json({
                status: true,
                message: "Category created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Category NOT created",
                error: error.message
            })

        }
    }

    // Read all categories
     getAllBlogCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.find();
        return res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Categories NOT fetched",
            error: error.message
        });
    }
};

// Read a single category by ID
 getBlogCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await BlogCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Category fetched successfully",
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Category NOT fetched",
            error: error.message
        });
    }
};

// Update a category by ID
 updateBlogCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await BlogCategory.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Category NOT updated",
            error: error.message
        });
    }
};

// Delete a category by ID
 deleteBlogCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await BlogCategory.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Category NOT deleted",
            error: error.message
        });
    }
};


    createBlog = async (req, res) => {
        try {
            const { title, content, excerpt, author, category } = req.body
            const blog = new Blog({
                title, content, excerpt, author, category
            })
            if (req.file) {
                blog.image = req.file.path
            }
            const data = await blog.save()
            // Increment the post count for the category
            await BlogCategory.findByIdAndUpdate(category, { $inc: { postCount: 1 } });
            return res.status(201).json({
                status: true,
                message: "Blog created successfully",
                data
            })
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Blog NOT created",
                error: error.message
            })

        }
    }

    // Read all blogs
readBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('category').populate('comment');
        return res.status(200).json({
            status: true,
            message: "Blogs fetched successfully",
            data: blogs
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error fetching blogs",
            error: error.message
        });
    }
};

// Read single blog by ID
readBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('category').populate('comment');
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Blog fetched successfully",
            data: blog
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error fetching blog",
            error: error.message
        });
    }
};

    // Update blog
updateBlog = async (req, res) => {
    try {
        const { title, content, excerpt, author, category, status } = req.body;
        const updateData = { title, content, excerpt, author, category, status };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }
        
        return res.status(200).json({
            status: true,
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Error updating blog",
            error: error.message
        });
    }
};


    deleteBlog = async (req, res) => {
        try {
            const blogId = req.params.id;

            // Find the blog w.r.t id
            const blog = await Blog.findById(blogId);

            if (!blog) {
                return res.status(404).json({
                    message: "Blog not found"
                });
            }

            // Delete the blog 
            await Blog.findByIdAndDelete(blogId);

            // Decrement the post count for the category
            await BlogCategory.findByIdAndUpdate(blog.category, { $inc: { postCount: -1 } });

            return res.status(200).json({
                status: true,
                message: "Blog post deleted successfully"
            });

        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "Blog Not deleted"
            });
        }
    }

}

module.exports = new apiController()