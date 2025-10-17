const resumeTemplates = [
    {
        id: 'professional',
        name: 'Professional',
        description: 'Classic sidebar layout for detailed resumes',
        render: function(data) {
            return `
                <div class="resume-template template-classic">
                    <div class="sidebar">
                        ${data.profilePicture ? `<img src="${data.profilePicture}" alt="Profile" class="profile-image">` : ''}
                        <h2>${data.fullName || 'Your Name'}</h2>
                        <div class="job-title">${data.jobTitle || 'Your Job Title'}</div>
                        <div class="contact-info">
                            ${data.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                            ${data.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                            ${data.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.location}</div>` : ''}
                            ${data.website ? `<div class="contact-item"><i class="fas fa-globe"></i> ${data.website}</div>` : ''}
                        </div>

                        ${data.skills ? `
                            <div class="resume-section">
                                <h3>Skills</h3>
                                <div class="skills-grid">
                                    ${data.skills.split(',').map(skill =>
                                        `<div class="skill-item">${skill.trim()}</div>`
                                    ).join('')}
                                </div>
                            </div>
                        ` : ''}

                        ${data.languages ? `
                            <div class="resume-section">
                                <h3>Languages</h3>
                                <p>${data.languages}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div class="main-content">
                        ${data.summary ? `
                            <div class="resume-section">
                                <h2>Professional Summary</h2>
                                <p>${data.summary}</p>
                            </div>
                        ` : ''}

                        ${data.experience && data.experience.length > 0 ? `
                            <div class="resume-section">
                                <h2>Work Experience</h2>
                                ${data.experience.map(exp => `
                                    <div class="experience-entry">
                                        <div class="entry-header">
                                            <div>
                                                <div class="entry-title">${exp.jobTitle}</div>
                                                <div class="entry-company">${exp.company}</div>
                                            </div>
                                            <div class="entry-date">
                                                ${exp.startDate} - ${exp.current ? 'Present' : (exp.endDate || 'Present')}
                                            </div>
                                        </div>
                                        ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        ${data.education && data.education.length > 0 ? `
                            <div class="resume-section">
                                <h2>Education</h2>
                                ${data.education.map(edu => `
                                    <div class="education-entry">
                                        <div class="entry-header">
                                            <div>
                                                <div class="entry-title">${edu.degree}</div>
                                                <div class="entry-company">${edu.institution}</div>
                                            </div>
                                            <div class="entry-date">
                                                ${edu.startYear} - ${edu.endYear || 'Present'}
                                            </div>
                                        </div>
                                        ${edu.gpa ? `<div class="entry-description">GPA: ${edu.gpa}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    },

    {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with gradient header',
        render: function(data) {
            return `
                <div class="resume-template template-modern">
                    <div class="resume-header">
                        ${data.profilePicture ? `<img src="${data.profilePicture}" alt="Profile" class="profile-image">` : ''}
                        <h1>${data.fullName || 'Your Name'}</h1>
                        <div class="job-title">${data.jobTitle || 'Your Job Title'}</div>
                        <div class="contact-info">
                            ${data.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>` : ''}
                            ${data.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>` : ''}
                            ${data.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.location}</div>` : ''}
                            ${data.website ? `<div class="contact-item"><i class="fas fa-globe"></i> ${data.website}</div>` : ''}
                        </div>
                    </div>

                    ${data.summary ? `
                        <div class="resume-section">
                            <h2>Professional Summary</h2>
                            <p>${data.summary}</p>
                        </div>
                    ` : ''}

                    ${data.experience && data.experience.length > 0 ? `
                        <div class="resume-section">
                            <h2>Work Experience</h2>
                            ${data.experience.map(exp => `
                                <div class="experience-entry">
                                    <div class="entry-header">
                                        <div>
                                            <div class="entry-title">${exp.jobTitle}</div>
                                            <div class="entry-company">${exp.company}</div>
                                        </div>
                                        <div class="entry-date">
                                            ${exp.startDate} - ${exp.current ? 'Present' : (exp.endDate || 'Present')}
                                        </div>
                                    </div>
                                    ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${data.education && data.education.length > 0 ? `
                        <div class="resume-section">
                            <h2>Education</h2>
                            ${data.education.map(edu => `
                                <div class="education-entry">
                                    <div class="entry-header">
                                        <div>
                                            <div class="entry-title">${edu.degree}</div>
                                            <div class="entry-company">${edu.institution}</div>
                                        </div>
                                        <div class="entry-date">
                                            ${edu.startYear} - ${edu.endYear || 'Present'}
                                        </div>
                                    </div>
                                    ${edu.gpa ? `<div class="entry-description">GPA: ${edu.gpa}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${data.skills ? `
                        <div class="resume-section">
                            <h2>Skills</h2>
                            <div class="skills-grid">
                                ${data.skills.split(',').map(skill =>
                                    `<div class="skill-item">${skill.trim()}</div>`
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${data.languages ? `
                        <div class="resume-section">
                            <h2>Languages</h2>
                            <p>${data.languages}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    },


    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Flat, text-heavy design with borders',
        render: function(data) {
            return `
                <div class="resume-template template-minimal">
                    <div class="resume-header">
                        <h1>${data.fullName || 'Your Name'}</h1>
                        <div class="job-title">${data.jobTitle || 'Your Job Title'}</div>
                        <div class="contact-info">
                            ${data.email ? `<div class="contact-item">${data.email}</div>` : ''}
                            ${data.phone ? `<div class="contact-item">${data.phone}</div>` : ''}
                            ${data.location ? `<div class="contact-item">${data.location}</div>` : ''}
                            ${data.website ? `<div class="contact-item">${data.website}</div>` : ''}
                        </div>
                    </div>

                    ${data.summary ? `
                        <div class="resume-section">
                            <h2>Summary</h2>
                            <p>${data.summary}</p>
                        </div>
                    ` : ''}

                    ${data.experience && data.experience.length > 0 ? `
                        <div class="resume-section">
                            <h2>Experience</h2>
                            ${data.experience.map(exp => `
                                <div class="experience-entry">
                                    <div class="entry-header">
                                        <div>
                                            <div class="entry-title">${exp.jobTitle}</div>
                                            <div class="entry-company">${exp.company}</div>
                                        </div>
                                        <div class="entry-date">
                                            ${exp.startDate} - ${exp.current ? 'Present' : (exp.endDate || 'Present')}
                                        </div>
                                    </div>
                                    ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${data.education && data.education.length > 0 ? `
                        <div class="resume-section">
                            <h2>Education</h2>
                            ${data.education.map(edu => `
                                <div class="education-entry">
                                    <div class="entry-header">
                                        <div>
                                            <div class="entry-title">${edu.degree}</div>
                                            <div class="entry-company">${edu.institution}</div>
                                        </div>
                                        <div class="entry-date">
                                            ${edu.startYear} - ${edu.endYear || 'Present'}
                                        </div>
                                    </div>
                                    ${edu.gpa ? `<div class="entry-description">GPA: ${edu.gpa}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${data.skills ? `
                        <div class="resume-section">
                            <h2>Skills</h2>
                            <div class="skills-grid">
                                ${data.skills.split(',').map(skill =>
                                    `<div class="skill-item">${skill.trim()}</div>`
                                ).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${data.languages ? `
                        <div class="resume-section">
                            <h2>Languages</h2>
                            <p>${data.languages}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = resumeTemplates;
}
