'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '',
    cellPhone: '', homePhone: '', workPhone: '',
    linkedIn: '',
    address: {
      country: '', addressLine1: '', addressLine2: '',
      city: '', state: '', zipCode: '',
    },
    hearAboutUs: '',
    authorizedToWorkInUS: false,
    requireVisaSponsorship: false,
    ethnicity: '', veteranStatus: '', disabilities: '',
  });

  const [experiences, setExperiences] = useState([{ title: '', company: '', startDate: '', endDate: '' }]);
  const [educations, setEducations] = useState([{ school: '', degree: '', field: '', startDate: '', endDate: '' }]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [certificationLinks, setCertificationLinks] = useState<string[]>(['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;
        setForm(data);
        setExperiences(data.experiences || []);
        setEducations(data.educations || []);
        setCertificationLinks(data.certifications || []);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name.startsWith('address.')) {
      const addrField = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addrField]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckbox = (e: any) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.ethnicity) newErrors.ethnicity = 'Ethnicity is required';
    if (!form.veteranStatus) newErrors.veteranStatus = 'Veteran status is required';
    if (!form.disabilities) newErrors.disabilities = 'Disability status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    // Experience handlers
    const addExperience = () => setExperiences([...experiences, { title: '', company: '', startDate: '', endDate: '' }]);
    const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
    const handleExperienceChange = (i: number, e: any) => {
      const newData = [...experiences];
      newData[i][e.target.name] = e.target.value;
      setExperiences(newData);
    };
  
    // Education handlers
    const addEducation = () => setEducations([...educations, { school: '', degree: '', field: '', startDate: '', endDate: '' }]);
    const removeEducation = (i: number) => setEducations(educations.filter((_, idx) => idx !== i));
    const handleEducationChange = (i: number, e: any) => {
      const newData = [...educations];
      newData[i][e.target.name] = e.target.value;
      setEducations(newData);
    };

      // Certification handlers
  const handleCertChange = (i: number, e: any) => {
    const newCerts = [...certificationLinks];
    newCerts[i] = e.target.value;
    setCertificationLinks(newCerts);
  };

  const addCert = () => setCertificationLinks([...certificationLinks, '']);
  const removeCert = (i: number) => setCertificationLinks(certificationLinks.filter((_, idx) => idx !== i));


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('profile', JSON.stringify({
      ...form,
      experiences,
      educations,
      certifications: certificationLinks,
    }));
    if (resumeFile) formData.append('resume', resumeFile);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) alert('Profile saved successfully!');
      else alert('Failed to save profile');
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Setup Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="firstName" placeholder="First Name" required onChange={handleChange} className="input" />
          <input name="middleName" placeholder="Middle Name" onChange={handleChange} className="input" />
          <input name="lastName" placeholder="Last Name" required onChange={handleChange} className="input" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="cellPhone" placeholder="Cell Phone" onChange={handleChange} className="input" />
          <input name="homePhone" placeholder="Home Phone" onChange={handleChange} className="input" />
          <input name="workPhone" placeholder="Work Phone" onChange={handleChange} className="input" />
        </div>

        <input name="linkedIn" placeholder="LinkedIn URL" onChange={handleChange} className="input w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="address.country" placeholder="Country" onChange={handleChange} className="input" />
          <input name="address.addressLine1" placeholder="Address Line 1" onChange={handleChange} className="input" />
          <input name="address.addressLine2" placeholder="Address Line 2" onChange={handleChange} className="input" />
          <input name="address.city" placeholder="City" onChange={handleChange} className="input" />
          <input name="address.state" placeholder="State" onChange={handleChange} className="input" />
          <input name="address.zipCode" placeholder="Zip Code" onChange={handleChange} className="input" />
        </div>

        <input name="hearAboutUs" placeholder="How did you hear about us?" onChange={handleChange} className="input w-full" />

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="authorizedToWorkInUS" onChange={handleCheckbox} />
            <span>Authorized to work in the US</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="requireVisaSponsorship" onChange={handleCheckbox} />
            <span>Require Visa Sponsorship</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="ethnicity" onChange={handleChange} className="input" required>
            <option value="">Select Ethnicity</option>
            <option value="Hispanic or Latino">Hispanic or Latino</option>
            <option value="White (Not Hispanic or Latino)">White (Not Hispanic or Latino)</option>
            <option value="Black or African American (Not Hispanic or Latino)">Black or African American (Not Hispanic or Latino)</option>
            <option value="Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)">Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)</option>
            <option value="Asian (Not Hispanic or Latino)">Asian (Not Hispanic or Latino)</option>
            <option value="American Indian or Alaska Native (Not Hispanic or Latino)">American Indian or Alaska Native (Not Hispanic or Latino)</option>
            <option value="Two or More Races (Not Hispanic or Latino)">Two or More Races (Not Hispanic or Latino)</option>
            <option value="I do not wish to answer">I do not wish to answer</option>
          </select>
          <select name="veteranStatus" onChange={handleChange} className="input" required>
            <option value="">Select Veteran Status</option>
            <option value="I identify as one or more of the classifications of a protected veteran">I identify as one or more of the classifications of a protected veteran</option>
            <option value="I am not a protected veteran">I am not a protected veteran</option>
            <option value="I do not wish to answer">I do not wish to answer</option>
          </select>
          <select name="disabilities" onChange={handleChange} className="input" required>
            <option value="">Select Disability Status</option>
            <option value="Yes, I have a disability (or previously had a disability)">Yes, I have a disability (or previously had a disability)</option>
            <option value="No, I do not have a disability">No, I do not have a disability</option>
            <option value="I do not wish to answer">I do not wish to answer</option>
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Experience</h2>
          {experiences.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input name="title" placeholder="Title" value={exp.title} onChange={(e) => handleExperienceChange(i, e)} className="input" />
              <input name="company" placeholder="Company" value={exp.company} onChange={(e) => handleExperienceChange(i, e)} className="input" />
              <input type="date" name="startDate" value={exp.startDate} onChange={(e) => handleExperienceChange(i, e)} className="input" />
              <input type="date" name="endDate" value={exp.endDate} onChange={(e) => handleExperienceChange(i, e)} className="input" />
              <button type="button" onClick={() => removeExperience(i)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addExperience} className="text-blue-600 mt-2">+ Add Experience</button>
        </div>

        {/* Education */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Education</h2>
          {educations.map((edu, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input name="school" placeholder="School" value={edu.school} onChange={(e) => handleEducationChange(i, e)} className="input" />
              <input name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(i, e)} className="input" />
              <input name="field" placeholder="Field" value={edu.field} onChange={(e) => handleEducationChange(i, e)} className="input" />
              <input type="date" name="startDate" value={edu.startDate} onChange={(e) => handleEducationChange(i, e)} className="input" />
              <input type="date" name="endDate" value={edu.endDate} onChange={(e) => handleEducationChange(i, e)} className="input" />
              <button type="button" onClick={() => removeEducation(i)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addEducation} className="text-blue-600 mt-2">+ Add Education</button>
        </div>

        {/* Resume + Certs */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Resume</h2>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Certifications</h2>
          {certificationLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="url" value={link} placeholder="Certification File URL" onChange={(e) => handleCertChange(i, e)} className="input w-full" />
              <button type="button" onClick={() => removeCert(i)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addCert} className="text-blue-600 mt-2">+ Add Certification</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          Save Profile
        </button>
      </form>
    </div>
  );
}
