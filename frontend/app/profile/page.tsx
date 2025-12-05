'use client'

import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import Loading from '@/components/ui/Loading'
import { User, Mail, Shield, Save } from 'lucide-react'

export default function ProfilePage() {
    const { data: profile, isLoading, error } = useProfile()
    const updateProfile = useUpdateProfile()
    const toast = useToast()

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name,
                email: profile.email,
                // role is usually read-only
            })
        }
    }, [profile, reset])

    const onSubmit = (data: any) => {
        updateProfile.mutate(data, {
            onSuccess: () => {
                toast.success('Profile updated successfully')
            },
            onError: (err: any) => {
                toast.error(err.message || 'Failed to update profile')
            },
        })
    }

    if (isLoading) return <Loading />
    if (error) return <div className="text-center text-red-500 mt-10">Failed to load profile</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <User className="w-8 h-8 text-cyan-400" />
                    Profile Settings
                </h1>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-xl">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name
                            </label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            />
                            {errors.name && <span className="text-red-400 text-sm">{errors.name.message as string}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            />
                            {errors.email && <span className="text-red-400 text-sm">{errors.email.message as string}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Role
                            </label>
                            <input
                                value={profile?.role || 'User'}
                                disabled
                                className="w-full bg-gray-900/30 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">Role cannot be changed directly.</p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={updateProfile.isPending}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {updateProfile.isPending ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
