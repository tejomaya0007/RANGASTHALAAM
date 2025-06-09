document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const nextButton = document.getElementById('nextButton');
    const backButton = document.getElementById('backButton');

    let currentStep = 1;

    function goToNextStep() {
        if (currentStep === 1) {
            // Hide current fields
            document.getElementById('email').closest('.form-group').style.display = 'none';
            document.getElementById('mobile').closest('.form-group').style.display = 'none';
            document.getElementById('firstName').closest('.form-group').style.display = 'none';
            document.getElementById('lastName').closest('.form-group').style.display = 'none';
            document.querySelector('.gender-options').closest('.form-group').style.display = 'none';

            // Show next step fields (you can add more fields here)
            alert('Next step fields could appear here!');

            currentStep++;
            nextButton.innerText = 'Submit';
        } else if (currentStep === 2) {
            registrationForm.submit();
            alert("Form submitted!");
        }
    }

    function goToPreviousStep() {
        if (currentStep === 2) {
            // Show first step fields
            document.getElementById('email').closest('.form-group').style.display = 'block';
            document.getElementById('mobile').closest('.form-group').style.display = 'block';
            document.getElementById('firstName').closest('.form-group').style.display = 'block';
            document.getElementById('lastName').closest('.form-group').style.display = 'block';
            document.querySelector('.gender-options').closest('.form-group').style.display = 'block';

            currentStep--;
            nextButton.innerText = 'Next';
        }
    }

    nextButton.addEventListener('click', goToNextStep);
    backButton.addEventListener('click', goToPreviousStep);
});


// Toggle sidebar visibility
function toggleSidebar() {
    document.getElementById('mobileSidebar').style.display = 'flex';
}

// Hide sidebar
function hideSidebar() {
    document.getElementById('mobileSidebar').style.display = 'none';
}

// Toggle dropdown in sidebar
function toggleSidebarDropdown() {
    const dropdown = document.getElementById('sidebarDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
