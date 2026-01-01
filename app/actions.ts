'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import {
    sendContactNotification,
    sendQuoteNotification,
    sendApplicationConfirmation,
    sendHRNotification,
} from '@/lib/email'

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    company: z.string().optional(),
    phone: z.string().optional(),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
})

const quoteSchema = z.object({
    service_area: z.string().min(1, 'Service area is required'),
    full_name: z.string().min(1, 'Name is required'),
    company_name: z.string().optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    project_requirements: z.string().optional(),
})

const applicationSchema = z.object({
    job_id: z.string().min(1, 'Job ID is required'),
    job_title: z.string().min(1, 'Job title is required'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    current_position: z.string().optional(),
    resume_url: z.string().url('Invalid resume URL'),
    cover_letter: z.string().optional(),
})

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    }

    const validatedFields = contactSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: 'Invalid form data' }
    }

    const { error } = await supabase.from('contact_submissions').insert({
        full_name: validatedFields.data.name,
        email: validatedFields.data.email,
        company: validatedFields.data.company,
        phone: validatedFields.data.phone,
        subject: validatedFields.data.subject,
        message: validatedFields.data.message,
    })

    if (error) {
        console.error('Error submitting contact form:', error)
        return { error: 'Failed to submit form' }
    }

    // Send email notification to admin
    try {
        await sendContactNotification({
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            company: validatedFields.data.company,
            subject: validatedFields.data.subject,
            message: validatedFields.data.message,
        })
    } catch (emailError) {
        console.error('Error sending contact notification email:', emailError)
        // Don't fail the submission if email fails
    }

    return { success: true }
}

export async function submitQuoteForm(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        service_area: formData.get('service_area'),
        full_name: formData.get('full_name'),
        company_name: formData.get('company_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        project_requirements: formData.get('project_requirements'),
    }

    const validatedFields = quoteSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: 'Invalid form data' }
    }

    const { error } = await supabase.from('quote_submissions').insert({
        service_area: validatedFields.data.service_area,
        full_name: validatedFields.data.full_name,
        company_name: validatedFields.data.company_name,
        email: validatedFields.data.email,
        phone: validatedFields.data.phone,
        project_requirements: validatedFields.data.project_requirements,
    })

    if (error) {
        console.error('Error submitting quote form:', error)
        return { error: 'Failed to submit quote request' }
    }

    // Send email notification to admin
    try {
        await sendQuoteNotification({
            name: validatedFields.data.full_name,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            company: validatedFields.data.company_name,
            serviceArea: validatedFields.data.service_area,
            requirements: validatedFields.data.project_requirements,
        })
    } catch (emailError) {
        console.error('Error sending quote notification email:', emailError)
        // Don't fail the submission if email fails
    }

    return { success: true }
}

export async function submitApplication(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        job_id: formData.get('job_id'),
        job_title: formData.get('job_title'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        current_position: formData.get('current_position'),
        resume_url: formData.get('resume_url'),
        cover_letter: formData.get('cover_letter'),
    }

    const validatedFields = applicationSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error('Validation errors:', validatedFields.error.flatten())
        return { error: 'Invalid form data. Please check all required fields.' }
    }

    const fullName = `${validatedFields.data.first_name} ${validatedFields.data.last_name}`

    try {
        // First, check if the user already has a profile
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', validatedFields.data.email)
            .single()

        let applicantId = existingProfile?.id

        // If no profile exists, create a new one (for guest applicants)
        // Note: For authenticated users, profile would already exist
        if (!applicantId) {
            // For guest submissions, we'll use the auth.users approach or store without profile
            // Since we don't have auth here, we'll create the application with minimal data
            // In production, you'd want proper auth flow for applicants
        }

        // Insert the application
        const { data: application, error: appError } = await supabase
            .from('applications')
            .insert({
                job_id: validatedFields.data.job_id,
                applicant_id: applicantId || null,
                status: 'submitted',
                resume_url: validatedFields.data.resume_url,
                cover_letter: validatedFields.data.cover_letter,
                phone: validatedFields.data.phone,
                current_position: validatedFields.data.current_position,
            })
            .select()
            .single()

        if (appError) {
            console.error('Error creating application:', appError)
            return { error: 'Failed to submit application. Please try again.' }
        }

        // Send confirmation email to applicant
        try {
            await sendApplicationConfirmation(
                validatedFields.data.email,
                fullName,
                validatedFields.data.job_title
            )
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError)
        }

        // Send notification email to HR
        try {
            await sendHRNotification({
                applicantName: fullName,
                applicantEmail: validatedFields.data.email,
                applicantPhone: validatedFields.data.phone,
                jobTitle: validatedFields.data.job_title,
                resumeUrl: validatedFields.data.resume_url,
                coverLetter: validatedFields.data.cover_letter,
                currentPosition: validatedFields.data.current_position,
            })
        } catch (emailError) {
            console.error('Error sending HR notification email:', emailError)
        }

        return {
            success: true,
            applicationId: application.id,
        }
    } catch (error) {
        console.error('Application submission error:', error)
        return { error: 'An unexpected error occurred. Please try again.' }
    }
}

export async function updateApplicationStatus(
    applicationId: string,
    newStatus: string,
    message?: string
) {
    const supabase = await createClient()

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
        return { error: 'Unauthorized' }
    }

    // Update the application
    const { error } = await supabase
        .from('applications')
        .update({
            status: newStatus,
            reviewed_by: user.user.id,
            reviewed_at: new Date().toISOString(),
            notes: message,
        })
        .eq('id', applicationId)

    if (error) {
        console.error('Error updating application status:', error)
        return { error: 'Failed to update application status' }
    }

    return { success: true }
}
