console.log("Signup frontend javascript file");

$(function () {
    const fileTarget = $("#input-file");
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
                    $("#imagePreview")
                        .attr("src", URL.createObjectURL(uploadFile))
                        .addClass("success");
                }

                filename = $(this)[0].files[0].name;
                $(this).siblings(".file-upload-name").val(filename);
            }
        }
    });
});

function validateSignupForm() {
    const memberNick = $('#memberNick').val();
    const memberPhone = $('#memberPhone').val();
    const memberPassword = $('#memberPassword').val();
    const confirmPassword = $('#confirmPassword').val();

    if (
        memberNick === '' ||
        memberPhone === '' ||
        memberPassword === '' ||
        confirmPassword === ''
    ) {
        alert('Please insert all required fields');
        return false;
    }

    if (confirmPassword !== memberPassword) {
        alert('Passwords do not match. Please try again.')
        return false;
    }
    return true;
}
