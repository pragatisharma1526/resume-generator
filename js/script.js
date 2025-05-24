$(document).ready(function() {
    // Template data with distinctive styles
    const templates = [
        {
            id: 'template1',
            name: 'Classic Elegance',
            preview: 'https://i.imgur.com/8KQZQYp.png',
            thumbnail: 'ss1.png',
            style: {
                headerBg: '#2c3e50',
                textColor: '#2c3e50',
                accentColor: '#3498db',
                fontFamily: 'Georgia, serif'
            },
            template: 'templates/classic-template.html'
        },
     

    ];

    let selectedTemplate = null;

    // Initialize template gallery
    function initializeTemplates() {
        const templateGallery = $('#templateGallery');
        templates.forEach(template => {
            const templateItem = $('<div>')
                .addClass('template-item')
                .append(
                    $('<div>').addClass('template-preview').append(
                        $('<img>').attr('src', template.thumbnail).attr('alt', template.name)
                    ),
                    $('<div>').addClass('template-name').text(template.name)
                )
                .click(function() {
                    $('.template-item').removeClass('selected');
                    $(this).addClass('selected');
                    selectedTemplate = template;
                });
            templateGallery.append(templateItem);
        });
    }

    // Add education entry
    $('#addEducation').click(function() {
        const educationEntry = $('<div>').addClass('education-entry');
        educationEntry.append(
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Degree'),
                $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'degree[]').attr('required', true)
            ),
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Institution'),
                $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'institution[]').attr('required', true)
            ),
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Year'),
                $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'year[]').attr('required', true)
            )
        );
        $('#educationFields').append(educationEntry);
    });

    // Add experience entry
    $('#addExperience').click(function() {
        const experienceEntry = $('<div>').addClass('experience-entry');
        experienceEntry.append(
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Job Title'),
                $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'jobTitle[]').attr('required', true)
            ),
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Company'),
                $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'company[]').attr('required', true)
            ),
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Duration'),
                $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'duration[]').attr('required', true)
            ),
            $('<div>').addClass('mb-3').append(
                $('<label>').addClass('form-label').text('Description'),
                $('<textarea>').addClass('form-control').attr('name', 'jobDescription[]').attr('rows', '2').attr('required', true)
            )
        );
        $('#experienceFields').append(experienceEntry);
    });

    // Add skill
    $('#addSkill').click(function() {
        const skillInput = $('<div>').addClass('mb-3').append(
            $('<input>').addClass('form-control').attr('type', 'text').attr('name', 'skills[]').attr('placeholder', 'Enter skill').attr('required', true)
        );
        $('#skillsFields').append(skillInput);
    });

    // Handle profile picture upload
    $('#profilePicture').change(function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profilePreview').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Generate resume
    $('#resumeForm').submit(function(e) {
        e.preventDefault();
        
        if (!selectedTemplate) {
            alert('Please select a template');
            return;
        }

        const formData = {
            personal: {
                name: $('#fullName').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                address: $('#address').val(),
                summary: $('#summary').val()
            },
            education: [],
            experience: [],
            skills: []
        };

        // Collect education data
        $('.education-entry').each(function() {
            formData.education.push({
                degree: $(this).find('input[name="degree[]"]').val(),
                institution: $(this).find('input[name="institution[]"]').val(),
                year: $(this).find('input[name="year[]"]').val()
            });
        });

        // Collect experience data
        $('.experience-entry').each(function() {
            formData.experience.push({
                jobTitle: $(this).find('input[name="jobTitle[]"]').val(),
                company: $(this).find('input[name="company[]"]').val(),
                duration: $(this).find('input[name="duration[]"]').val(),
                description: $(this).find('textarea[name="jobDescription[]"]').val()
            });
        });

        // Collect skills data
        $('input[name="skills[]"]').each(function() {
            formData.skills.push($(this).val());
        });

        // Generate resume preview
        generateResumePreview(formData);
        
        // Show preview modal
        $('#previewModal').modal('show');
    });

    // Download resume as PDF
    $('#downloadResume').click(function() {
        const element = document.getElementById('resumePreview');
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px';
        tempContainer.style.background = '#ffffff';
        tempContainer.style.padding = '20px';
        document.body.appendChild(tempContainer);

        // Clone the content
        const content = element.cloneNode(true);
        tempContainer.appendChild(content);

        // Wait for images to load
        const images = content.getElementsByTagName('img');
        let loadedImages = 0;
        const totalImages = images.length;

        function generatePDF() {
            // Create a new jsPDF instance using the correct global reference
            const pdf = new window.jspdf.jsPDF('p', 'pt', 'a4');
            
            // Set the width and height for the PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Convert the HTML content to canvas
            html2canvas(content, {
                scale: 2,
                useCORS: true,
                logging: true,
                letterRendering: true,
                width: 800,
                height: content.scrollHeight,
                windowWidth: 800,
                onclone: function(clonedDoc) {
                    const clonedContent = clonedDoc.getElementById('resumePreview');
                    if (clonedContent) {
                        clonedContent.style.width = '800px';
                        clonedContent.style.margin = '0 auto';
                        clonedContent.style.background = '#ffffff';
                        clonedContent.style.padding = '20px';
                    }
                }
            }).then(canvas => {
                // Calculate the aspect ratio
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                
                // Calculate the position to center the image
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = (pdfHeight - imgHeight * ratio) / 2;
                
                // Add the image to the PDF
                pdf.addImage(
                    canvas.toDataURL('image/jpeg', 1.0),
                    'JPEG',
                    imgX,
                    imgY,
                    imgWidth * ratio,
                    imgHeight * ratio
                );
                
                // Save the PDF
                pdf.save('resume.pdf');
                
                // Clean up
                document.body.removeChild(tempContainer);
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
                document.body.removeChild(tempContainer);
            });
        }

        if (totalImages === 0) {
            generatePDF();
            return;
        }

        Array.from(images).forEach(img => {
            if (img.complete) {
                loadedImages++;
                if (loadedImages === totalImages) {
                    generatePDF();
                }
            } else {
                img.onload = function() {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        generatePDF();
                    }
                };
                img.onerror = function() {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        generatePDF();
                    }
                };
            }
        });
    });

    // Generate resume preview
    function generateResumePreview(data) {
        const preview = $('#resumePreview');
        preview.empty();

        if (!selectedTemplate) {
            alert('Please select a template');
            return;
        }

        // Create resume content with template-specific styling
        const resumeContent = $('<div>').addClass('resume-content');
        
        // Apply template-specific styles
        resumeContent.css({
            'font-family': selectedTemplate.style.fontFamily,
            'color': selectedTemplate.style.textColor,
            'padding': '20px',
            'background': '#fff',
            'width': '800px',
            'margin': '0 auto',
            'box-sizing': 'border-box'
        });

        // Header section with template-specific background
        const header = $('<div>').addClass('resume-header');
        header.css({
            'background-color': selectedTemplate.style.headerBg,
            'padding': '30px',
            'margin-bottom': '20px',
            'border-radius': '5px',
            'color': '#ffffff',
            'box-sizing': 'border-box'
        });
        
        // Add profile picture to header
        const profilePic = $('<img>')
            .addClass('profile-picture')
            .attr('src', $('#profilePreview').attr('src'))
            .attr('alt', 'Profile Picture')
            .css({
                'width': '120px',
                'height': '120px',
                'border-radius': '50%',
                'border': '3px solid #fff',
                'margin-bottom': '20px',
                'display': 'block',
                'margin-left': 'auto',
                'margin-right': 'auto',
                'box-sizing': 'border-box'
            });
        
        header.append(
            profilePic,
            $('<h1>').text(data.personal.name).css('color', '#ffffff'),
            $('<p>').text(data.personal.email).css('color', '#ffffff'),
            $('<p>').text(data.personal.phone).css('color', '#ffffff'),
            $('<p>').text(data.personal.address).css('color', '#ffffff')
        );

        // Summary section
        const summary = $('<div>').addClass('resume-section');
        summary.append(
            $('<h2>').text('Professional Summary').css('color', selectedTemplate.style.accentColor),
            $('<p>').text(data.personal.summary)
        );

        // Education section
        const education = $('<div>').addClass('resume-section');
        education.append($('<h2>').text('Education').css('color', selectedTemplate.style.accentColor));
        data.education.forEach(edu => {
            education.append(
                $('<div>').addClass('education-item').append(
                    $('<h3>').text(edu.degree),
                    $('<p>').text(edu.institution),
                    $('<p>').text(edu.year)
                )
            );
        });

        // Experience section
        const experience = $('<div>').addClass('resume-section');
        experience.append($('<h2>').text('Work Experience').css('color', selectedTemplate.style.accentColor));
        data.experience.forEach(exp => {
            experience.append(
                $('<div>').addClass('experience-item').append(
                    $('<h3>').text(exp.jobTitle),
                    $('<p>').text(exp.company),
                    $('<p>').text(exp.duration),
                    $('<p>').text(exp.description)
                )
            );
        });

        // Skills section
        const skills = $('<div>').addClass('resume-section');
        skills.append(
            $('<h2>').text('Skills').css('color', selectedTemplate.style.accentColor),
            $('<ul>').addClass('skills-list').append(
                data.skills.map(skill => $('<li>').text(skill))
            )
        );

        // Combine all sections
        resumeContent.append(header, summary, education, experience, skills);
        preview.append(resumeContent);

        // Ensure all images are loaded before showing the preview
        const images = preview.find('img');
        let loadedImages = 0;
        
        if (images.length === 0) {
            $('#previewModal').modal('show');
            return;
        }

        images.each(function() {
            if (this.complete) {
                loadedImages++;
                if (loadedImages === images.length) {
                    $('#previewModal').modal('show');
                }
            } else {
                $(this).on('load', function() {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        $('#previewModal').modal('show');
                    }
                });
            }
        });
    }

    // Initialize the application
    initializeTemplates();
}); 