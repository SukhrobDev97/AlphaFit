console.log("Signup frontend javascript file");



$(function () {
    const fileTarget = $(".file-box .upload-hidden");
    let filename;

    fileTarget.on("change", function () {
        if (window.FileReader) {
            const uploadFile = $(this)[0].files[0];
            const fileType = uploadFile["type"];
            const validImageType = ["image/jpeg", "image/jpg", "image/png"];

            if (!validImageType.includes(fileType)) {
                alert("Please insert only jpeg, jpg and png!");
                $(this).val("");
            } else {
                if (uploadFile) {
                    console.log(URL.createObjectURL(uploadFile));
                    $(".upload-img-frame")
                        .attr("src", URL.createObjectURL(uploadFile))
                        .addClass("success");
                }

                filename = $(this)[0].files[0].name;
                $(this).siblings(".upload-name").val(filename);
            }
        }
    });

});

function validateSignupForm() {
    const memberNick = $('.member-nick').val();
    const memberPhone = $('.member-phone').val();
    const memberPassword = $('.member-password').val();
    const confirmPassword = $('.confirm-password').val();

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
    return true;
}