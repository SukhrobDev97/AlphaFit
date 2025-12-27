console.log("Users frontend javascript file");

$(function () {
    // Initialize status classes on page load
    $('.member-status').each(function() {
        const status = $(this).val().toLowerCase();
        $(this).removeClass('status-active status-block status-delete');
        $(this).addClass('status-' + status);
    });

    // Store original values on page load
    $('.member-status').each(function() {
        $(this).data('original-value', $(this).val());
    });

    $(".member-status").on("change", function (e) {
      const _id = e.target.id;
      const $select = $(this);
      const memberStatus = $select.val();
      const originalValue = $select.data('original-value');
      
      // Show loading state
      $select.addClass('loading');
      
      // Update visual status immediately
      $select.removeClass('status-active status-block status-delete');
      $select.addClass('status-' + memberStatus.toLowerCase());
  
      axios
        .post("/admin/user/edit", {
          _id,
          memberStatus,
        })
        .then((response) => {
          console.log("response: ", response);
          const result = response.data;
          console.log("result: ", result);
  
          if (result.data) {
            console.log("User updated!");
            $select.removeClass('loading');
            $select.blur();
            $select.data('original-value', memberStatus);
            
            // Show subtle success feedback
            $select.css('border-color', '#10b981');
            setTimeout(() => {
              $select.css('border-color', '');
            }, 1000);
          } else {
            alert("User update failed!");
            // Revert to original value
            $select.val(originalValue);
            $select.removeClass('loading status-active status-block status-delete');
            $select.addClass('status-' + originalValue.toLowerCase());
          }
        })
        .catch((err) => {
          console.log(err);
          alert("User update failed!");
          // Revert to original value
          $select.val(originalValue);
          $select.removeClass('loading status-active status-block status-delete');
          $select.addClass('status-' + originalValue.toLowerCase());
        });
    });
  });
  