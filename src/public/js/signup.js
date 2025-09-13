console.log("Signup frontend javascript file");


$(function () { });

function validateSignupForm() {
    const memberNick = $('.member-nick').val();
    const memberPhone = $('.member-phone').val();
    const memberPassword = $('.member-password').val();
    const confirmPassword = $('.member-password').val();

    if (
        memberNick === '' ||
        memberPhone === '' ||
        memberPassword === '' ||
        confirmPassword === ''
    ) {
        alert('Plese insert all required fields');
        return false;
    }

    if (confirmPassword !== memberPassword) {
        alert('Passwords do not match. Please try again.')
        return false;
    }
}