const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create SubSection

exports.createSubSection = async (req, res) => {
    try{
        //fecth data from Req body
        const {sectionId, title, timeDuration, description} = req.body;

        //extract file/video
        const video  = req.files.videoFile;

        //validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //create a sub-section
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })

        //update section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                    {$push:{
                                                        subSection:subSectionDetails._id,
                                                    }},
                                                    {new:true});
                                                    
        // log updated section here, after adding populate query
        //return response
        return res.status(200).json({
            succcess:true,
            message:'Sub Section Created Successfully',
            updatedSection,
        });
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
};

// updateSubSection

// deleteSubSection