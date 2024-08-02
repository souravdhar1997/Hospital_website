const { comparePasswords, createToken } = require('../middleware/userAuth')
const UserModel = require('../model/User')
const Blog = require('../model/Blog')
const BlogCategory = require('../model/BlogCategory')
const Comment = require('../model/Comment')
const ContactModel = require('../model/Contact')
const Banner = require('../model/Banner')
const Care = require('../model/Care')
const Review = require('../model/Review')
const Feature = require('../model/Features')
const Partners = require('../model/Partners')
const AboutIndex = require('../model/AboutIndex')
const SectionAbout = require('../model/SectionAbout')
const About = require('../model/About')
const Awards = require('../model/Awards')
const Doctor = require('../model/Doctor')
const Department = require('../model/Department')
const Services = require('../model/Services')
const Cta = require('../model/Cta')
const Footer = require('../model/Footer')
const ContactInfo = require('../model/ContactInfo')
const Title = require('../model/Title')
const Appointment = require('../model/Appointment')

class AdminController {

    dashboard = async(req, res) => {
        try {
            const [userCount, blogCount, doctorCount, departmentCount, appointmentCount, servicesCount, awardsCount, partnerCount] = await Promise.all([
                UserModel.countDocuments({ role: 'USER' }),
                Blog.countDocuments(),
                Doctor.countDocuments(),
                Department.countDocuments(),
                Appointment.countDocuments(),
                Services.countDocuments(),
                Awards.countDocuments(),
                Partners.countDocuments()
            ]);
            res.render('Admin/dashboard', {
                title: 'Admin Dashboard',
                admin: req.admin,
                userCount,
                blogCount,
                doctorCount,
                departmentCount,
                appointmentCount,
                servicesCount,
                awardsCount,
                partnerCount
            })
        } catch (error) {
            console.log(error);
        }
    }

    AdminLoginPage = (req, res) => {
        res.render('Admin/login', {
            title: 'Admin Login'
        })
    }

    // login post
    AdminLogin = async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await UserModel.findOne({ email });

            if (!user) {
                //req.flash('message', "Email does not exist.");
                console.log('User does not exist with this email...');
                return res.redirect('/admin/loginView');
            } else if (user) {
                if (user.role === "ADMIN") {
                    // Compare passwords
                    const passwordMatch = await comparePasswords(password, user.password);

                    if (!passwordMatch) {
                        //req.flash('message', "Incorrect password.");
                        console.log('Password does not match.');
                        return res.redirect('/admin/loginView');
                    }

                    // Create token
                    const token = await createToken({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    });

                    if (token) {
                        res.cookie('adminToken', token);
                        console.log(user);
                        return res.redirect('/admin/dashboard');
                    } else {
                        return res.redirect('/admin/loginView');
                    }
                } else {
                    // for users with other roles
                    // req.flash('message', "You are not permitted to Log in!");
                    console.log('User does not have permission to Log in!');
                    return res.redirect('/admin/loginView');
                }
            }
        } catch (error) {
            console.error(error);
            return res.redirect('/admin/loginView');
        }
    };

    //auth check for admin
    adminAuthCheck = (req, res, next) => {
        if (req.admin) {
            // console.log(req.admin);
            next()
        } else {
            res.redirect("/admin/loginView");
        }
    }

    //logout
    logout = (req, res) => {
        res.clearCookie('adminToken')
        res.redirect('/admin/loginView')
    }


    getUsers = async (req, res) => {
        const allUsers = await UserModel.find()
        try {
            res.render('Admin/users', {
                title: 'All Users',
                allUsers,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    activeUser = async (req, res) => {
        try {
            const user = await UserModel.findByIdAndUpdate(req.params.id, { status: true })
            if (user) {
                console.log('User activated');
                res.redirect('back')
            }
        } catch (error) {
            console.log(error);
        }
    }

    deactiveUser = async (req, res) => {
        try {
            const user = await UserModel.findByIdAndUpdate(req.params.id, { status: false })
            if (user) {
                console.log('User Deactivated');
                res.redirect('back')
            }
        } catch (error) {
            console.log(error);
        }
    }

    getFooter = async (req, res) => {
        try {
            const footer = await Footer.find()
            res.render('Admin/footerPage', {
                title: 'Footer Page',
                footer,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createFooter = async (req, res) => {
        const { description, departments, support, email, phone, availability } = req.body;
        const newFooter = new Footer({
            description,
            departments: departments.split(','),
            support: support.split(','),
            contact: {
                email,
                phone,
                availability,
            },
        });

        if (req.file) {
            newFooter.logo = req.file.path;
        }

        try {
            await newFooter.save();
            console.log('Footer Created', newFooter);
            res.redirect('/admin/footer');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    };

    editFooter = async (req, res) => {
        const { description, departments, support, email, phone, availability } = req.body;
        const { id } = req.params;
        const updatedFooter = {
            description,
            departments: departments.split(','),
            support: support.split(','),
            contact: {
                email,
                phone,
                availability,
            },
        };
        if (req.file) {
            updatedFooter.logo = req.file.path;
        } else {
            updatedFooter.logo = req.body.existingLogo;
        }

        try {
            await Footer.findByIdAndUpdate(id, updatedFooter);
            console.log('Footer Updated', updatedFooter);
            res.redirect('/admin/footer');
        } catch (err) {
            console.error(err);
        }
    };

    deleteFooter = async (req, res) => {
        const id = req.params.id
        const footer = await Footer.findByIdAndDelete(id)
        try {
            console.log('Footer Deleted:', footer);
            res.redirect('/admin/footer')
        } catch (error) {
            console.error();
        }
    }


    getContacts = async (req, res) => {
        try {
            const contacts = await ContactModel.find()
            res.render('Admin/contact', {
                title: 'Get Contacts Page',
                contacts,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    banner = async (req, res) => {
        try {
            const banner = await Banner.find()
            res.render('Admin/banner', {
                title: 'Banner Page',
                banner,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    //post
    create_banner = async (req, res) => {
        try {
            const { title, sub_title, description } = req.body;
            const banner = new Banner({ title, sub_title, description })
            if (req.file) {
                banner.image = req.file.path
            }
            await banner.save()
            console.log('Banner Created', banner);
            res.redirect('/admin/banner')
        } catch (error) {
            console.error();
        }
    }


    update_banner = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, sub_title, description } = req.body;
            const updateData = { title, sub_title, description }
            if (req.file) {
                updateData.image = req.file.path
            }
            const updateBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });

            if (updateBanner) {
                console.log('Banner updated', updateBanner);
                res.redirect('/admin/banner');
            } else {
                console.log('Banner NOT updated');
            }
        } catch (error) {
            console.log(error);
        }
    };


    //delete banner
    delete_banner = async (req, res) => {
        try {
            const id = req.params.id
            const deleted = await Banner.findByIdAndDelete(id)
            res.redirect('/admin/banner')
        } catch (error) {
            console.error();
        }
    }

    feature = async (req, res) => {
        try {
            const features = await Feature.find()
            res.render('Admin/features', {
                title: 'Index Features Page',
                features,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    create_features = async (req, res) => {
        try {
            const { service, appointment_type, description, emergency, em_note } = req.body;
            const hours = new Map();
            hours.set('Sun - Wed', req.body['hours[\'Sun - Wed\']']);
            hours.set('Thu - Fri', req.body['hours[\'Thu - Fri\']']);
            hours.set('Sat - Sun', req.body['hours[\'Sat - Sun\']']);

            const feature = new Feature({ service, appointment_type, description, hours, emergency, em_note });
            await feature.save();
            res.redirect('/admin/features');
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    editFeature = async (req, res) => {
        try {
            const { id } = req.params;
            const { service, appointment_type, description, emergency, em_note } = req.body;
            const hours = new Map();
            hours.set('Sun - Wed', req.body['hours[\'Sun - Wed\']']);
            hours.set('Thu - Fri', req.body['hours[\'Thu - Fri\']']);
            hours.set('Sat - Sun', req.body['hours[\'Sat - Sun\']']);

            const feature = await Feature.findById(id);
            if (!feature) {
                console.log('Feature NOT found!');
            }

            feature.service = service;
            feature.appointment_type = appointment_type;
            feature.description = description;
            feature.hours = hours;
            feature.emergency = emergency;
            feature.em_note = em_note;

            await feature.save();
            res.redirect('/admin/features');
        } catch (error) {
            console.error(error);
        }
    }

    deleteFeature = async (req, res) => {
        try {
            const { id } = req.params;

            const feature = await Feature.findByIdAndDelete(id);
            if (!feature) {
                console.log('Feature NOT found!');;
            }
            res.redirect('/admin/features');
        } catch (error) {
            console.error(error);
        }
    };

    getAboutHome = async (req, res) => {
        try {
            const aboutHome = await AboutIndex.find();
            res.render('Admin/aboutHome', {
                title: 'About Home Page',
                aboutHome,
                admin: req.admin
            });
        } catch (error) {
            console.error(error);
        }
    }

    createAboutSection = async (req, res) => {
        try {
            const { title, description } = req.body;
            const images = req.files.map(file => file.path);
            const newAbout = new AboutIndex({ images, title, description });
            await newAbout.save();
            res.redirect('/admin/about-home');
        } catch (error) {
            console.error(error);
        }
    };

    editAboutSection = async (req, res) => {
        try {
            const id = req.params.id
            const { title, description } = req.body
            const images = req.files.map(file => file.path)
            const editData = await AboutIndex.findByIdAndUpdate(id, { title, description, images }, { new: true })
            console.log('About Section UPDATED', editData);
            res.redirect('/admin/about-home')
        } catch (error) {
            console.error();
        }
    }

    deleteAboutSection = async (req, res) => {
        try {
            const id = req.params.id
            const deleteData = await AboutIndex.findByIdAndDelete(id)
            console.log('About Section Data Deleted', deleteData);
            res.redirect('/admin/about-home')
        } catch (error) {
            console.error();
        }
    }

    care = async (req, res) => {
        try {
            const cares = await Care.find()
            res.render('Admin/care', {
                title: 'Care Page',
                cares,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    create_care = async (req, res) => {
        try {
            const { care, logo, words } = req.body;
            const service = new Care({ care, logo, words })
            await service.save()
            res.redirect('/admin/care')
        } catch (error) {
            console.error();
        }
    }

    update_care = async (req, res) => {
        try {
            const { id } = req.params;
            const { care, logo, words } = req.body;

            const updateService = await Care.findByIdAndUpdate(id, { care, logo, words }, { new: true });

            if (updateService) {
                console.log('Service updated', updateService);
                res.redirect('/admin/care');
            } else {
                console.log('Service NOT updated');
            }
        } catch (error) {
            console.log(error);
        }
    }

    delete_care = async (req, res) => {
        try {
            const id = req.params.id;
            const deleted = await Care.findByIdAndDelete(id)
            res.redirect('/admin/care')
        } catch (error) {
            console.error();
        }
    }

    testimonial = async (req, res) => {
        try {
            const reviews = await Review.find()
            res.render('Admin/testimonial', {
                title: 'Patient Review Page',
                reviews,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    create_testimonial = async (req, res) => {
        try {
            const { person, title, review } = req.body;
            const testimonial = new Review({ person, title, review })
            if (req.file) {
                testimonial.image = req.file.path
            }
            await testimonial.save()
            res.redirect('/admin/patient-review')
        } catch (error) {
            console.error();
        }
    }

    update_testimonial = async (req, res) => {
        try {
            const { person, title, review } = req.body;
            const id = req.params.id;
            const updateData = { person, title, review }
            if (req.file) {
                updateData.image = req.file.path;
            }
            const updatedTestimonial = await Review.findByIdAndUpdate(id, updateData, { new: true })
            console.log('Testimonial UPDATED', updatedTestimonial);
            res.redirect('/admin/patient-review')
        } catch (error) {
            console.error();
        }
    }

    delete_testimonial = async (req, res) => {
        try {
            const id = req.params.id;
            const deleteTestimonial = await Review.findByIdAndDelete(id)
            res.redirect('/admin/patient-review')
        } catch (error) {
            console.error();
        }
    }

    partner = async (req, res) => {
        try {
            const partners = await Partners.find()
            res.render('Admin/partners', {
                title: 'Our Partners Page',
                partners,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createPartner = async (req, res) => {
        try {
            const image = req.file.path
            const newPartner = new Partners({ image })
            await newPartner.save()
            res.redirect('/admin/partner')
        } catch (error) {
            console.error();
        }
    }

    editPartner = async (req, res) => {
        try {
            const id = req.params.id;
            const update = {};

            if (req.file) {
                update.image = req.file.path; // Update image only if a new file is uploaded
            }

            const editedPartner = await Partners.findByIdAndUpdate(id, update, { new: true });
            res.redirect('/admin/partner');
        } catch (error) {
            console.error(error);
        }
    };

    deletePartner = async (req, res) => {
        try {
            const id = req.params.id
            const deletePartner = await Partners.findByIdAndDelete(id)
            res.redirect('/admin/partner')
        } catch (error) {
            console.error();
        }
    }

    getSectionAbout = async (req, res) => {
        try {
            const sectionAbout = await SectionAbout.find();
            res.render('Admin/sectionAbout', {
                title: 'Section About Page',
                sectionAbout,
                admin: req.admin
            });
        } catch (error) {
            console.error(error);
        }
    }

    createSectionAbout = async (req, res) => {
        try {
            const { title, description } = req.body;
            const newSectionAbout = new SectionAbout({ title, description })
            if (req.file) {
                newSectionAbout.image = req.file.path
            }
            await newSectionAbout.save()
            res.redirect('/admin/section-about')
        } catch (error) {
            console.error();
        }
    }

    updateSectionAbout = async (req, res) => {
        try {
            const { title, description } = req.body;
            const id = req.params.id;
            const updatedata = { title, description }
            if (req.file) {
                updatedata.image = req.file.path;
            }
            const updatedSection = await SectionAbout.findByIdAndUpdate(id, updatedata, { new: true })

            console.log('section updated', updatedSection);
            res.redirect('/admin/section-about')
        } catch (error) {
            console.error();
        }
    }

    deleteSectionAbout = async (req, res) => {
        try {
            const id = req.params.id
            const deleteSection = await SectionAbout.findByIdAndDelete(id)
            console.log('Item Deleted', deleteSection);
            res.redirect('/admin/section-about')
        } catch (error) {
            console.error();
        }
    }


    getFeatureAbout = async (req, res) => {
        try {
            const featureAbout = await About.find()
            res.render('Admin/featureAbout', {
                title: 'Feature About Page',
                featureAbout,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createFeatureAbout = async (req, res) => {
        try {
            const { title, description } = req.body;
            const newFeatureAbout = new About({ title, description })
            if (req.file) {
                newFeatureAbout.image = req.file.path
            }
            await newFeatureAbout.save()
            res.redirect('/admin/feature-about')
        } catch (error) {
            console.error();
        }
    }

    editFeatureAbout = async (req, res) => {
        try {
            const { title, description } = req.body;
            const id = req.params.id;

            const updateData = { title, description };

            // Check if a new image file is provided
            if (req.file) {
                updateData.image = req.file.path;
            }

            const updatedFeature = await About.findByIdAndUpdate(id, updateData, { new: true });

            console.log('Feature updated', updatedFeature);
            res.redirect('/admin/feature-about');
        } catch (error) {
            console.error('Error updating feature:', error);
        }
    }


    deleteFeatureAbout = async (req, res) => {
        try {
            const id = req.params.id
            const deleteFeature = await About.findByIdAndDelete(id)
            console.log('Feature Deleted', deleteFeature);
            res.redirect('/admin/feature-about')
        } catch (error) {
            console.error();
        }
    }

    getAwards = async (req, res) => {
        try {
            const awards = await Awards.find()
            res.render('Admin/achievements', {
                title: 'Achievements Page',
                awards,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createAwards = async (req, res) => {
        try {
            const image = req.file.path
            const newAward = new Awards({ image })
            await newAward.save()
            res.redirect('/admin/achievements')
        } catch (error) {
            console.error();
        }
    }

    editAwards = async (req, res) => {
        try {
            const id = req.params.id
            const updateData = {}
            if (req.file) {
                updateData.image = req.file.path
            }
            const updateAchievement = await Awards.findByIdAndUpdate(id, updateData, { new: true })
            console.log('Achievements UPDATED!', updateAchievement);
            res.redirect('/admin/achievements')
        } catch (error) {
            console.error();
        }
    }

    deleteAwards = async (req, res) => {
        try {
            const id = req.params.id
            const deleteData = await Awards.findByIdAndDelete(id)
            console.log('Award DELETED!', deleteData);
            res.redirect('/admin/achievements')
        } catch (error) {
            console.error();
        }
    }


    getSpecialists = async (req, res) => {
        try {
            const doctors = await Doctor.aggregate([
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
            res.render('Admin/specialists', {
                title: 'Specialists Page',
                doctors,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    getSectionTestimonial = async (req, res) => {
        try {
            const testimonial = await Review.find()
            res.render('Admin/sectionTestimonial', {
                title: 'Section Testimonial Page',
                testimonial,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    create_SectionTestimonial = async (req, res) => {
        try {
            const { person, title, review } = req.body;
            const testimonial = new Review({ person, title, review })
            if (req.file) {
                testimonial.image = req.file.path
            }
            await testimonial.save()
            res.redirect('/admin/section-testimonial')
        } catch (error) {
            console.error();
        }
    }

    update_SectionTestimonial = async (req, res) => {
        try {
            const { person, title, review } = req.body;
            const id = req.params.id;
            const updateData = { person, title, review }
            if (req.file) {
                updateData.image = req.file.path;
            }
            const updatedTestimonial = await Review.findByIdAndUpdate(id, updateData, { new: true })
            console.log('Testimonial UPDATED', updatedTestimonial);
            res.redirect('/admin/section-testimonial')
        } catch (error) {
            console.error();
        }
    }

    delete_SectionTestimonial = async (req, res) => {
        try {
            const id = req.params.id;
            const deleteTestimonial = await Review.findByIdAndDelete(id)
            res.redirect('/admin/section-testimonial')
        } catch (error) {
            console.error();
        }
    }


    getServices = async (req, res) => {
        try {
            const services = await Services.find()
            res.render('Admin/services', {
                title: 'Service Page',
                services,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createService = async (req, res) => {
        try {
            const { service, title } = req.body;
            const newService = new Services({ service, title });
            if (req.file) {
                newService.image = req.file.path;
            }
            await newService.save();
            console.log('Service Created:', newService);
            res.redirect('/admin/service');
        } catch (error) {
            console.error("Error creating service:", error);
            res.status(500).send("Server Error");
        }
    }

    editService = async (req, res) => {
        try {
            const id = req.params.id
            const { service, title } = req.body
            const updateData = { service, title }
            if (req.file) {
                updateData.image = req.file.path;
            }
            const updateService = await Services.findByIdAndUpdate(id, updateData, { new: true })
            await updateService.save()
            console.log('Services Updated:', updateService);
            res.redirect('/admin/service')
        } catch (error) {
            console.error();
        }
    }

    deleteService = async (req, res) => {
        try {
            const id = req.params.id
            const deleteData = await Services.findByIdAndDelete(id)
            console.log('Services Deleted:', deleteData);
            res.redirect('/admin/service')
        } catch (error) {
            console.error();
        }
    }

    getSectionCta = async (req, res) => {
        try {
            const cta = await Cta.find()
            res.render('Admin/cta', {
                title: 'Section Cta Page',
                cta,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createCta = async (req, res) => {
        try {
            const { title } = req.body;
            const newCta = new Cta({ title });
            if (req.file) {
                newCta.image = req.file.path;
            }
            await newCta.save();
            console.log('Cta Created:', newCta);
            res.redirect('/admin/cta');
        } catch (error) {
            console.error("Error creating Cta:", error);
        }
    }

    editCta = async (req, res) => {
        try {
            const id = req.params.id
            const { title } = req.body
            const updateData = { title }
            if (req.file) {
                updateData.image = req.file.path;
            }
            const updateCta = await Cta.findByIdAndUpdate(id, updateData, { new: true })
            await updateCta.save()
            console.log('Cta Updated:', updateCta);
            res.redirect('/admin/cta')
        } catch (error) {
            console.error();
        }
    }

    deleteCta = async (req, res) => {
        try {
            const id = req.params.id
            const deleteData = await Cta.findByIdAndDelete(id)
            console.log('Cta Deleted:', deleteData);
            res.redirect('/admin/cta')
        } catch (error) {
            console.error();
        }
    }


    getDepartments = async (req, res) => {
        const departments = await Department.find()
        try {
            res.render('Admin/departments', {
                title: 'Departments Page',
                departments,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createDepartment = async (req, res) => {
        const { department, title, description, details, mondayToFriday, saturday, sunday, contactNumber, features } = req.body;
        const image = req.file.path;

        const newDepartment = new Department({
            department,
            title,
            description,
            image,
            details,
            timings: {
                mondayToFriday,
                saturday,
                sunday,
                contactNumber
            },
            services: {
                features: features.split(',')
            }
        });

        try {
            await newDepartment.save();
            res.redirect('/admin/departments');
        } catch (error) {
            console.error(error);
        }
    };

    editDepartment = async (req, res) => {
        const { department, title, description, details, mondayToFriday, saturday, sunday, contactNumber, features } = req.body;
        const departmentId = req.params.id;

        const updateData = {
            department,
            title,
            description,
            details,
            timings: {
                mondayToFriday,
                saturday,
                sunday,
                contactNumber
            },
            services: {
                features: features.split(',')
            }
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        try {
            await Department.findByIdAndUpdate(departmentId, updateData, { new: true });
            res.redirect('/admin/departments');
        } catch (error) {
            console.error(error);
        }
    };

    deleteDepartment = async (req, res) => {
        const departmentId = req.params.id;

        try {
            await Department.findByIdAndDelete(departmentId);
            res.redirect('/admin/departments');
        } catch (error) {
            console.error(error);
        }
    };

    getDoctors = async (req, res) => {
        const doctors = await Doctor.aggregate([
            {
                $lookup: {
                    from: "departments",
                    localField: "department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: "$department"
            }
        ]);
        const departments = await Department.find()
        try {
            res.render('Admin/doctors', {
                title: 'Doctors Page',
                doctors,
                departments,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createDoctor = async (req, res) => {
        const {
            name,
            department,
            description,
            skillsDescription,
            mondayToFriday,
            saturday,
            sunday,
            contactNumber,
            expertise
        } = req.body;

        const qualifications = [];
        req.body.qualificationTitle.forEach((title, index) => {
            qualifications.push({
                title,
                year: req.body.qualificationYear[index],
                description: req.body.qualificationDescription[index]
            });
        });

        const expertiseArray = expertise.split(',').map(item => item.trim());

        const appointment = {
            mondayToFriday,
            saturday,
            sunday,
            contactNumber
        };

        const image = req.file ? req.file.path : '';

        try {
            const newDoctor = new Doctor({
                name,
                department,
                description,
                qualifications,
                skills: { description: skillsDescription, expertise: expertiseArray },
                appointment,
                image
            });

            await newDoctor.save();
            res.redirect('/admin/doctors');
        } catch (error) {
            console.error(error);
        }
    };

    editDoctor = async (req, res) => {
        const {
            name,
            department,
            description,
            skillsDescription,
            mondayToFriday,
            saturday,
            sunday,
            contactNumber,
            expertise
        } = req.body;

        const qualifications = [];
        if (req.body.qualificationTitleEdit) {
            req.body.qualificationTitleEdit.forEach((title, index) => {
                qualifications.push({
                    title,
                    year: req.body.qualificationYearEdit[index],
                    description: req.body.qualificationDescriptionEdit[index]
                });
            });
        }

        const expertiseArray = expertise.split(',').map(item => item.trim());

        const appointment = {
            mondayToFriday,
            saturday,
            sunday,
            contactNumber
        };

        const image = req.file ? req.file.path : '';

        try {
            const doctor = await Doctor.findById(req.params.id);

            doctor.name = name;
            doctor.department = department;
            doctor.description = description;
            doctor.qualifications = qualifications;
            doctor.skills = { description: skillsDescription, expertise: expertiseArray };
            doctor.appointment = appointment;
            if (image) {
                doctor.image = image;
            }

            await doctor.save();
            res.redirect('/admin/doctors');
        } catch (error) {
            console.error(error);
        }
    };

    deleteDoctor = async (req, res) => {
        try {
            await Doctor.findByIdAndDelete(req.params.id);

            res.redirect('/admin/doctors');
        } catch (error) {
            console.error(error);
        }
    };

    getAllBlogs = async (req, res) => {
        try {
            const blogs = await Blog.aggregate([
                {
                    $lookup: {
                        from: "categories", // The name of the category collection
                        localField: "category", // The field in the blog documents
                        foreignField: "_id", // The field in the category documents
                        as: "category"
                    }
                },
                {
                    $unwind: "$category" // Unwind the array to denormalize the data
                }
            ]);
            const categories = await BlogCategory.find()
            res.render('Admin/blog', {
                title: 'All Blogs',
                blogs,
                categories,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createBlog = async (req, res) => {
        try {
            const { title, author, excerpt, content, date, category } = req.body;
            const image = req.file.path;

            const newBlog = new Blog({
                title,
                author,
                excerpt,
                content,
                date,
                category,
                image
            });

            await newBlog.save();
            await BlogCategory.findByIdAndUpdate(newBlog.category, { $inc: { postCount: 1 } });
            res.redirect('/admin/AllBlogs');
        } catch (error) {
            console.error(error);
        }
    };

    updateBlog = async (req, res) => {
        try {
            const { title, author, excerpt, content, date, category, views } = req.body;
            const image = req.file ? req.file.path : req.body.oldImage;

            const blogId = req.params.id;

            const updatedBlog = {
                title,
                author,
                excerpt,
                content,
                date,
                category,
                views
            };

            if (image) {
                updatedBlog.image = image;
            }

            await Blog.findByIdAndUpdate(blogId, updatedBlog);
            res.redirect('/admin/AllBlogs');
        } catch (error) {
            console.error(error);
        }
    };


    deleteBlog = async (req, res) => {
        try {
            const id = req.params.id;
            const deleteBlog = await Blog.findByIdAndDelete(id)
            await BlogCategory.findByIdAndUpdate(deleteBlog.category, { $inc: { postCount: -1 } })
            res.redirect('/admin/AllBlogs')
        } catch (error) {
            console.error();
        }
    }

    activeBlog = async (req, res) => {
        try {
            const result = await Blog.findByIdAndUpdate(req.params.id, { status: true })
            if (result) {
                console.log('Blog activated');
                res.redirect('back')
            }
        } catch (error) {
            console.log(error);
        }
    }

    deactiveBlog = async (req, res) => {
        try {
            const result = await Blog.findByIdAndUpdate(req.params.id, { status: false })
            if (result) {
                console.log('Blog deactivated');
                res.redirect('back')
            }
        } catch (error) {
            console.log(error);
        }
    }

    getComments = async (req, res) => {
        const comments = await Comment.aggregate([
            {
                $lookup: {
                    from: "blogs", // The name of the blog collection
                    localField: "blog", // The field in the Comment documents
                    foreignField: "_id", // The field in the blog documents
                    as: "blog"
                }
            },
            {
                $unwind: "$blog" // Unwind the array to denormalize the data
            }
        ])
        try {
            res.render('Admin/comments', {
                title: 'Comments Page',
                comments,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    deleteComment = async (req, res) => {
        const { id } = req.params
        const deleteData = await Comment.findByIdAndDelete(id)
        try {
            console.log('Comment Deleted', deleteData);
            res.redirect('/admin/comments')
        } catch (error) {
            console.error();
        }
    }

    replyToComment = async (req, res) => {
        try {
            const { id } = req.params;
            const { replyContent } = req.body;

            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            const reply = {
                content: replyContent,
                date: new Date()
            };

            comment.replies.push(reply);
            await comment.save();

            res.redirect('back');
        } catch (err) {
            console.error(err);
        }
    };

    deleteReply = async (req, res) => {
        try {
            const { commentId, replyId } = req.params;

            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            // Filter out the reply to be deleted
            comment.replies = comment.replies.filter(reply => reply._id.toString() !== replyId);
            await comment.save();

            res.redirect('back');
        } catch (err) {
            console.error(err);
        }
    };

    getHospitalContact = async (req, res) => {
        const contactInfo = await ContactInfo.find()
        try {
            res.render('Admin/hospitalContact', {
                title: 'Hospital Contact Page',
                contactInfo,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createHospitalContact = async (req, res) => {
        const { phone, email, address } = req.body
        try {
            const newContact = new ContactInfo({
                phone, email, address
            })
            await newContact.save()
            res.redirect('back')
        } catch (error) {
            console.error();
        }
    }

    editHospitalContact = async (req, res) => {
        const { id } = req.params
        const { phone, email, address } = req.body
        const updateData = { phone, email, address }
        try {
            const updateContact = await ContactInfo.findByIdAndUpdate(id, updateData, { new: true })
            console.log('Hospital Contact Updated:', updateContact);
            res.redirect('back')
        } catch (error) {
            console.error();
        }
    }

    deleteHospitalContact = async (req, res) => {
        const { id } = req.params
        try {
            const deleteContact = await ContactInfo.findByIdAndDelete(id)
            console.log('Hospital Contact Deleted:', deleteContact);
            res.redirect('back')
        } catch (error) {
            console.error();
        }
    }

    getTitlePage = async (req, res) => {
        const titleData = await Title.find()
        try {
            res.render('Admin/title', {
                title: 'Title Section Page',
                titleData,
                admin: req.admin
            })
        } catch (error) {
            console.error();
        }
    }

    createTitleSection = async (req, res) => {
        const { title, subtitle } = req.body
        try {
            const createTitle = new Title({ title, subtitle })
            if (req.file) {
                createTitle.image = req.file.path
            }
            await createTitle.save()
            res.redirect('back')
        } catch (error) {
            console.error();
        }
    }

    editTitleSection = async (req, res) => {
        const { id } = req.params
        const { title, subtitle } = req.body
        const editData = { title, subtitle }
        if (req.file) {
            editData.image = req.file.path
        }
        try {
            const updateTitle = await Title.findByIdAndUpdate(id, editData, { new: true })
            console.log('Title updated', updateTitle);
            res.redirect('back')
        } catch (error) {
            console.error();
        }
    }

    deleteTitleSection = async (req, res) => {
        const { id } = req.params
        try {
            const deleteTitle = await Title.findByIdAndDelete(id)
            console.log('Title Section Deleted', deleteTitle);
            res.redirect('back')
        } catch (error) {
            console.error();
        }
    }

}


module.exports = new AdminController()