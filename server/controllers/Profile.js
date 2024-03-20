const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
  try {
      // extract data
      const { gender = '', dateOfBirth = "", about = "", contactNumber = '', firstName, lastName } = req.body;

      // extract userId
      const userId = req.user.id;


      // find profile
      const userDetails = await User.findById(userId);
      const profileId = userDetails.additionalDetails;
      const profileDetails = await Profile.findById(profileId);

      // console.log('User profileDetails -> ', profileDetails);

      // Update the profile fields
      userDetails.firstName = firstName;
      userDetails.lastName = lastName;
      await userDetails.save()

      profileDetails.gender = gender;
      profileDetails.dateOfBirth = dateOfBirth;
      profileDetails.about = about;
      profileDetails.contactNumber = contactNumber;

      // save data to DB
      await profileDetails.save();

      const updatedUserDetails = await User.findById(userId)
          .populate({
              path: 'additionalDetails'
          })
      // console.log('updatedUserDetails -> ', updatedUserDetails);

      // return response
      res.status(200).json({
          success: true,
          updatedUserDetails,
          message: 'Profile updated successfully'
      });
  }
  catch (error) {
      console.log('Error while updating profile');
      console.log(error);
      res.status(500).json({
          success: false,
          error: error.message,
          message: 'Error while updating profile'
      })
  }
} 


//deleteAccount
//TODO -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try{
        //get id 
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        } 

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //TOOD: unenroll user form all enrolled courses
        //delete user
        await User.findByIdAndDelete({_id:id});
       
        //return response
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully',
        })

    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        });
    }
};


exports.getAllUserDetails = async (req, res) => {

    try {
        //get id
        const id = req.user.id;

        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success:true,
            message:'User Data Fetched Successfully',
            data: userDetails,
        });
       
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req?.files?.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image?.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};