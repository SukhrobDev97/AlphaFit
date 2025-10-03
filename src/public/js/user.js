console.log("Users frontend javascript file");

$(function () {
    $(".member-status").on("change", function (e) {
      const _id = e.target.id;
      console.log("id: ", _id);
  
      const memberStatus = $(`#${_id}.member-status`).val();
      console.log("memberStatus: ", memberStatus);
  
      // TODO: Axios updateChosenUser
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
            $(".member-status").blur();
          } else alert("User update failed!");
        })
        .catch((err) => {
          console.log(err);
          alert("User update failed!");
        });
    });
  });
  