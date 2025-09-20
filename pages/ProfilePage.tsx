import React, { useState, useContext, ChangeEvent, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { User as UserIcon, AtSign, Phone, Lock, Camera, Save, CheckCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);
    const [infoSuccessMessage, setInfoSuccessMessage] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

    if (!user) {
        return <div>Loading user profile...</div>;
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInfoSubmit = (e: FormEvent) => {
        e.preventDefault();
        const updatedData: { name: string, phone: string, profilePicture?: string } = { name, phone };
        if (profilePicture) {
            updatedData.profilePicture = profilePicture;
        }
        updateUser(updatedData);
        setInfoSuccessMessage('Profile updated successfully!');
        setTimeout(() => setInfoSuccessMessage(''), 3000);
    };

    const handlePasswordChange = (e: FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (!newPassword || newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long.");
            return;
        }
        // In a real app, you'd verify the current password against a backend.
        // For this demo, we'll use the default password.
        if (currentPassword !== 'password123') {
            setPasswordError("Your old password is not correct.");
            return;
        }

        // On success:
        setPasswordSuccessMessage("Password changed successfully!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccessMessage(''), 4000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Profile Settings</h1>
            
            {/* Profile Information Card */}
            <form onSubmit={handleInfoSubmit} className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-slate-700 mb-6">Personal Information</h2>

                <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                        <img 
                            src={profilePicture || `https://ui-avatars.com/api/?name=${name || 'E'}&background=c7d2fe&color=4338ca&size=128`} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover" 
                        />
                        <label htmlFor="profile-picture-upload" className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                            <Camera className="w-5 h-5" />
                            <input id="profile-picture-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                    <div>
                         <h3 className="text-2xl font-bold text-slate-800">{name || 'Evaluator'}</h3>
                         <p className="text-slate-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="full-name" className="block text-sm font-medium text-slate-700">Full Name</label>
                         <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="text" id="full-name" value={name} onChange={e => setName(e.target.value)} className="block w-full pl-10 pr-3 py-2 border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your Name" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                         <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <AtSign className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="email" id="email" value={user.email} disabled className="block w-full pl-10 pr-3 py-2 border-slate-300 rounded-md bg-slate-100 cursor-not-allowed" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="phone-number" className="block text-sm font-medium text-slate-700">Phone Number</label>
                         <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="tel" id="phone-number" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full pl-10 pr-3 py-2 border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., +1 234 567 890"/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center space-x-4 mt-8">
                    {infoSuccessMessage && <p className="text-sm text-green-600">{infoSuccessMessage}</p>}
                    <button
                        type="submit"
                        className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </form>

             {/* Security Card */}
            <form onSubmit={handlePasswordChange} className="bg-white p-8 rounded-lg shadow-lg">
                 <h2 className="text-xl font-semibold text-slate-700 mb-6">Change Password</h2>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-slate-700">Old Password</label>
                         <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="password" id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your old password"/>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">New Password</label>
                         <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your new password"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                         <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="block w-full pl-10 pr-3 py-2 border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="Confirm your new password"/>
                        </div>
                    </div>
                 </div>
                 <div className="flex justify-end items-center space-x-4 mt-8">
                    {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                    {passwordSuccessMessage && (
                        <div className="text-sm text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1"/> 
                            <div>
                                {passwordSuccessMessage}
                                <p className="text-xs text-slate-500 italic">(Demo only: login password remains 'password123')</p>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;