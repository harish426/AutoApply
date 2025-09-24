import React, { useState } from 'react';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        address: {
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
        requireVisaSponsorship: 'No',
        presentVisaStatus: '',
        disabilityStatus: 'No',
        veteranStatus: 'No',
        isHispanic: 'No',
        willingToRelocate: 'No',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setProfileData(prev => ({ 
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setProfileData({ ...profileData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/profile/${profileData.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Profile updated successfully:', data);
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        }
    };


    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Your Profile</h2>
                <p style={styles.subtitle}>This information helps us tailor your job search experience.</p>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>First Name</label>
                        <input type="text" name="firstName" value={profileData.firstName} onChange={handleChange} style={styles.input} placeholder="e.g., John" />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Last Name</label>
                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleChange} style={styles.input} placeholder="e.g., Doe" />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input type="email" name="email" value={profileData.email} onChange={handleChange} style={styles.input} placeholder="e.g., john.doe@example.com"/>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleChange} style={styles.input} />
                    </div>
                    
                    <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                        <label style={styles.label}>Address</label>
                        <input type="text" name="address.street1" value={profileData.address.street1} onChange={handleChange} style={{...styles.input, marginBottom: '1rem'}} placeholder="Street 1"/>
                        <input type="text" name="address.street2" value={profileData.address.street2} onChange={handleChange} style={{...styles.input, marginBottom: '1rem'}} placeholder="Street 2 (Optional)"/>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                            <input type="text" name="address.city" value={profileData.address.city} onChange={handleChange} style={styles.input} placeholder="City"/>
                            <input type="text" name="address.state" value={profileData.address.state} onChange={handleChange} style={styles.input} placeholder="State"/>
                        </div>
                         <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem'}}>
                            <input type="text" name="address.zip" value={profileData.address.zip} onChange={handleChange} style={styles.input} placeholder="Zip Code"/>
                            <input type="text" name="address.country" value={profileData.address.country} onChange={handleChange} style={styles.input} placeholder="Country"/>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Require Visa Sponsorship?</label>
                        <select name="requireVisaSponsorship" value={profileData.requireVisaSponsorship} onChange={handleChange} style={styles.select}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Present Visa Status</label>
                        <input type="text" name="presentVisaStatus" value={profileData.presentVisaStatus} onChange={handleChange} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Disability Status</label>
                        <select name="disabilityStatus" value={profileData.disabilityStatus} onChange={handleChange} style={styles.select}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Veteran Status</label>
                        <select name="veteranStatus" value={profileData.veteranStatus} onChange={handleChange} style={styles.select}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Are you Hispanic or Latino?</label>
                        <select name="isHispanic" value={profileData.isHispanic} onChange={handleChange} style={styles.select}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Willing to Relocate?</label>
                        <select name="willingToRelocate" value={profileData.willingToRelocate} onChange={handleChange} style={styles.select}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>    
                <button type="submit" style={styles.button}>Save Profile</button>
            </form>
        </div>
    );
};

const styles = {
    container: { 
        padding: '2rem', 
        backgroundColor: '#f4f7f6', 
        borderRadius: '12px',
        maxWidth: '900px',
        margin: '2rem auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid #e6e6e6',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    title: {
        color: '#2c3e50',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: '#7f8c8d',
        fontSize: '1.1rem',
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column' 
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
    },
    formGroup: { 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    label: { 
        marginBottom: '0.75rem', 
        fontWeight: '600', 
        color: '#34495e',
        fontSize: '0.9rem',
    },
    input: {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #bdc3c7',
        fontSize: '1rem',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    select: {
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #bdc3c7',
        fontSize: '1rem',
        backgroundColor: '#fff',
        cursor: 'pointer',
    },
    button: { 
        padding: '1rem 2rem',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(45deg, #3498db, #2980b9)',
        color: 'white',
        cursor: 'pointer',
        marginTop: '2.5rem',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
};

export default Profile;
