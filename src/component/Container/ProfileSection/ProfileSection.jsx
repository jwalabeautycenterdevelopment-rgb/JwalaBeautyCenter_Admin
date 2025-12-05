import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearMessage,
    clearError,
    fetchMe,
    updateAdminProfile,
} from "../../../store/slice/authme";
import { successAlert, errorAlert } from "../../../utils/alertService";

const Profile = () => {
    const dispatch = useDispatch();
    const IMG_URL = import.meta.env.VITE_API_URL_BASE_IMAGE_URL;
    const { adminData, message, error, updateLoading } = useSelector(
        (state) => state.authme
    );

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        photo: "",
    });
    const [photoFile, setPhotoFile] = useState(null);

    useEffect(() => {
        if (!adminData) return;

        setProfile({
            firstName: adminData?.firstName || "",
            lastName: adminData?.lastName || "",
            email: adminData?.email || "",
            photo: adminData?.profilePhoto || "",
        });

        setPhotoFile(null);
    }, [adminData]);

    useEffect(() => {
        if (message) {
            successAlert(message);
            dispatch(clearMessage());
        }

        if (error) {
            errorAlert(error);
            dispatch(clearError());
        }
    }, [message, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) setPhotoFile(file);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append("firstName", profile.firstName);
        formData.append("lastName", profile.lastName);
        if (photoFile) formData.append("profilePhoto", photoFile);

        dispatch(updateAdminProfile(formData));
    };

    return (
        <div className="p-4 sm:p-6 lg:px-18 mx-auto bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Profile</h2>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="relative">
                    <img
                        src={
                            photoFile
                                ? URL.createObjectURL(photoFile)
                                : profile?.photo
                                    ? IMG_URL + profile.photo
                                    : "/default-avatar.png" 
                        }

                        alt="Profile"
                        className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-gray-300"
                    />

                    <label
                        htmlFor="photoUpload"
                        className="absolute bottom-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded cursor-pointer"
                    >
                        Edit
                    </label>

                    <input
                        id="photoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={profile?.firstName}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={profile?.lastName}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email (not editable)
                        </label>
                        <input
                            type="email"
                            value={profile?.email}
                            readOnly
                            className="w-full border-b border-gray-300 py-2 bg-gray-100 cursor-not-allowed text-gray-500"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={updateLoading}
                    className="bg-pink-400 text-white px-5 py-2 rounded-md text-sm hover:bg-pink-700 cursor-pointer disabled:opacity-50"
                >
                    {updateLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default Profile;
