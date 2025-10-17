
let currentPage = 'landing';
let selectedTemplate = null;
let resumeData = {};
let profileImageData = null;

const pages = {
    landing: document.getElementById('landing-page'),
    template: document.getElementById('template-page'),
    form: document.getElementById('form-page'),
    preview: document.getElementById('preview-page')
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadFromLocalStorage();
});

function initializeApp() {
    document.getElementById('start-building-btn').addEventListener('click', () => {
        selectedTemplate = null;
        saveToLocalStorage();
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        showPage('template');
    });

    document.getElementById('back-to-landing').addEventListener('click', () => showPage('landing'));
    document.getElementById('back-to-templates').addEventListener('click', () => showPage('template'));
    document.getElementById('back-to-form').addEventListener('click', () => showPage('form'));

    document.getElementById('resume-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('add-experience').addEventListener('click', addExperienceItem);
    document.getElementById('add-education').addEventListener('click', addEducationItem);
    document.getElementById('download-pdf').addEventListener('click', downloadPDF);
    document.getElementById('profilePicture').addEventListener('change', handleProfilePictureUpload);
    document.getElementById('close-error').addEventListener('click', hideError);

    loadTemplates();
    setupAutoSave();
}

function showPage(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
        currentPage = pageName;
    }
    if (pageName === 'preview') {
        generatePreview();
    }
}

function loadTemplates() {
    const templatesGrid = document.getElementById('templates-grid');
    templatesGrid.innerHTML = '';
    resumeTemplates.forEach(template => {
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        templateCard.dataset.templateId = template.id;
        templateCard.innerHTML = `
            <div class="template-preview">
                <i class="fas fa-file-alt" style="font-size: 4rem; color: #667eea;"></i>
                <br><br>
                Preview of ${template.name} Template
            </div>
            <div class="template-name">${template.name}</div>
            <p style="text-align: center; color: #666; margin-top: 0.5rem;">${template.description}</p>
        `;
        templateCard.addEventListener('click', () => selectTemplate(template.id));
        templatesGrid.appendChild(templateCard);
    });
}

function selectTemplate(templateId) {
    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
    const selectedCard = document.querySelector(`[data-template-id="${templateId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedTemplate = templateId;
        setTimeout(() => showPage('form'), 500);
    }
}

function addExperienceItem() {
    const container = document.getElementById('experience-container');
    const experienceItem = document.createElement('div');
    experienceItem.className = 'experience-item';
    experienceItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Job Title *</label>
                <input type="text" name="expJobTitle" required>
            </div>
            <div class="form-group">
                <label>Company *</label>
                <input type="text" name="expCompany" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date *</label>
                <input type="month" name="expStartDate" required>
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="month" name="expEndDate">
                <label class="checkbox-label">
                    <input type="checkbox" name="expCurrent"> Currently working here
                </label>
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="expDescription" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
        </div>
        <button type="button" class="btn btn-danger remove-experience">Remove</button>
    `;
    experienceItem.querySelector('.remove-experience').addEventListener('click', () => {
        experienceItem.remove();
        saveToLocalStorage();
    });
    const currentCheckbox = experienceItem.querySelector('input[name="expCurrent"]');
    const endDateInput = experienceItem.querySelector('input[name="expEndDate"]');
    currentCheckbox.addEventListener('change', function() {
        endDateInput.disabled = this.checked;
        if (this.checked) endDateInput.value = '';
    });
    container.appendChild(experienceItem);
}

function addEducationItem() {
    const container = document.getElementById('education-container');
    const educationItem = document.createElement('div');
    educationItem.className = 'education-item';
    educationItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Degree *</label>
                <input type="text" name="eduDegree" required>
            </div>
            <div class="form-group">
                <label>Institution *</label>
                <input type="text" name="eduInstitution" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Year *</label>
                <input type="number" name="eduStartYear" min="1950" max="2030" required>
            </div>
            <div class="form-group">
                <label>End Year</label>
                <input type="number" name="eduEndYear" min="1950" max="2030">
            </div>
        </div>
        <div class="form-group">
            <label>GPA/Grade</label>
            <input type="text" name="eduGPA" placeholder="3.8/4.0 or First Class">
        </div>
        <button type="button" class="btn btn-danger remove-education">Remove</button>
    `;
    educationItem.querySelector('.remove-education').addEventListener('click', () => {
        educationItem.remove();
        saveToLocalStorage();
    });
    container.appendChild(educationItem);
}

function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            showError('Profile picture must be less than 2MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            showError('Please select a valid image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImageData = e.target.result;
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${profileImageData}" alt="Profile Preview">`;
            saveToLocalStorage();
        };
        reader.readAsDataURL(file);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    try {
        // ✅ New: validate fields section-wise
        const validationMessage = validateFormSections();
        if (validationMessage) {
            showError(validationMessage);
            return;
        }

        const requiredFields = event.target.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            } else {
                field.style.borderColor = '#dee2e6';
            }
        });
        if (!isValid) {
            showError('Please fill in all required fields.');
            return;
        }

        collectFormData();
        saveToLocalStorage();
        showPage('preview');

    } catch (error) {
        console.error('Error submitting form:', error);
        showError('An unexpected error occurred. Please try again.');
    }
}

// ✅ Validation function
function validateFormSections() {
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        return 'Please enter a valid email address (e.g. name@example.com).';
    }

    const phonePattern = /^[0-9]{10}$/;
    if (phone && !phonePattern.test(phone)) {
        return 'Phone number must contain exactly 10 digits.';
    }

    const expJobs = document.querySelectorAll('.experience-item');
    for (let exp of expJobs) {
        const start = exp.querySelector('input[name="expStartDate"]').value;
        const end = exp.querySelector('input[name="expEndDate"]').value;
        const current = exp.querySelector('input[name="expCurrent"]').checked;
        if (!current && start && end && new Date(start) > new Date(end)) {
            return 'Experience start date cannot be later than end date.';
        }
    }

    const eduItems = document.querySelectorAll('.education-item');
    for (let edu of eduItems) {
        const startYear = parseInt(edu.querySelector('input[name="eduStartYear"]').value);
        const endYear = parseInt(edu.querySelector('input[name="eduEndYear"]').value);
        if (startYear && endYear && startYear > endYear) {
            return 'Education start year cannot be greater than end year.';
        }
    }

    return null; // No errors
}

function collectFormData() {
    const form = document.getElementById('resume-form');
    const formData = new FormData(form);
    resumeData = {
        fullName: formData.get('fullName'),
        jobTitle: formData.get('jobTitle'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        website: formData.get('website'),
        summary: formData.get('summary'),
        skills: formData.get('skills'),
        languages: formData.get('languages'),
        profilePicture: profileImageData
    };

    resumeData.experience = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const jobTitle = item.querySelector('input[name="expJobTitle"]').value;
        const company = item.querySelector('input[name="expCompany"]').value;
        const startDate = item.querySelector('input[name="expStartDate"]').value;
        const endDate = item.querySelector('input[name="expEndDate"]').value;
        const current = item.querySelector('input[name="expCurrent"]').checked;
        const description = item.querySelector('textarea[name="expDescription"]').value;
        if (jobTitle && company && startDate) {
            resumeData.experience.push({
                jobTitle,
                company,
                startDate: formatDate(startDate),
                endDate: endDate ? formatDate(endDate) : '',
                current,
                description
            });
        }
    });

    resumeData.education = [];
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        const degree = item.querySelector('input[name="eduDegree"]').value;
        const institution = item.querySelector('input[name="eduInstitution"]').value;
        const startYear = item.querySelector('input[name="eduStartYear"]').value;
        const endYear = item.querySelector('input[name="eduEndYear"]').value;
        const gpa = item.querySelector('input[name="eduGPA"]').value;
        if (degree && institution && startYear) {
            resumeData.education.push({
                degree,
                institution,
                startYear,
                endYear,
                gpa
            });
        }
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function generatePreview() {
    const previewContainer = document.getElementById('resume-preview');
    if (!selectedTemplate) {
        showError('Please select a template first');
        showPage('template');
        return;
    }
    const template = resumeTemplates.find(t => t.id === selectedTemplate);
    if (template) previewContainer.innerHTML = template.render(resumeData);
    else {
        showError('Selected template not found');
        showPage('template');
    }
}
async function downloadPDF() {
    try {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.add('active');

        const { jsPDF } = window.jspdf;
        const resumeElement = document.getElementById('resume-preview');
        

        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: resumeElement.scrollWidth,
            height: resumeElement.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const fileName = `${resumeData.fullName || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        pdf.save(fileName);

        loadingOverlay.classList.remove('active');

    } catch (error) {
        console.error('Error generating PDF:', error);
        document.getElementById('loading-overlay').classList.remove('active');
        showError('Failed to generate PDF. Please try again.');
    }
}

function saveToLocalStorage() {
    try {
        const data = {
            selectedTemplate,
            resumeData,
            profileImageData,
            formData: getFormValues()
        };
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('resumeBuilderData');
        if (savedData) {
            const data = JSON.parse(savedData);
            selectedTemplate = data.selectedTemplate;
            resumeData = data.resumeData || {};
            profileImageData = data.profileImageData;
            
            if (data.formData) {
                populateForm(data.formData);
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function getFormValues() {
    const form = document.getElementById('resume-form');
    const formData = {};
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else if (input.type !== 'file') {
            formData[input.name] = input.value;
        }
    });
    
    return formData;
}

function populateForm(formData) {
    const form = document.getElementById('resume-form');
    
    Object.keys(formData).forEach(key => {
        const element = form.querySelector(`[name="${key}"]`);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = formData[key];
            } else {
                element.value = formData[key];
            }
        }
    });

    if (profileImageData) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${profileImageData}" alt="Profile Preview">`;
    }

    if (selectedTemplate) {
        const templateCard = document.querySelector(`[data-template-id="${selectedTemplate}"]`);
        if (templateCard) {
            templateCard.classList.add('selected');
        }
    }
}

function setupAutoSave() {
    const form = document.getElementById('resume-form');
    
    form.addEventListener('input', debounce(saveToLocalStorage, 1000));
    form.addEventListener('change', saveToLocalStorage);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    errorText.textContent = message;
    errorElement.classList.add('active');
    

    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorElement = document.getElementById('error-message');
    errorElement.classList.remove('active');
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideError();
    }
});

window.addEventListener('beforeunload', function() {
    saveToLocalStorage();
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-experience') || 
        event.target.classList.contains('remove-education')) {
        event.target.closest('.experience-item, .education-item').remove();
        saveToLocalStorage();
    }
})







