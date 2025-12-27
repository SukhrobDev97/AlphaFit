console.log("Products frontend javascript file");


$(function () {
    $('.product-collection').on('change', ()=> {
      const selectedValue = $(".product-collection").val();
  
      if (selectedValue === 'VITAMINS') {
        $('#product-collection').hide();
        $('#product-volume').show();
      } else {
        $('#product-volume').hide();
        $('#product-collection').show();
      }
    });

    // Slide-over panel controls
    $("#new-product-btn").on('click', () => {
        $("#slide-over-panel").addClass('active');
        $("#slide-over-backdrop").addClass('active');
        $('body').css('overflow', 'hidden');
    });

    $("#panel-close, #slide-over-backdrop, #cancel-form-btn").on('click', () => {
        $("#slide-over-panel").removeClass('active');
        $("#slide-over-backdrop").removeClass('active');
        $('body').css('overflow', '');
    });

    // Update status select classes on change
    $('.new-product-status').on('change', function() {
        $(this).removeClass('status-process status-pause status-delete');
        const status = $(this).val().toLowerCase();
        $(this).addClass('status-' + status);
    });

    // Initialize status classes on page load
    $('.new-product-status').each(function() {
        const status = $(this).val().toLowerCase();
        $(this).addClass('status-' + status);
    });

    $('.new-product-status').on("change", async function (e){
        const id = e.target.id,
        productStatus = $(`#${id}.new-product-status`).val();
        try{
            const response = await axios.post(`/admin/product/${id}`, {
                productStatus : productStatus
            });
            console.log('response: ', response);
            const result = response.data;

            if(result.data){
                $(".new-product-status").blur();
            }else alert('Product update is failed')
        }catch(err){
            console.log(err)
            alert('Product update is failed')
        }
    
    })

  });
  



function validateForm() {
    const productName = $('.product-name').val();
    const productStatus = $('.product-status').val();
    const productPrice = $('.product-price').val();
    const productLeftCount = $('.product-left-count').val();
    const productCollection = $('.product-collection').val();
    const productDesc = $('.product-desc').val();

    if (
        productName === '' ||
        productStatus === '' ||
        productPrice === '' ||
        productLeftCount === '' ||
        productCollection === ''
    ) {
        alert('Please insert all required details');
        return false;
    }
    return true;
}

function prewievFileHandler(input, order){
    const imageClassName = input.className;
    console.log('input: ', input)
    const file = $(`.${imageClassName}`).get(0).files[0];
    const fileType = file["type"];
    const validImageType = ["image/jpeg", "image/jpg", "image/png"];

    if (!validImageType.includes(fileType)) {
        alert("Please insert only jpeg, jpg and png!");
    } else {
        if(file){
            const reader = new FileReader();
            reader.onload = function (){
                $(`#image-section-${order}`).attr('src', reader.result)
            }
            reader.readAsDataURL(file)
        }
    }
}