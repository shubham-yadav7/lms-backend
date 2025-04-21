"use strict";
$(document).ready(function () {
  /* -- Form Editors - Summernote -- */

  if (sessionStorage.getItem("success")) {
    new PNotify({
      title: "Success",
      text: sessionStorage.getItem("success"),
      type: "success",
    });
    sessionStorage.clear();
  }
  if (sessionStorage.getItem("error")) {
    new PNotify({
      title: "Error",
      text: sessionStorage.getItem("error"),
      type: "error",
    });
    sessionStorage.clear();
  }

  $("#description").summernote({
    height: 120,
    minHeight: null,
    maxHeight: null,
    focus: false,
    toolbar: [
      // [groupName, [list of button]]
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
    callbacks: {
      onChange: function (contents) {
        $(this).val(contents);
      },
      onPaste: function (contents) {
        $(this).val(contents);
      },
    },
  });
  $(".desc_summer").summernote({
    height: 120,
    minHeight: null,
    maxHeight: null,
    focus: false,
    toolbar: [
      // [groupName, [list of button]]
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["para", ["ul", "ol", "paragraph"]],
    ],
    callbacks: {
      onChange: function (contents) {
        $(this).val(contents);
      },
      onPaste: function (contents) {
        $(this).val(contents);
      },
    },
  });

  //Number input
  $(document).on("keypress", ".number", function (event) {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  });

  $("#description-anchor").summernote({
    height: 120,
    minHeight: null,
    maxHeight: null,
    focus: false,
    toolbar: [
      // [groupName, [list of button]]
      ["style", ["bold", "italic", "underline", "clear"]],
      ["font", ["strikethrough", "superscript", "subscript"]],
      ["para", ["ul", "ol", "paragraph"]],
      ["insert", ["link"]],
    ],
    callbacks: {
      onChange: function (contents) {
        $(this).val(contents);
      },
      onPaste: function (contents) {
        $(this).val(contents);
      },
    },
  });

  $(".dropify").dropify();

  // Alerts
  if ($(".session-alert").length) {
    setTimeout(() => {
      $(".session-alert").fadeOut();
    }, 1500);
  }

  // Delete
  $(document).on("submit", ".delete", function (e) {
    // e.preventDefault();
    var result = confirm("Are you sure you want to perform this action?");
    if (result) {
      return true;
    } else {
      return false;
    }
  });

  // Dynamic Fields
  $(document).on("click", ".add-fields", function () {
    new PNotify({
      title: false,
      text: "Field added successfully!",
      type: "info",
      delay: 800,
    });
    $(".lesson-add-fields-wrapper").append(`
        <div class="row align-items-center mb-4">
            <div class="col-lg-3">
                <div class="form-group">
                    <label for="lessonTitle">Lesson Title</label>
                    <input type="text" name="lessonTitle[]" id="lessonTitle" class="form-control" />
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label for="lessonLink">Lesson Link</label>
                    <input type="text" name="lessonLink[]" id="lessonLink" class="form-control" />
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label for="lessonTime">Lesson Time</label>
                    <input type="text" name="lessonTime[]" id="lessonTime" class="form-control" />
                </div>
            </div>
            <div class="col-lg-2">
            <div class="form-group">
                <label for="lessonFree">Lesson Free Status</label>
                <select name="lessonFree[]" class="form-control">
                    <option value="off">Paid</option>
                    <option value="on">Free</option>
                </select>
            </div>
            </div>
            <div class="col-lg-1">
                <button class="remove-fields btn btn-info-rgba" type="button"><i class="la la-2x la-minus"></i></button>
            </div>
        </div>
        `);
  });

  $(document).on("click", ".remove-fields", function () {
    // new PNotify({
    //     title: 'Field Removed',
    //     text: 'Field removed successfully!',
    //     type: 'info',
    //     delay: 1000
    // });
    $(this).parent().parent(".row").remove();
  });

  $(document).on("click", ".add-document-field", function () {
    new PNotify({
      title: false,
      text: "Field added successfully!",
      type: "info",
      delay: 800,
    });
    $(".blog-add-fields-wrapper").append(`
        <div class="row align-items-center mb-4">
          <div class="col-lg-5">
            <div class="form-group">
                <label>Document name</label>
                <input type="text"  class="form-control documentName" />
            </div>
          </div>
         <div class="col-lg-6">
            <div class="form-group">
                <label>Document</label>
                <input type="file" class="form-control-file documentFile" " accept=".pdf,.docx,.doc">
            </div>
          </div>
          <div class="col-lg-1">
            <button class="remove-fields btn btn-info-rgba" type="button"><i class="la la-2x la-minus"></i></button>
          </div>
        </div>
        `);
  });

  // Change Password Field Validation
  $("#change-password").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#oldPassword").val().trim() === "") {
      $("#oldPassword").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#newPassword").val().trim() === "") {
      $("#newPassword").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#cnewPassword").val().trim() === "") {
      $("#cnewPassword").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      let oldPassword = $("#oldPassword").val();
      // Check Old Password
      if (oldPassword && oldPassword.trim() !== "") {
        $.ajax({
          type: "POST",
          url: "/admin/check-old-password",
          data: {
            oldPassword,
          },
          success: function (response, xhr, raw) {
            if (raw.status === 200) {
              $("#change-password-form").submit();
            } else {
              return false;
            }
          },
          error: function (response) {
            new PNotify({
              title: "Error",
              text: "Old password is wrong",
              type: "error",
            });
            return false;
          },
        });
        return false;
      } else {
        return false;
      }
    }
  });

  //Blog category validation

  $("#add-blog-category-btn,#add-course-category-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#category-title").val().trim() === "") {
      $("#category-title").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    }
  });

  $("#add-course-category-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#category-title").val().trim() === "") {
      $("#category-title").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#category-excerpt").val().trim() === "") {
      $("#category-excerpt").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    }
  });

  $("#add-blog-tag-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#tag-title").val().trim() === "") {
      $("#tag-title").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    }
  });

  //Edit blog category
  $(document).on("click", ".edit-blog-category", function () {
    $("#edit-blog-category-modal").modal("show");
    $("#editCategory-title").val($(this).data("title"));
    $("#edit-blog-category-btn").data("id", $(this).data("id"));
  });

  $(document).on("click", "#edit-blog-category-btn", function (e) {
    var id = $(e.target).data("id");
    var error = false;
    if ($("#editCategory-title").val().trim() === "") {
      $("#editCategory-title").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      $("#edit-blog-category-form").attr(
        "action",
        `/admin/blog/category/${id}/edit?_method=PUT`
      );
      $("#edit-blog-category-form").attr("method", "POST");
    }
  });

  //View review
  $(document).on("click", ".view-review", function () {
    $("#review-content").html(`
          <div class='d-flex'>
            <p> Name:<span class="ml-2">${$(this).data("name")}</span> <p>
          </div>
          <div class='d-flex'>
            <p> Item:<span class="ml-2">${$(this).data("item")}</span> <p>
          </div>
          <div class='d-flex'>
            <p> Rating:<span class="ml-2">${$(this).data("rating")}</span> <p>
          </div>
          <div class='d-flex'>
             <p> Review:<span class="ml-2">${$(this).data("review")}</span> <p>
          </div>

        `);
    $("#approve-form").attr(
      "action",
      `/admin/reviews/${$(this).data("id")}/${$(this).data(
        "itemtype"
      )}/edit?_method=PUT`
    );
    $("#approve-form").attr("method", "post");
    $("#reject-form").attr(
      "action",
      `/admin/reviews/${$(this).data("id")}/${$(this).data(
        "itemtype"
      )}/edit?_method=PUT`
    );
    $("#reject-form").attr("method", "post");
    // $('.review-action').data('id',$(this).data('id'))
    $("#edit-review-modal").modal("show");
  });
  ////Edit Course category
  $(document).on("click", ".edit-course-category", function () {
    $("#edit-course-category-modal").modal("show");
    $("#editCourseCategory-title").val($(this).data("title"));
    $("#editCourseCategory-excerpt").val($(this).data("excerpt"));
    $("#editCourseCategory-icon").attr(
      "data-default-file",
      `/uploads/category/${$(this).data("img")}`
    );
    $("#edit-course-category-btn").data("id", $(this).data("id"));
  });

  $(document).on("click", "#edit-course-category-btn", function (e) {
    var id = $(e.target).data("id");
    var error = false;
    if ($("#editCourseCategory-title").val().trim() === "") {
      $("#editCourseCategory-title").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      $("#edit-course-category-form").attr(
        "action",
        `/admin/courses/category/${id}/edit?_method=PUT`
      );
      $("#edit-course-category-form").attr("method", "POST");
    }
  });

  //Edit blog tag
  $(document).on("click", ".edit-blog-tag", function () {
    $("#edit-blog-tag-modal").modal("show");
    $("#editTag-title").val($(this).data("title"));
    $("#edit-blog-tag-btn").data("id", $(this).data("id"));
  });

  $(document).on("click", "#edit-blog-tag-btn", function (e) {
    var id = $(e.target).data("id");
    var error = false;
    if ($("#editTag-title").val().trim() === "") {
      $("#editTag-title").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      $("#edit-blog-tag-form").attr(
        "action",
        `/admin/blog/tag/${id}/edit?_method=PUT`
      );
      $("#edit-blog-tag-form").attr("method", "POST");
    }
  });

  //Upload multiple images
  var imgWrap = "";
  var imgArray = [];

  function ImgUpload() {
    $(".upload__inputfile").each(function () {
      $(this).on("change", function (e) {
        imgWrap = $(this).closest(".upload__box").find(".upload__img-wrap");
        var maxLength = $(this).attr("data-max_length");

        var files = e.target.files;
        var filesArr = Array.prototype.slice.call(files);
        var iterator = 0;
        filesArr.forEach(function (f, index) {
          if (!f.type.match("image.*")) {
            return;
          }

          if (imgArray.length > maxLength) {
            return false;
          } else {
            var len = 0;
            for (var i = 0; i < imgArray.length; i++) {
              if (imgArray[i] !== undefined) {
                len++;
              }
            }
            if (len > maxLength) {
              return false;
            } else {
              imgArray.push(f);

              var reader = new FileReader();
              reader.onload = function (e) {
                var html =
                  "<div class='upload__img-box'><div style='background-image: url(" +
                  e.target.result +
                  ")' data-number='" +
                  $(".upload__img-close").length +
                  "' data-file='" +
                  f.name +
                  "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                imgWrap.append(html);
                iterator++;
              };
              reader.readAsDataURL(f);
            }
          }
        });
      });
    });

    $("body").on("click", ".upload__img-close", function (e) {
      var file = $(this).parent().data("file");
      for (var i = 0; i < imgArray.length; i++) {
        if (imgArray[i].name === file) {
          imgArray.splice(i, 1);
          break;
        }
      }
      $(this).parent().parent().remove();
    });
  }
  ImgUpload();
  var thumbImage = [];
  $(".upload_defaultThumbImage").on("change", (e) => {
    thumbImage[0] = e.currentTarget.files[0];
    const image = URL.createObjectURL(e.currentTarget.files[0]);
    imgWrap = $(e.target).closest(".thumb-upload-box").find(".thumbContainer");

    imgWrap.html(
      "<div class='upload__img-box'><div style='background-image: url(" +
        image +
        ")' class='img-bg'><div class='upload__img-close defaultThumbImage-close'></div></div></div>"
    );
  });

  //Delete images
  $(".deleteBlogImg").on("click", function (e) {
    var img = $(this).data("img");
    var id = $(this).data("id");
    var type = $(this).data("type");
    var result = confirm("Are you sure you want to perform this action?");
    if (result) {
      $.ajax(`/admin/blog/image?blogId=${id}&img=${img}&imgType=${type}`, {
        method: "delete",
        success: function () {
          location.reload();
        },
        error: function () {
          console.log("failed");
        },
      });
    }
  });

  // Delete banner image
  $(".deleteBannerImg").on("click", function (e) {
    let img = $(this).data("img");
    let id = $(this).data("id");
    let result = confirm("Are you sure! You want to perform this action ?");
    if (result) {
      $.ajax(`/admin/banner/image?bannerId=${id}&img=${img}`, {
        method: "delete",
        success: function () {
          location.reload();
        },
        error: function () {
          console.log("failed");
        },
      });
    }
  });

  // Delete poster image
  $(".deletePosterImg").on("click", function (e) {
    let img = $(this).data("img");
    let id = $(this).data("id");
    let result = confirm("Are you sure! You want to perform this action ?");
    if (result) {
      $.ajax(`/admin/help/image?posterId=${id}&img=${img}`, {
        method: "delete",
        success: function () {
          location.reload();
        },
        error: function () {
          console.log("failed");
        },
      });
    }
  });

  //Add blog
  $("#add-blog-btn").on("click", function () {
    $(".error").remove();
    var error = false;
    if ($("#title").val().trim() === "") {
      $("#title").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#category").val().trim() === "") {
      $("#category").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#tags").val().length === 0) {
      $(".tags-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#quote").val().length === 0) {
      $(".quote-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#summernote").val().trim() === "") {
      $(".descp-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (thumbImage.length === 0) {
      $(".thumb-upload-box").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      var formData = new FormData();
      var documentName = [];
      $(".documentName").each(function () {
        documentName.push($(this).val());
      });
      formData.append("title", $("#title").val().trim());
      formData.append("category", $("#category").val().trim());
      formData.append("tags", JSON.stringify($("#tags").val()));
      formData.append("quote", $("#quote").val().trim());
      formData.append("descp", $("#summernote").val().trim());
      formData.append("blogThumbImage", thumbImage[0]);
      formData.append("blogDocumentName", JSON.stringify(documentName));
      imgArray.forEach((i) => {
        formData.append("blogGallery", i);
      });

      $(".documentFile").each(function () {
        formData.append("blogDocument", $(this)[0].files[0]);
      });

      $.ajax("/admin/blog/add", {
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response, xhr, statusCode) {
          if (statusCode.status === 200) {
            sessionStorage.setItem("success", "Blog added successfully!");
            location.reload();
          } else {
            sessionStorage.setItem("error", "Enable to add blog!");
            location.reload();
          }
        },
        error: function (response) {
          sessionStorage.setItem("error", "Enable to add blog!");
          location.reload();
        },
      });
    }
  });

  //edit-blog-btn
  $("#edit-blog-btn").on("click", function () {
    var id = $("#edit-blog-btn").data("id");
    $(".error").remove();
    var error = false;
    if ($("#title").val().trim() === "") {
      $("#title").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#category").val().trim() === "") {
      $("#category").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#tags").val().length === 0) {
      $(".tags-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#quote").val().length === 0) {
      $(".quote-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#summernote").val().trim() === "") {
      $(".descp-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    // if (thumbImage.length === 0) {
    //     $('.thumb-upload-box').after('<span class="error">This field is required.</span>')
    //     error = true
    // }
    if (error) {
      return false;
    } else {
      var formData = new FormData();
      var documentName = [];
      // var checkDocFile=[]
      $(".documentName").each(function () {
        documentName.push($(this).val());
      });
      formData.append("title", $("#title").val().trim());
      formData.append("category", $("#category").val().trim());
      formData.append("tags", JSON.stringify($("#tags").val()));
      formData.append("quote", $("#quote").val().trim());
      formData.append("descp", $("#summernote").val().trim());
      formData.append("blogDocumentName", JSON.stringify(documentName));
      if (thumbImage[0] !== undefined) {
        formData.append("blogThumbImage", thumbImage[0]);
      }

      imgArray.forEach((i) => {
        formData.append("blogGallery", i);
      });

      $(".documentFile").each(function () {
        formData.append("blogDocument", $(this)[0].files[0]);
      });

      $.ajax(`/admin/blog/${id}/edit`, {
        method: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
          location.reload();
        },
        error: function () {
          console.log("error");
        },
      });
    }
  });

  //Delete Blog documents
  $(".delete-doc").on("click", function () {
    var docId = $(this).data("docid");
    var blogId = $(this).data("blogid");
    var doc = $(this).data("doc");
    $.ajax({
      type: "DELETE",
      url: `/admin/blog/document?docId=${docId}&blog=${blogId}&doc=${doc}`,
      success: function (response) {
        sessionStorage.setItem("success", "Document deleted successfully!");
        location.reload();
      },
      erorr: function (response) {
        sessionStorage.setItem("error", "Unable to delete document!");
        location.reload();
      },
    });
  });
  //Coupon validation

  $("#add-coupon").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#couponType").val().trim() === "") {
      $("#couponType").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#couponCode").val().trim() === "") {
      $("#couponCode").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#discountUpTo").val().trim() === "") {
      $("#discountUpTo").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#amount").val().trim() === "") {
      $("#amount").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#noOfUses").val().trim() === "") {
      $("#noOfUses").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#expiredAt").val().trim() === "") {
      $("#expiredAt").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }

    if (error) {
      return false;
    }
  });

  $("#edit-coupon").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#couponType").val().trim() === "") {
      $("#couponType").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#couponCode").val().trim() === "") {
      $("#couponCode").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#discountUpTo").val().trim() === "") {
      $("#discountUpTo").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#amount").val().trim() === "") {
      $("#amount").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#noOfUses").val().trim() === "") {
      $("#noOfUses").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#expiredAt").val().trim() === "") {
      $("#expiredAt").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }

    if (error) {
      return false;
    }
  });

  //sub-adminvalidation
  $("#add-subadmin").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#name").val().trim() === "") {
      $("#name").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#email").val().trim() === "") {
      $("#email").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#password").val().trim() === "") {
      $("#password").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#confirm").val().trim() === "") {
      $("#confirm").after('<span class="error">This field is required.</span>');
      error = true;
    } else if ($("#password").val().trim() !== $("#confirm").val().trim()) {
      $("#confirm").after(
        '<span class="error">Password should match with confirm password.</span>'
      );
      error = true;
    }

    if (error) {
      return false;
    }
  });

  $("#edit-subadmin").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#name").val().trim() === "") {
      $("#name").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#email").val().trim() === "") {
      $("#email").after('<span class="error">This field is required.</span>');
      error = true;
    }

    if (error) {
      return false;
    }
  });

  //chage subadmin password
  $("#change-subadmin-password,#change-user-password").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#newPassword").val().trim() === "") {
      $("#newPassword").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#cnewPassword").val().trim() === "") {
      $("#cnewPassword").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    } else if (
      $("#newPassword").val().trim() !== $("#cnewPassword").val().trim()
    ) {
      $("#cnewPassword").after(
        '<span class="error">Password should match with confirm password.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    }
  });
  //add product validation
  $("#add-instructor-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#name").val().trim() === "") {
      $("#name").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#designation").val().trim() === "") {
      $("#designation").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#email").val().trim() === "") {
      $("#email").after('<span class="error">This field is required.</span>');
      error = true;
    } else if (!ValidateEmail($("#email").val().trim())) {
      $("#email").after(
        '<span class="error">Provide valid email address.</span>'
      );
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $("#descp-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if (!$("#profileImg")[0].files[0]) {
      $(".profile-img-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }

    if (error) {
      return false;
    }
  });
  //add product validation
  $("#edit-instructor-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#name").val().trim() === "") {
      $("#name").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#designation").val().trim() === "") {
      $("#designation").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#email").val().trim() === "") {
      $("#email").after('<span class="error">This field is required.</span>');
      error = true;
    } else if (!ValidateEmail($("#email").val().trim())) {
      $("#email").after(
        '<span class="error">Provide valid email address.</span>'
      );
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $("#descp-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }

    if (error) {
      return false;
    }
  });
  //user validation
  $("#add-user").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#firstName").val().trim() === "") {
      $("#firstName").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#lastName").val().trim() === "") {
      $("#lastName").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#number").val().trim() === "") {
      $("#number").after('<span class="error">This field is required.</span>');
      error = true;
    }
    if ($("#email").val().trim() === "") {
      $("#email").after('<span class="error">This field is required.</span>');
      error = true;
    } else if (!ValidateEmail($("#email").val().trim())) {
      $("#email").after(
        '<span class="error">Provide valid email address.</span>'
      );
      error = true;
    }
    if ($("#password").val().trim() === "") {
      $("#password").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    if ($("#confirm").val().trim() === "") {
      $("#confirm").after('<span class="error">This field is required.</span>');
      error = true;
    } else if ($("#password").val().trim() !== $("#confirm").val().trim()) {
      $("#confirm").after(
        '<span class="error">Password should match with confirm password.</span>'
      );
      error = true;
    }

    if (error) {
      return false;
    }
  });
  //Assign course
  let total;
  $(".assign-course").on("change", function () {
    total = 0;
    $(this)
      .find(":selected")
      .each(function (i) {
        total = total + parseInt($(this).data("amount"));
      });
    return false;
  });

  $("#assign-course").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($(".assign-course").val().length === 0) {
      $(".select-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    // if (!error) {
    //     $('#amountToCompare').val(total)
    //     $('#total-amount-msg').text(`Course's total Amount is ₹${total}. Please enter it below.`)
    //     $('#check-amount-modal').modal('show')
    // }
    return true;
  });

  $("#assign-course-bundle").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($(".assign-course-bundle").val().length === 0) {
      $(".select-container").after(
        '<span class="error">This field is required.</span>'
      );
      error = true;
    }
    // if (!error) {
    //     $('#amountToCompare').val(total)
    //     $('#total-amount-msg').text(`Course's total Amount is ₹${total}. Please enter it below.`)
    //     $('#check-amount-modal').modal('show')
    // }
    return true;
  });

  $("#check-amount").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#totalAmount").val().trim() === "") {
      $("#totalAmount").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    } else if (
      $("#totalAmount").val().trim() !== $("#amountToCompare").val().trim()
    ) {
      $("#totalAmount").after(
        '<span class="error">Please provide valid Course amount total.</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      $("#assign-course-form").submit();
      $("#check-amount-modal").modal("hide");
    }
  });

  $("#add-faq,#edit-faq").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#question").val().trim() === "") {
      $("#question").after('<span class="error">This is required value</span>');
      error = true;
    }
    if ($("#answer").val().trim() === "") {
      $("#answer").after('<span class="error">This is required value</span>');
      error = true;
    }
    if (error) {
      return false;
    }
  });

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  $(document).on("click", ".remove-practice-files", function () {
    let id = $(this).data("id");
    let topic = $(this).data("topic");
    let file = $(this).data("file");
    let response = confirm("Are you sure you want to perform this action ?");
    if (response) {
      $.ajax({
        type: "POST",
        url: "/admin/remove-practice-file",
        data: {
          id,
          topic,
          file,
        },
        success: function (response) {
          if (response == 1) {
            $("#practice-files-row").load(
              location.href + " #practice-files-row>*",
              ""
            );
          } else {
            alert("Something went wrong! Please try again!");
          }
        },
        erorr: function (response) {
          alert("Something went wrong! Please try again!");
        },
      });
    }
  });
  //Product
  $("#add-product-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#title").val().trim() === "") {
      $("#title").after('<span class="error">This is required value</span>');
      error = true;
    }
    if ($("#productExcerpt").val().trim() === "") {
      $("#productExcerpt").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#actualPriceINR").val().trim() === "") {
      $("#actualPriceINR").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#discountedPriceINR").val().trim() === "") {
      $("#discountedPriceINR").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    } else if (
      parseInt($("#discountedPriceINR").val().trim()) >
      parseInt($("#actualPriceINR").val().trim())
    ) {
      $("#discountedPriceINR").after(
        '<span class="error">Discounted price should not be greater than actual price.</span>'
      );
      error = true;
    }
    if ($("#productLanguages").val().length === 0) {
      $(".productLanguages").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#productLevels").val().length === 0) {
      $(".productLevels").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#productCategory").val().trim() === "") {
      $("#productCategory").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if (!$("#thumbnail")[0].files[0]) {
      $(".thumbnail").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#thumbnailVideo").val().trim() === "") {
      $("#thumbnailVideo").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#productBenefits").val().trim() === "") {
      $(".productBenefits").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $(".descp-container").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if (imgArray.length === 0) {
      $(".upload__box").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#HSN").val().trim() === "") {
      $("#HSN").after('<span class="error">This is required value</span>');
      error = true;
    }
    if ($("#quantityInStock").val().trim() === "") {
      $("#quantityInStock").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      var formData = new FormData();
      imgArray.forEach((i) => {
        formData.append("productGallery", i);
      });
      formData.append("title", $("#title").val().trim());
      formData.append("productExcerpt", $("#productExcerpt").val().trim());
      formData.append("actualPriceINR", $("#actualPriceINR").val().trim());
      formData.append(
        "discountedPriceINR",
        $("#discountedPriceINR").val().trim()
      );
      formData.append(
        "productLanguages",
        JSON.stringify($("#productLanguages").val())
      );
      formData.append(
        "productLevels",
        JSON.stringify($("#productLevels").val())
      );
      formData.append("productCategory", $("#productCategory").val().trim());
      formData.append("thumbnail", $("#thumbnail")[0].files[0]);
      formData.append("thumbnailVideo", $("#thumbnailVideo").val().trim());
      formData.append("productBenefits", $("#productBenefits").val().trim());
      formData.append("description", $("#description").val().trim());
      formData.append("status", $("#status").is(":checked"));
      formData.append("HSN", $("#HSN").val().trim());
      formData.append("quantityInStock", $("#quantityInStock").val().trim());
      $.ajax({
        type: "POST",
        url: "/admin/products/add",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
          sessionStorage.setItem("success", "Product added successfully!");
          location.reload();
        },
        error: function () {
          sessionStorage.setItem("error", "Unable to add Product! ");
          location.reload();
        },
      });
    }
  });

  $("#edit-product-btn").on("click", function () {
    var error = false;
    $(".error").remove();
    if ($("#title").val().trim() === "") {
      $("#title").after('<span class="error">This is required value</span>');
      error = true;
    }
    if ($("#productExcerpt").val().trim() === "") {
      $("#productExcerpt").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#actualPriceINR").val().trim() === "") {
      $("#actualPriceINR").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#discountedPriceINR").val().trim() === "") {
      $("#discountedPriceINR").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    } else if (
      parseInt($("#discountedPriceINR").val().trim()) >
      parseInt($("#actualPriceINR").val().trim())
    ) {
      $("#discountedPriceINR").after(
        '<span class="error">Discounted price should not be greater than actual price.</span>'
      );
      error = true;
    }
    if ($("#productLanguages").val().length === 0) {
      $(".productLanguages").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#productLevels").val().length === 0) {
      $(".productLevels").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#productCategory").val().trim() === "") {
      $("#productCategory").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#thumbnailVideo").val().trim() === "") {
      $("#thumbnailVideo").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#productBenefits").val().trim() === "") {
      $(".productBenefits").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $(".descp-container").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if ($("#HSN").val().trim() === "") {
      $("#HSN").after('<span class="error">This is required value</span>');
      error = true;
    }
    if ($("#quantityInStock").val().trim() === "") {
      $("#quantityInStock").after(
        '<span class="error">This is required value</span>'
      );
      error = true;
    }
    if (error) {
      return false;
    } else {
      var productId = $(this).data("id");
      var formData = new FormData();
      imgArray.forEach((i) => {
        formData.append("productGallery", i);
      });
      formData.append("title", $("#title").val().trim());
      formData.append("productExcerpt", $("#productExcerpt").val().trim());
      formData.append("actualPriceINR", $("#actualPriceINR").val().trim());
      formData.append(
        "discountedPriceINR",
        $("#discountedPriceINR").val().trim()
      );
      formData.append(
        "productLanguages",
        JSON.stringify($("#productLanguages").val())
      );
      formData.append(
        "productLevels",
        JSON.stringify($("#productLevels").val())
      );
      formData.append("productCategory", $("#productCategory").val().trim());
      formData.append("thumbnail", $("#thumbnail")[0].files[0]);
      formData.append("thumbnailVideo", $("#thumbnailVideo").val().trim());
      formData.append("productBenefits", $("#productBenefits").val().trim());
      formData.append("description", $("#description").val().trim());
      formData.append("status", $("#status").is(":checked"));
      formData.append("HSN", $("#HSN").val().trim());
      formData.append("quantityInStock", $("#quantityInStock").val().trim());

      $.ajax({
        type: "PUT",
        url: `/admin/product/${productId}`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
          sessionStorage.setItem("success", "Product  Updated successfully!");
          location.reload();
        },
        error: function () {
          sessionStorage.setItem("error", "Unable to edit Product!");
          location.reload();
        },
      });
    }
  });

  // Banner
  $("#add-banner-btn").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    // if($('#offerItems').val() === null) {
    //     $('#offerItems').after(errMessage)
    //     error = true
    // }
    if ($("#bannerImage")[0].files.length === 0) {
      $("#gallery").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  $("#edit-banner-btn").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    // if($('#editOfferItems').val() === null) {
    //     $('#editOfferItems').after(errMessage)
    //     error = true
    // }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  $("#offerItems").on("change", function () {
    $("#offerItemType").val($(this).find(":selected").data("type"));
  });

  $("#editOfferItems").on("change", function () {
    $("#editOfferItemType").val($(this).find(":selected").data("type"));
  });

  // HELP
  $("#add-help-btn").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#videoLink").val().trim() === "") {
      $("#videoLink").after(errMessage);
      error = true;
    }
    if ($("#summernote").val() === "") {
      $("#desc").after(errMessage);
      error = true;
    }
    if ($("#posterImage")[0].files.length === 0) {
      $("#gallery").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  $("#edit-help-btn").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#videoLink").val().trim() === "") {
      $("#videoLink").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // summernore
  var $editor = $("#summernote");
  $editor.summernote({
    tabsize: 2,
    height: 100,
    callbacks: {
      onImageUpload: function (files) {

        let formData = new FormData();
        formData.append("stepImage", files[0]);

        $.ajax({
          type: "POST",
          url: "/admin/help/add-help-file",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function (res) {
            if (res.production === "development") {
              var imgNode = $(`<img data-id="${res.filename}">`).attr(
                "src",
                `http://localhost:8000/uploads/help/stepImage/${res.filename}`
              );
            } else {
              var imgNode = $(`<img data-id="${res.filename}">`).attr(
                "src",
                `https://admin.coursepe.com/uploads/help/stepImage/${res.filename}`
              );
            }
            $editor.summernote("insertNode", imgNode[0]);
            $(".note-image-input").val("");
          },
          error: function (res) {
            return false;
          },
        });
      },
      onMediaDelete: function (target) {
        $.ajax({
          type: "DELETE",
          url: `/admin/help/delete-help-file/${$(target[0]).attr("data-id")}`,
          success: function (res) {
            console.log(res);
          },
          error: function (res) {
            return false;
          },
        });
      },
    },
    toolbar: [
      ["style", ["style"]],
      ["font", ["bold", "italic", "underline", "clear"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear",
        ],
      ],
      ["fontname", ["fontname"]],
      ["fontsize", ["fontsize"]],
      ["color", ["color"]],
      ["para", ["ul", "ol", "paragraph"]],
      ["height", ["height"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "hr"]],
      ["view", ["fullscreen", "codeview"]],
      ["help", ["help"]],
    ],
  });

  // Contact Modal
  $(".contactShow").on("click", function () {
    let modalData = `<p class="mb-3"><strong>Name: </strong>${$(this).attr(
      "data-name"
    )}</p>
        <p class="mb-3"><strong>Email: </strong><a href="mailto:${$(this).attr(
          "data-email"
        )}">${$(this).attr("data-email")}</a></p>
        <p class="mb-3"><strong>Number: </strong><a href="tel:+91${$(this).attr(
          "data-number"
        )}">${$(this).attr("data-number")}</a></p>
        <p class="mb-3"><strong>Subject: </strong>${$(this).attr(
          "data-subject"
        )}</p>
        <p class="mb-3"><strong>Discription: </strong>${$(this).attr(
          "data-description"
        )}</p>`;

    $("#contactModal .modal-body").html(modalData);

    $("#contactModal").modal("show");
  });

  // question edit
  $("#edit-ques-btn").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#question").val().trim() === "") {
      $("#question").after(errMessage);
      error = true;
    }
    if ($("#optionOne").val().trim() === "") {
      $("#optionOne").after(errMessage);
      error = true;
    }
    if ($("#optionTwo").val().trim() === "") {
      $("#optionTwo").after(errMessage);
      error = true;
    }
    if ($("#optionThree").val().trim() === "") {
      $("#optionThree").after(errMessage);
      error = true;
    }
    if ($("#optionFour").val().trim() === "") {
      $("#optionFour").after(errMessage);
      error = true;
    }
    if ($("#answer").val().trim() === "") {
      $("#answer").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // Announcement Add
  $("#addAnnouncement").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#announcement").val().trim() === "") {
      $("#announcement").after(errMessage);
      error = true;
    }
    if ($("#status").val().trim() === "") {
      $("#status").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // Announcement Edit
  $("#editAnnouncement").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#announcement").val().trim() === "") {
      $("#announcement").after(errMessage);
      error = true;
    }
    if ($("#status").val().trim() === "") {
      $("#status").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  //Video validation
  $("#add-video").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#videoId").val().trim() === "") {
      $(".videoid-wrapper").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // Course
  $("#add-course").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#courseExcerpt").val().trim() === "") {
      $("#courseExcerpt").after(errMessage);
      error = true;
    }
    if ($("#discountedPriceINR").val().trim() === "") {
      $("#discountedPriceINR").after(errMessage);
      error = true;
    }
    if ($("#actualPriceINR").val().trim() === "") {
      $("#actualPriceINR").after(errMessage);
      error = true;
    }
    if (
      parseInt($("#discountedPriceINR").val()) >
      parseInt($("#actualPriceINR").val())
    ) {
      $("#discountedPriceINR").after(
        '<span class="error">Discounted price cannot be more than actual price.</span>'
      );
      error = true;
    }
    if ($("#actualPriceUSD").val().trim() === "") {
      $("#actualPriceUSD").after(errMessage);
      error = true;
    }
    if ($("#discountedPriceUSD").val().trim() === "") {
      $("#discountedPriceUSD").after(errMessage);
      error = true;
    }
    if (
      parseInt($("#discountedPriceUSD").val()) >
      parseInt($("#actualPriceUSD").val())
    ) {
      $("#discountedPriceUSD").after(
        '<span class="error">Discounted price cannot be more than actual price.</span>'
      );
      error = true;
    }
    if ($("#thumbnailVideo").val().trim() === "") {
      $("#thumbnailVideo").after(errMessage);
      error = true;
    }
    if ($("#courseBenefits").val().trim() === "") {
      $("#courseBenefits").after(errMessage);
      error = true;
    }
    if ($("#materialsInclude").val().trim() === "") {
      $("#materialsInclude").after(errMessage);
      error = true;
    }
    if ($("#courseDuration").val().trim() === "") {
      $("#courseDuration").after(errMessage);
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $("#description").after(errMessage);
      error = true;
    }
    if ($("#thumbnailImage")[0].files.length === 0) {
      $("#gallery").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  $("#edit-course").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#courseExcerpt").val().trim() === "") {
      $("#courseExcerpt").after(errMessage);
      error = true;
    }
    if ($("#discountedPriceINR").val().trim() === "") {
      $("#discountedPriceINR").after(errMessage);
      error = true;
    }
    if ($("#actualPriceINR").val().trim() === "") {
      $("#actualPriceINR").after(errMessage);
      error = true;
    }
    if ($("#actualPriceUSD").val().trim() === "") {
      $("#actualPriceUSD").after(errMessage);
      error = true;
    }
    if ($("#discountedPriceUSD").val().trim() === "") {
      $("#discountedPriceUSD").after(errMessage);
      error = true;
    }
    if (
      parseInt($("#discountedPriceINR").val()) >
      parseInt($("#actualPriceINR").val())
    ) {
      $("#discountedPriceINR").after(
        '<span class="error">Discounted price cannot be more than actual price.</span>'
      );
      error = true;
    }
    if (
      parseInt($("#discountedPriceUSD").val()) >
      parseInt($("#actualPriceUSD").val())
    ) {
      $("#discountedPriceUSD").after(
        '<span class="error">Discounted price cannot be more than actual price.</span>'
      );
      error = true;
    }
    if ($("#thumbnailVideo").val().trim() === "") {
      $("#thumbnailVideo").after(errMessage);
      error = true;
    }
    if ($("#courseBenefits").val().trim() === "") {
      $("#courseBenefits").after(errMessage);
      error = true;
    }
    if ($("#materialsInclude").val().trim() === "") {
      $("#materialsInclude").after(errMessage);
      error = true;
    }
    if ($("#courseDuration").val().trim() === "") {
      $("#courseDuration").after(errMessage);
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $("#description").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // Topics
  $("#add-topic").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#excerpt").val().trim() === "") {
      $("#excerpt").after(errMessage);
      error = true;
    }
    if ($("#description-anchor").val().trim() === "") {
      $("#description-anchor").after(errMessage);
      error = true;
    }

    if ($("#lessonTitle").val().trim() === "") {
      $("#lessonTitle").after(errMessage);
      error = true;
    }
    if ($("#lessonLink").val().trim() === "") {
      $("#lessonLink").after(errMessage);
      error = true;
    }
    if ($("#lessonTime").val().trim() === "") {
      $("#lessonTime").after(errMessage);
      error = true;
    }
    if ($("#lessonDescription").val().trim() === "") {
      $("#desc").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  $("#edit-topic").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#excerpt").val().trim() === "") {
      $("#excerpt").after(errMessage);
      error = true;
    }
    if ($("#description-anchor").val().trim() === "") {
      $("#description-anchor").after(errMessage);
      error = true;
    }
    if ($("#lessonTitle").val().trim() === "") {
      $("#lessonTitle").after(errMessage);
      error = true;
    }
    if ($("#lessonLink").val().trim() === "") {
      $("#lessonLink").after(errMessage);
      error = true;
    }
    if ($("#lessonTime").val().trim() === "") {
      $("#lessonTime").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // Get Random Colors
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Admin Home Douhnnut Charts
  if ($("#chartjs-doughnut-chart").length) {
    /* -- Chartjs - Doughnut Chart -- */
    let values = $("#chartjs-doughnut-chart").attr("data-values").split(",");
    let labels = $("#chartjs-doughnut-chart").attr("data-labels").split(",");
    let colors = [];
    for (let i = 0; i <= values.length; i++) {
      colors.push(getRandomColor());
    }
    var doughnutChartID = document
      .getElementById("chartjs-doughnut-chart")
      .getContext("2d");
    var doughnutChart = new Chart(doughnutChartID, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: values,
            borderColor: "transparent",
            backgroundColor: colors,
          },
        ],
        labels: labels.map((item) => item.toUpperCase()),
      },
      options: {
        responsive: true,
        cutoutPercentage: 55,
        legend: {
          position: "right",
        },
        title: {
          display: false,
          text: "Different Sources Of Purchase",
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            label: function (tooltipItems, data) {
              return `${data.labels[tooltipItems.index]}: ${
                data.datasets[0].data[tooltipItems.index]
              } %`;
            },
          },
        },
      },
    });
  }

  // Admin Home Pie Charts
  if ($("#chartjs-pie-chart").length) {
    let values = $("#chartjs-pie-chart").attr("data-values").split(",");
    let labels = $("#chartjs-pie-chart").attr("data-labels").split(",");
    let colors = [];
    for (let i = 0; i <= values.length; i++) {
      colors.push(getRandomColor());
    }

    var pieChartID = document
      .getElementById("chartjs-pie-chart")
      .getContext("2d");
    var pieChart = new Chart(pieChartID, {
      type: "pie",
      data: {
        datasets: [
          {
            data: values,
            borderColor: "transparent",
            backgroundColor: colors,
            label: "Dataset 1",
          },
        ],
        labels: labels.map((label) => label.toUpperCase()),
      },
      options: {
        responsive: true,
        legend: {
          position: "right",
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            label: function (tooltipItems, data) {
              return `${data.labels[tooltipItems.index]}: ${
                data.datasets[0].data[tooltipItems.index]
              } %`;
            },
          },
        },
      },
    });
  }

  // Custom functions starts

  function insertParam(key, value) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    // kvp looks like ['key1=value1', 'key2=value2', ...]
    var kvp = document.location.search.substr(1).split("&");
    let i = 0;

    for (; i < kvp.length; i++) {
      if (kvp[i].startsWith(key + "=")) {
        let pair = kvp[i].split("=");
        pair[1] = value;
        kvp[i] = pair.join("=");
        break;
      }
    }

    if (i >= kvp.length) {
      kvp[kvp.length] = [key, value].join("=");
    }

    // can return this or...
    let params = kvp.join("&");

    // reload page with new params
    document.location.search = params;
  }

  // Custom functions ends

  // Pagination starts

  $(".page-link-custom").on("click", function () {
    let page = $(this).attr("data-page");
    insertParam("page", page);
  });

  // Pagination endss

  // Search starts
  $("#search-btn").on("click", function () {
    let search = $("#search").val();
    insertParam("search", search);
  });
  // Search ends

  // Event listener to the two range filtering inputs to redraw on input
  // $("#date_range").daterangepicker({
  //   startDate: $("#date_range").attr("data-startDate"),
  //   endDate: $("#date_range").attr("data-endDate"),
  //   autoApply: false,
  //   // 'autoUpdateInput': false,
  //   locale: {
  //     format: "DD/MM/YYYY",
  //   },
  //   ranges: {
  //     Today: [moment(), moment()],
  //     Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
  //     "Last 7 Days": [moment().subtract(6, "days"), moment()],
  //     "Last 30 Days": [moment().subtract(29, "days"), moment()],
  //     "This Month": [moment().startOf("month"), moment().endOf("month")],
  //     "Last Month": [
  //       moment().subtract(1, "month").startOf("month"),
  //       moment().subtract(1, "month").endOf("month"),
  //     ],
  //   },
  //   showDropdowns: true,
  //   linkedCalendars: false,
  // });

  $("#date_range").on("cancel.daterangepicker", function (ev, picker) {
    //do something, like clearing an input
    $(this).val("");
  });

  $("#date_range").on("apply.daterangepicker", function (ev, picker) {
    let date = $(this).val();
    insertParam("date", date);
  });

  $("#course").on("change", function () {
    insertParam("course", $(this).val());
  });

  $("#product").on("change", function () {
    insertParam("product", $(this).val());
  });

  $("#bundle").on("change", function () {
    insertParam("bundle", $(this).val());
  });

  $(".clear-filters").on("click", function () {
    window.location = window.location.href.split("?")[0];
  });

  //exports purchase by filter values
  $(".export").on("click", function () {
    if ($(this).data("type") == "admin") {
      const url = window.location.href.replace(
        "/admin-purchases",
        "/purchases/export"
      );
      var newUrl = new URL(url);
      newUrl.searchParams.append("type", "admin");
      window.location.href = newUrl;
    } else {
      const url = window.location.href.replace(
        "purchases",
        "/purchases/export"
      );
      window.location.href = url;
    }
  });

  // TESTIMONIALS VALIDATION

  $("#addTestimonials").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#name").val().trim() === "") {
      $("#name").after(errMessage);
      error = true;
    }
    if ($("#designation").val().trim() === "") {
      $("#designation").after(errMessage);
      error = true;
    }
    if ($("#testDescription").val().trim() === "") {
      $("#testDescription").after(errMessage);
      error = true;
    }
    if ($("#testimonialProfile")[0].files.length === 0) {
      $("#gallery").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  $("#editTestimonials").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#name").val().trim() === "") {
      $("#name").after(errMessage);
      error = true;
    }
    if ($("#designation").val().trim() === "") {
      $("#designation").after(errMessage);
      error = true;
    }
    if ($("#testDescription").val().trim() === "") {
      $("#testDescription").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  //course bundle
  $("#add-course-bundle").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage =
      '<span class="error d-block">This field is required.</span>';

    if ($("#title").val().trim() === "") {
      $("#title").after(errMessage);
      error = true;
    }
    if ($("#excerpt").val().trim() === "") {
      $("#excerpt").after(errMessage);
      error = true;
    }
    if ($("#discountedPriceINR").val().trim() === "") {
      $("#discountedPriceINR").after(errMessage);
      error = true;
    }
    if ($("#actualPriceINR").val().trim() === "") {
      $("#actualPriceINR").after(errMessage);
      error = true;
    }
    if ($("#actualPriceUSD").val().trim() === "") {
      $("#actualPriceUSD").after(errMessage);
      error = true;
    }
    if ($("#discountedPriceUSD").val().trim() === "") {
      $("#discountedPriceUSD").after(errMessage);
      error = true;
    }
    if (
      parseInt($("#discountedPriceINR").val()) >
      parseInt($("#actualPriceINR").val())
    ) {
      $("#discountedPriceINR").after(
        '<span class="error">Discounted price cannot be more than actual price.</span>'
      );
      error = true;
    }
    if (
      parseInt($("#discountedPriceUSD").val()) >
      parseInt($("#actualPriceUSD").val())
    ) {
      $("#discountedPriceUSD").after(
        '<span class="error">Discounted price cannot be more than actual price.</span>'
      );
      error = true;
    }
    if ($("#bundleBenefits").val().trim() === "") {
      $("#bundleBenefits").after(errMessage);
      error = true;
    }
    if ($("#materialsInclude").val().trim() === "") {
      $("#materialsInclude").after(errMessage);
      error = true;
    }
    if ($("#bundleDuration").val().trim() === "") {
      $("#bundleDuration").after(errMessage);
      error = true;
    }
    if (!$("#bundleLanguage").val().length) {
      $(".language-wrapper").after(errMessage);
      error = true;
    }
    if (!$("#courses").val().length) {
      $(".courses-wrapper").after(errMessage);
      error = true;
    }
    if ($("#description").val().trim() === "") {
      $(".desc-wrapper").after(errMessage);
      error = true;
    }

    if (error) {
      return false;
    } else {
      return true;
    }
  });

  // edit-approved-review
  $("#edit-approved-review").on("click", function () {
    $(".error").remove();
    var error = false;
    let errMessage = '<span class="error">This field is required.</span>';

    if ($("#rating").val().trim() === "") {
      $("#rating").after(errMessage);
      error = true;
    }
    if ($("#rating").val() > 5) {
      $("#rating").after(
        '<span class="error">Rating must be less than 5.</span>'
      );
      error = true;
    }
    if ($("#status").val().trim() === "") {
      $("#status").after(errMessage);
      error = true;
    }
    if ($("#review").val().trim() === "") {
      $("#review").after(errMessage);
      error = true;
    }

    return !error;
  });

  $("#data").on("change", function () {
    if ($(this).val() === "") {
      $("#url").removeAttr("disabled");
    } else {
      $("#url").val("");
      $("#url").attr("disabled", "true");
    }
  });

  //

  //

  //

  //

  //

  //

  //   -------------------------------------------------- NEW --------------------------------------------------- //
  function setPreview(url, selector) {
    $(selector).parent().addClass("has-preview");
    let preview = $(selector).parent().find(".dropify-preview");
    $(preview).css("display", "block");

    $($(preview).children()[0]).html(
      `<img src="${url}" style="max-height: 170px;">`
    );
    $(
      $(
        $($($(preview).children()[1]).children()[0]).children()[0]
      ).children()[1]
    ).text(url.split("/").at(-1));
  }

  // Creator Reset password
  $(".reset_password").on("click", function () {
    $(".err-message").remove();
    const resetToken = window.location.href.split("/").at(-1);
    const password = $("#password").val().trim();
    const confirmPassword = $("#confirmPassword").val().trim();
    const errMessage =
      '<small class="text-danger err-message">This field is required</small>';

    if (!password || !confirmPassword) {
      $("#password").after(errMessage);
      $("#confirmPassword").after(errMessage);
      return false;
    }

    $.ajax({
      type: "PUT",
      url: `/api/creator/auth/reset-password/${resetToken}`,
      data: {
        password,
        confirmPassword,
      },
      success: function (response) {
        if (response === "OK") {
          window.location.href = "/api/creator/auth/login";
        }
      },
      error: function () {
        console.log("failed");
      },
    });
  });

  // Add Course
  $(".course_add").on("click", function () {
    
    $(".err-message").remove();
    const title = $("#title").val().trim();
    const excerpt = $("#excerpt").val().trim();
    const price = $("#price").val().trim();
    const discountedPrice = $("#discountedPrice").val().trim();
    const level = $("#level").val().trim();
    const access = $("#access").val().trim();
    const category = $("#category").val();
    const language = $("#language").val();
    const errMessage =
      "<small class='text-danger err-message'>This field is required.</small>";
    let hasError = false;

    if (!title) {
      $("#title").after(errMessage);
      hasError = true;
    }
    if (!excerpt) {
      $("#excerpt").after(errMessage);
      hasError = true;
    }
    if (!price) {
      $("#price").after(errMessage);
      hasError = true;
    }
    if (!discountedPrice) {
      $("#discountedPrice").after(errMessage);
      hasError = true;
    }
    if (parseFloat(price) < parseFloat(discountedPrice)) {
      $("#discountedPrice").after("<small class='text-danger err-message'>Discounted price should be less than actual price.</small>");
      hasError = true;
    }
    if (!level) {
      $("#level").after(errMessage);
      hasError = true;
    }
    if (!access) {
      $("#access").after(errMessage);
      hasError = true;
    }
    if (!category) {
      $("#category").after(errMessage);
      hasError = true;
    }
    if (language.length === 0) {
      $("#language").after(errMessage);
      hasError = true;
    }
    if (hasError) {
      return false;
    } else {
      return true;
    }
  });

  // Add Language
  $(".add_language").on("click", function () {
    $(".err-message").remove();
    const language = $("#language_input").val().trim();
    if (!language) {
      $("#language").after(
        "<small class='text-danger err-message'>This field is required.</small>"
      );
      return false;
    }

    return true;
  });

  // add language using ajax
  $('.add_language_using_ajax').on('click', function() {
    $(".err-message").remove();
    const language = $("#language_input").val().trim();
    if (!language) {
      $("#language").after(
        "<small class='text-danger err-message'>This field is required.</small>"
      );
    }

    $.ajax({
      type: "POST",
      url: `/api/creator/course/language/add?type=autoset`,
      data: {
        language
      },
      success: function ({language, success}) {
        if (success) {
          $('#languageModal input').val('')
          $('#languageModal').modal('hide')
          $('#language').load(location.href + ' #language>*', "")
          // setTimeout(() => {
          //   $('#language option').each(function(){
          //     if($(this).val() === language){
          //       // Set option here
          //     }
          //   })
          // },500)
        }
      },
      error: function (err) {
        console.log("failed");
      },
    });
  })

  //Edit Language
  $(".edit_course_language").on("click", function () {
    let languageId = $(this).data("id");
    let languageName = $(this).data("name");
    $("#editLanguageModal #language").val(languageName);
    $(".language-edit-form").attr(
      "action",
      `/api/creator/course/language/${languageId}?_method=PUT`
    );
    $("#editLanguageModal").modal("show");
  });

  //Delete Language
  $(".delete_course_language").on("click", function () {
    let languageId = $(this).data("id");
    $(".delete_language_form").attr(
      "action",
      `/api/creator/course/language/${languageId}?_method=DELETE`
    );
  });

  $('.restore_course_btn').on('click', function() {
    let id = $(this).data('id')
    let url = `/api/creator/course/${id}/restore-deleted-course?_method=PUT`
    $('.restore_course_form').attr('action', url)
  })

  //Add Category
  $(".add_category").on("click", function () {
    $(".err-message").remove();
    const title = $("#title").val().trim();
    const excerpt = $("#excerpt").val().trim();
    const icon = $("#categoryIcon").val().trim();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!excerpt) {
      error = true;
      $("#excerpt").after(errMessage);
    }
    if (!icon) {
      error = true;
      $("#categoryIcon").parent().before(errMessage);
    }

    return !error;
  });

  // Add Category using ajax
  $('.add_category_using_ajax').on('click', function() {
    $(".err-message").remove();
    const title = $("#title_category").val().trim();
    const excerpt = $("#excerpt_category").val().trim();
    const icon = $("#categoryIcon").val().trim();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    if (!title) {
      error = true;
      $("#title_category").after(errMessage);
    }
    if (!excerpt) {
      error = true;
      $("#excerpt_category").after(errMessage);
    }
    if (!icon) {
      error = true;
      $("#categoryIcon").parent().before(errMessage);
    }

    if(!error){
      let formData = new FormData();
      formData.append('title', title)
      formData.append('excerpt', excerpt)
      formData.append('categoryIcon', $("#categoryIcon")[0].files[0])
      $.ajax({
      type: "POST",
      url: `/api/creator/course/category/add?type=autoset`,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
        success: function ({category, success}) {
          if (success) {
            $('#categoryModal #title').val('')
            $('#categoryModal #excerpt').val('')
            $('#categoryModal .dropify-clear').click()
            $('#categoryModal').modal('hide')

            $('#category').load(location.href + ' #category>*', "")
            setTimeout(() => {
              $('#category option').each(function(){
                if($(this).val() === category){
                  $(this).prop('selected', true)
                }
              })
            },500)
          }
        },
        error: function (err) {
          console.log("failed");
        },
      });
    }
  })

  // Edit category
  $(".edit_category_btn").on("click", function () {
    const id = $(this).data("id");
    const title = $(this).data("title");
    const excerpt = $(this).data("excerpt");
    const icon = $(this).data("category-icon");

    $("#editCategoryModal #title").val(title);
    $("#editCategoryModal #excerpt").val(excerpt);
    if(icon) {
      $("#editCategoryModal #category-image").attr("src", icon);
    }

    $(".edit_category_form").attr(
      "action",
      `/api/creator/course/category/${id}?_method=PUT`
    );

    $("#editCategoryModal").modal("show");
  });

  // Delete course Category
  $(".delete_course_category_btn").on("click", function () {
    const id = $(this).data("id");
    $("#delete_course_category_form").attr(
      "action",
      `/api/creator/course/category/${id}?_method=DELETE`
    );
  });

  // Update course basic details
  $(".course_basic_details").on("click", function () {
    $(".err-message").remove();
    const title = $("#courseTitle").val().trim();
    const excerpt = $("#courseExcerpt").val().trim();
    const category = $("#category").val().trim();
    const level = $("#level").val().trim();
    const access = $("#access").val().trim();
    const language = $("#language").val();
    const price = $("#price").val().trim();
    const discountedPrice = $("#discountedPrice").val().trim();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    if (!title) {
      error = true;
      $("#courseTitle").after(errMessage);
    }
    if (!excerpt) {
      error = true;
      $("#courseExcerpt").after(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }
    if (!level) {
      error = true;
      $("#level").after(errMessage);
    }
    if (!access) {
      error = true;
      $("#access").after(errMessage);
    }
    if (!language) {
      error = true;
      $("#language").after(errMessage);
    }
    if (!price) {
      error = true;
      $("#price").after(errMessage);
    }
    if (!discountedPrice) {
      error = true;
      $("#discountedPrice").after(errMessage);
    }
    if (parseFloat(price) < parseFloat(discountedPrice)) {
      error = true;
      $("#discountedPrice").after("<small class='text-danger err-message'>Discounted price must be less than actual price.</small>");
    }
    return !error;
  });

  // update course descriptions
  $(".course_description_details").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;
    const description = $("#description").val().trim();
    // const thumbnailImage = $("#thumbnailImage").val().trim();
    const thumbnailVideo = $("#thumbnailVideo").val().trim();
    const courseBenefits = $("#courseBenefits").val().trim();
    const materialsIncludes = $("#materialsIncludes").val().trim();
    const instructorName = $("#instructorName").val();
    if (!description) {
      $("#description").before(errMessage);
      error = true;
    }
    // if (!thumbnailImage) {
    //   error = true;
    //   $("#thumbnailImage").parent().after(errMessage);
    // }
    if (!thumbnailVideo) {
      error = true;
      $("#thumbnailVideo").before(errMessage);
    }
    if (!courseBenefits) {
      error = true;
      $("#courseBenefits").before(errMessage);
    }
    if (!materialsIncludes) {
      error = true;
      $("#materialsIncludes").before(errMessage);
    }
    if (!instructorName) {
      error = true;
      $("#instructorName").after(errMessage);
    }

    return !error;
  });

  // update course seo
  $(".course_seo_details").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const coursePageUrl = $("#coursePageUrl").val().trim();

    if (!coursePageUrl) {
      error = true;
      $("#coursePageUrl").parent().before(errMessage);
    }

    return !error;
  });

  // TOPIC
  // Create section
  $(".create_section_btn").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;
    const title = $("#sectionTitle").val().trim();
    const description = $("#description").val().trim();

    if (!title) {
      error = true;
      $("#sectionTitle").before(errMessage);
    }
    if (!description) {
      error = true;
      $("#description").before(errMessage);
    }

    return !error;
  });

  $("#section_edit_form").on("submit", function () {
    $(".err-message").remove();
    let error = false;
    $(this)
      .serializeArray()
      .forEach((ip) => {
        if (ip.name !== "videoLink" && (!ip.value || !ip.value.trim())) {
          error = true;
        }
      });

    if (error) {
      $("#section_edit_form").after(
        `<small class='text-danger err-message'>All field is required.</small>`
      );
      return false;
    } else {
      return true;
    }
  });

  // Add Topic
  $("#toggle-practice-file").on("click", function () {
    if ($("#resources").hasClass("show")) {
      $(this).next().addClass("d-none");
    } else {
      $(this).next().removeClass("d-none");
    }
  });
  $("#toggle-practice-file-edit").on("click", function () {
    if ($("#topic-edit-form #resources").hasClass("show")) {
      $(this).next().addClass("d-none");
    } else {
      $(this).next().removeClass("d-none");
    }
  });

  $("#add-practice-links").on("click", function () {
    let _html = `
    <div class="row align-items-center mt-2">
    <div class="col-sm-11">
    <input type="text" placeholder="Enter Link" class="form-control" name="practiceLink" id="resources-link" />
    </div>
    <div class="col-sm-1 pl-sm-2">
    <button type="button" class="btn btn-danger delete-practice-link">
    <i class="feather icon-x"></i>
    </button>
    </div>
    </div>
    `;
    $(this).parent().parent().append(_html);
  });

  $(document).on("click", ".delete-practice-link", function () {
    $(this).parent().parent().remove();
  });

  $("#add-practice-file").on("click", function () {
    let _html = `
    <div class="row align-items-center mt-2">
    <div class="col-sm-11">
    <input type="file" name="practiceFiles" id="resources" data-show-remove="false" class="dropify" data-height="150" />
    </div>
    <div class="col-sm-1 pl-sm-2">
    <button type="button" class="btn btn-danger delete-practice-file">
    <i class="feather icon-x"></i>
    </button>
    </div>
    </div>
    `;
    $(this).parent().parent().append(_html);
    $(".dropify").dropify();
  });

  $(document).on("click", ".delete-practice-file", function () {
    $(this).parent().parent().remove();
  });

  $("#edit-practice-links").on("click", function () {
    let _html = `
    <div class="row align-items-center mt-2">
    <div class="col-sm-11">
    <input type="text" placeholder="Enter Link" class="form-control" name="practiceLink" id="resources-link" />
    </div>
    <div class="col-sm-1 pl-sm-2">
    <button type="button" class="btn btn-danger delete-practice-link-edit">
    <i class="feather icon-x"></i>
    </button>
    </div>
    </div>
    `;
    $(this).parent().parent().append(_html);
  });

  $(document).on("click", ".delete-practice-link-edit", function () {
    $(this).parent().parent().remove();
  });

  $("#edit-practice-file").on("click", function () {
    let _html = `
    <div class="row align-items-center mt-2">
      <div class="col-sm-11">
        <input type="file" name="practiceFiles" data-show-remove="false" id="resources" class="dropify" data-height="150" />
      </div>
      <div class="col-sm-1 pl-sm-2">
        <button type="button" class="btn btn-danger delete-practice-file-edit">
          <i class="feather icon-x"></i>
        </button>
      </div>
    </div>
    `;
    $(this).parent().parent().append(_html);
    $(".dropify").dropify();
  });

  $(document).on("click", ".delete-practice-file-edit", function () {
    $(this).parent().parent().remove();
  });

  $(".topic_add_modal_btn").on("click", function () {
    let primaryLink = $("#topic-add-form").attr("action");
    let topicId = $(this).data("topic-id");
    $("#topic-add-form").attr(
      "action",
      `${primaryLink}/topic/${topicId}?_method=PUT&editType=topicAdd`
    );
  });

  $("#topic-add-form").on("submit", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const topicTitle = $("#topicTitle").val().trim();
    const textContent = $("#contentTypeText").is(":checked");
    const pdfContent = $("#contentTypePdf").is(":checked");
    const videoContent = $("#contentTypeVideo").is(":checked");
    const shortDescription = $("#shortDescription").val().trim();
    const pdfFile = $("#pdfFile").val().trim();
    const youtubePlatform = $("#sourceYoutube").is(":checked");
    const vimeoPlatform = $("#sourceVimeo").is(":checked");
    const customPlatform = $("#sourceCustom").is(":checked");
    const ytVideoLink = $("#ytVideoLink").val().trim();
    const videoLink = $("#videoLink").val().trim();
    const customVideo = $("#customVideo").val().trim();

    if (!topicTitle) {
      error = true;
      $("#topicTitle").after(errMessage);
    }

    // Content type text
    if (textContent) {
      if (!shortDescription) {
        error = true;
        $("#shortDescription").after(errMessage);
      }
    }
    // Content type pdf
    if (pdfContent) {
      if (!pdfFile) {
        error = true;
        $("#pdfFile").parent().after(errMessage);
      }
    }
    // content type video
    if (videoContent) {
      if (youtubePlatform) {
        if (!ytVideoLink) {
          error = true;
          $("#ytVideoLink").before(errMessage);
        }
      }
      if (vimeoPlatform) {
        if (!videoLink) {
          error = true;
          $("#videoLink").before(errMessage);
        }
      }
      if (customPlatform) {
        if (!customVideo) {
          error = true;
          $("#customVideo").parent().before(errMessage);
        }
      }
    }

    return !error;
  });

  // Edit Lesson
  const editContentTypeInput = document.querySelectorAll(
    '#topic-edit-form [name="contentType"]'
  );
  editContentTypeInput.forEach((el) => {
    el.addEventListener("click", (e) => {
      $("#editTextForm").removeClass("show");
      $("#editPdfForm").removeClass("show");
      $("#editVideoForm").removeClass("show");
      if (e.srcElement.id === "editContentTypeText") {
        $("#editTextForm").addClass("show");
      }
      if (e.srcElement.id === "editContentTypePdf") {
        $("#editPdfForm").addClass("show");
      }
      if (e.srcElement.id === "editContentTypeVideo") {
        $("#editVideoForm").addClass("show");
      }
    });
  });

  const editResourceTypeInput = document.querySelectorAll(
    '#topic-edit-form [name="platform"]'
  );
  editResourceTypeInput.forEach((el) => {
    el.addEventListener("click", (e) => {
      $("#video-youtube-edit").removeClass("show");
      $("#video-vimeo-edit").removeClass("show");
      $("#video-custom-edit").removeClass("show");
      if (e.srcElement.id === "editSourceYoutube") {
        $("#video-youtube-edit").addClass("show");
      }
      if (e.srcElement.id === "editSourceVimeo") {
        $("#video-vimeo-edit").addClass("show");
      }
      if (e.srcElement.id === "editSourceCustom") {
        $("#video-custom-edit").addClass("show");
      }
    });
  });

  $(".edit_lesson_btn").on("click", function () {
    const topic = $(this).data("form-fields");
    const topicId = $(this).data("topic-id");
    const backendUrl = $(this).data("backendurl");
    $("#practice_file_wrap").empty();

    let primaryLink = $("#topic-add-form").attr("action");
    $("#topic-edit-form").attr(
      "action",
      `${primaryLink}/topic/${topicId}?_method=PUT&editType=topicEdit&lessonId=${topic._id}`
    );
    $("#topic-edit-form #topicTitle").val(topic.title);
    $("#topic-edit-form #freeLesionEdit").prop("checked", topic.freeLesion);

    if (topic.contentType === "Text") {
      $("#topic-edit-form #editContentTypeText").prop("checked", true);
      $("#topic-edit-form #topicDescription").summernote(
        "code",
        topic.description
      );
      $("#topic-edit-form #url").val(topic.referenceUrl);
      $("#editPdfForm").removeClass("show");
      $("#editVideoForm").removeClass("show");
      $("#editTextForm").addClass("show");
    } else if (topic.contentType === "PDF") {
      $("#topic-edit-form #editContentTypePdf").prop("checked", true);
      $("#editTextForm").removeClass("show");
      $("#editVideoForm").removeClass("show");
      $("#editPdfForm").addClass("show");

      const fileInput = $("#topic-edit-form #pdfFile");
      let wrapper = fileInput.closest(".dropify-wrapper");
      let preview = wrapper.find(".dropify-preview");
      let filename = wrapper.find(".dropify-filename-inner");

      preview.css("display", "block");
      let render = wrapper
        .find(".dropify-render")
        .html(
          `<i class="dropify-font-file"></i><span class="dropify-extension">pdf</span>`
        );
      fileInput.val("").attr("title", topic.pdfFile);
      wrapper.removeClass("has-error").addClass("has-preview");
      filename.html(topic.pdfFile);
    } else if (topic.contentType === "Video") {
      $("#editTextForm").removeClass("show");
      $("#editPdfForm").removeClass("show");
      $("#editVideoForm").addClass("show");
      $("#topic-edit-form #editContentTypeVideo").prop("checked", true);

      if (topic.platform === "Youtube") {
        $("#topic-edit-form #editSourceYoutube").prop("checked", true);
        $("#video-vimeo-edit").removeClass("show");
        $("#video-custom-edit").removeClass("show");
        $("#video-youtube-edit").addClass("show");
        $("#topic-edit-form #ytVideoLink").val(topic.link);
      } else if (topic.platform === "Vimeo") {
        $("#topic-edit-form #editSourceVimeo").prop("checked", true);
        $("#video-youtube-edit").removeClass("show");
        $("#video-custom-edit").removeClass("show");
        $("#video-vimeo-edit").addClass("show");
        $("#topic-edit-form #videoLink").val(topic.link);
      } else if (topic.platform === "Custom") {
        $("#video-youtube-edit").removeClass("show");
        $("#video-vimeo-edit").removeClass("show");
        $("#video-custom-edit").addClass("show");
        $("#topic-edit-form #editSourceCustom").prop("checked", true);
        $("#topic-edit-form #setAsIntroEdit").prop("checked", topic.setAsIntro);

        const fileInput = $("#topic-edit-form #customVideo");
        let wrapper = fileInput.closest(".dropify-wrapper");
        let preview = wrapper.find(".dropify-preview");
        let filename = wrapper.find(".dropify-filename-inner");

        preview.css("display", "block");
        let render = wrapper
          .find(".dropify-render")
          .html(
            `<i class="dropify-font-file"></i><span class="dropify-extension">mp4</span>`
          );
        fileInput.val("").attr("title", topic.customVideo);
        wrapper.removeClass("has-error").addClass("has-preview");
        filename.html(topic.customVideo);
      }
    }

    // practice files
    if (Object.keys(topic.practiceFiles).length > 0) {
      $("#topic-edit-form #resources").addClass("show");
      $(".dynamic-link-wrap").remove();
      $(".dynamic-file-wrap").remove();
      topic.practiceFiles.link.forEach((link) => {
        $("._practice_link_wrapper").append(`
        <div class="row align-items-center mt-2 dynamic-link-wrap">
          <div class="col-sm-11">
            <input type="text" placeholder="Enter Link" class="form-control" value="${link}" name="practiceLink" id="resources-link" />
          </div>
          <div class="col-sm-1 pl-sm-2">
            <button type="button" class="btn btn-danger delete-practice-link-edit">
              <i class="feather icon-x"></i>
            </button>
          </div>
        </div>
        `);
      });

      topic.practiceFiles.files.forEach((filename) => {
        if (filename) {
          $("._practice_files_wrapper").append(`
          <div class="row align-items-center mt-2 dynamic-file-wrap">
            <div class="col-sm-11">
              <input 
              type="file" 
              name="practiceFiles" 
              id="resources" 
              class="dropify uploaded_practice_files" 
              data-height="150" 
              data-show-remove="false"
              data-default-file="${backendUrl}/uploads/topics/practice-files/${filename}"
              />
              <input type="hidden" name="practiceFiles" value="${filename}">
            </div>
            <div class="col-sm-1 pl-sm-2">
              <button type="button" class="btn btn-danger delete-practice-file-edit">
                <i class="feather icon-x"></i>
              </button>
            </div>
          </div>
          `);
        }
        $(".dropify").dropify();
      });
    }
  });

  // Uploaded practice file change
  $(document).on("change", ".uploaded_practice_files", function () {
    let filename = $(this).val().split("\\").at(-1);
    $(this).parent().next().val(filename);
  });

  // Delete Lesson
  $(".delete_lesson_btn").on("click", function () {
    let lessonId = $(this).data("lessonid");
    let courseId = $(this).data("courseid");
    let topicId = $(this).data("topicid");
    $(".lesson_delete_form").attr(
      "action",
      `/api/creator/course/${courseId}/topic/${topicId}?_method=DELETE&deleteType=lesson&lessonId=${lessonId}`
    );
  });

  // section delete
  $(".delete_section_btn").on("click", function () {
    let courseId = $(this).data("courseid");
    let topicId = $(this).data("topicid");
    $(".section_delete_form").attr(
      "action",
      `/api/creator/course/${courseId}/topic/${topicId}?_method=DELETE&deleteType=section`
    );
    $("#deleteSectionModal").modal("show");
  });

  $(".add-course-select").select2({
    dropdownParent: $("#courseModal"),
  });
  $(".add-level-select").select2({
    dropdownParent: $("#courseModal"),
  });
  $(".add_language_select").select2({
    dropdownParent: $("#defaultTabContentLine"),
  });
  $(".add_level_select").select2({
    dropdownParent: $("#defaultTabContentLine"),
  });
  $(".related-course-select").select2({
    dropdownParent: $("#pricing-line"),
  });
  $(".course-edit-select").select2({
    dropdownParent: $("#details-line"),
  });
  $(".course-edit-select2").select2({
    dropdownParent: $("#details-line2"),
  });
  $(".add-bundle-select").select2({
    dropdownParent: $("#details-line"),
  });

  // Course Bundle
  $("#createBundle").on("submit", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();
    const excerpt = $("#excerpt").val().trim();
    const price = $("#price").val().trim();
    const discountedPrice = $("#discountedPrice").val().trim();
    const level = $("#level").val().trim();
    const access = $("#access").val().trim();
    const language = $("#language").val();
    const category = $("#category").val().trim();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!excerpt) {
      error = true;
      $("#excerpt").after(errMessage);
    }
    if (!price) {
      error = true;
      $("#price").after(errMessage);
    }
    if (!discountedPrice) {
      error = true;
      $("#discountedPrice").after(errMessage);
    }
    if (Number(price) < Number(discountedPrice)) {
      error = true;
      $("#discountedPrice").after(
        `<small class='text-danger err-message'>Discounted price cannot be more than Actual price</small>`
      );
    }
    if (!level) {
      error = true;
      $("#level").after(errMessage);
    }
    if (!access) {
      error = true;
      $("#access").after(errMessage);
    }
    if (language.length === 0) {
      error = true;
      $("._language-wrap").after(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }

    return !error;
  });

  // Course bundle edit (details)
  $("#bundle_submit_btn").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#bundle_title").val().trim();
    const category = $("#category").val().trim();
    const excerpt = $("#bundle_excerpt").val().trim();
    const access = $("#access").val().trim();
    const level = $("#level").val().trim();
    const language = $("#language").val();
    const price = $("#price").val().trim();
    const discountedPrice = $("#discountedPrice").val().trim();

    if (!title) {
      error = true;
      $("#bundle_title").after(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }
    if (!excerpt) {
      error = true;
      $("#bundle_excerpt").after(errMessage);
    }
    if (!access) {
      error = true;
      $("#access").after(errMessage);
    }
    if (!level) {
      error = true;
      $("#level").after(errMessage);
    }
    if (language.length === 0) {
      error = true;
      $("#language").parent().after(errMessage);
    }
    if (!price) {
      error = true;
      $("#price").after(errMessage);
    }
    if (!discountedPrice) {
      error = true;
      $("#discountedPrice").after(errMessage);
    }
    if (Number(price) < Number(discountedPrice)) {
      error = true;
      $("#discountedPrice").after(
        `<small class="text-danger err-message">
        Discounted price cannot be more than Actual price
      </small>`
      );
    }
    return !error;
  });

  // Edit course bundle (description)
  $(".add_course_select").select2({
    dropdownParent: $("#pricing-line"),
  });

  $("#bundle_description_submit").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;
    
    const courses = $("#courses").val();
    const thumbnailVideo = $("#thumbnailVideo").val();
    const description = $("#description").val().trim();
    // const bundleThumbnailImage = $("#bundleThumbnailImage").val().trim();
    const benefits = $("#benefits").val().trim();
    const materialsIncludes = $("#materialsIncludes").val().trim();

    if (courses.length === 0) {
      error = true;
      $("#courses").before(errMessage);
    }
    if (!thumbnailVideo) {
      error = true;
      $("#thumbnailVideo").before(errMessage);
    }
    if (!description) {
      error = true;
      $("#description").before(errMessage);
    }
    // if (!bundleThumbnailImage) {
    //   error = true;
    //   $("#bundleThumbnailImage").parent().before(errMessage);
    // }
    if (!benefits) {
      error = true;
      $("#benefits").before(errMessage);
    }
    if (!materialsIncludes) {
      error = true;
      $("#materialsIncludes").before(errMessage);
    }

    return !error;
  });

  // course bundle edit (seo)
  $("#bundle_seo_submit").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const slug = $("#courseBundleUrl").val().trim();
    const seoTitle = $("#seoTitle").val().trim();
    const seoDescription = $("#seoDescription").val().trim();
    const seoScripts = $("#seoScripts").val().trim();

    if (!slug) {
      error = true;
      $("#courseBundleUrl").parent().before(errMessage);
    }
    if (!seoTitle) {
      error = true;
      $("#seoTitle").after(errMessage);
    }
    if (!seoDescription) {
      error = true;
      $("#seoDescription").after(errMessage);
    }
    if (!seoScripts) {
      error = true;
      $("#seoScripts").after(errMessage);
    }

    return !error;
  });

  // Delete Course bundle
  $("#delete_course_bundle").on("click", function () {
    $("#delete-course-bundle-form").submit();
  });

  $('.restore_bundle_btn').on('click', function() {
    let id = $(this).data('id');
    let url = `/api/creator/course-bundle/${id}/restore-deleted-course-bundle?_method=PUT`
    $('.restore_bundle_form').attr('action', url)
  })

  // ---- PRODUCT ---- //

  $(".product_add").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const skuNumber = $("#skuNumber").val().trim();
    const title = $("#title").val().trim();
    const excerpt = $("#excerpt").val().trim();
    const price = $("#price").val().trim();
    const discountedPrice = $("#discountedPrice").val().trim();
    const level = $("#level").val();
    const language = $("#language").val();
    const category = $("#category").val().trim();

    if (!skuNumber) {
      error = true;
      $("#skuNumber").after(errMessage);
    }
    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!excerpt) {
      error = true;
      $("#excerpt").after(errMessage);
    }
    if (!price) {
      error = true;
      $("#price").after(errMessage);
    }
    if (!discountedPrice) {
      error = true;
      $("#discountedPrice").after(errMessage);
    }
    if (Number(price) < Number(discountedPrice)) {
      error = true;
      $("#discountedPrice").after(
        `<small class='text-danger err-message'>Discounted price must be less than actual price.</small>`
      );
    }
    if (level.length === 0) {
      error = true;
      $("#level").before(errMessage);
    }
    if (language.length === 0) {
      error = true;
      $("#language").before(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").before(errMessage);
    }

    return !error;
  });

  $('.add_product_category').on('click', function() {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const category = $('#category').val().trim();

    if(!category){
      error = true;
      $('#category').after(errMessage)
    }

    return !error;
  })

  $('.add_product_category_using_ajax').on('click', function() {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const category = $('#category_product').val().trim();

    if(!category){
      error = true;
      $('#category_product').after(errMessage)
    }

    if(!error){
      $.ajax({
        type: "POST",
        url: `/api/creator/product/category/add?type=autoset`,
        data: {
          title:category
        },
        success: function ({category, success}) {
          if (success) {
            $('#categoryModal #category_product').val('')
            $('#categoryModal').modal('hide')

            $('#category').load(location.href + ' #category>*', "")
            setTimeout(() => {
              $('#category option').each(function(){
                if($(this).val() === category){
                  $(this).prop('selected', true)
                }
              })
            },500)
          }
        },
        error: function (err) {
          console.log("failed");
        },
      });
    }
  })

  // Edit product
  $(".product_basic_details").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const productTitle = $("#productTitle").val().trim();
    const category = $("#category").val().trim();
    const productExcerpt = $("#productExcerpt").val().trim();
    const level = $("#level").val();
    const language = $("#language").val();
    const price = $("#price").val().trim();
    const discountedPrice = $("#discountedPrice").val().trim();
    const quantity = $("#quantity").val().trim();
    const hsn = $("#hsn").val().trim();

    if (!productTitle) {
      error = true;
      $("#productTitle").after(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }
    if (!productExcerpt) {
      error = true;
      $("#productExcerpt").after(errMessage);
    }
    if (level.length === 0) {
      error = true;
      $("#level").after(errMessage);
    }
    if (language.length === 0) {
      error = true;
      $("#language").after(errMessage);
    }
    if (!price) {
      error = true;
      $("#price").after(errMessage);
    }
    if (!discountedPrice) {
      error = true;
      $("#discountedPrice").after(errMessage);
    }
    if (Number(price) < Number(discountedPrice)) {
      error = true;
      $("#discountedPrice").after(
        `<small class='text-danger err-message'>Discounted price must be less than actual price.</small>`
      );
    }
    if (!quantity) {
      error = true;
      $("#quantity").after(errMessage);
    }
    if (!hsn) {
      error = true;
      $("#hsn").after(errMessage);
    }

    return !error;
  });

  // Product edit description
  $(".product_description_details").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const description = $("#description").val().trim();

    if (!description) {
      error = true;
      $("#description").after(errMessage);
    }

    return !error;
  });

  // Product seo edit
  $(".product_seo_details").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const productPageUrl = $("#productPageUrl").val().trim();

    if (!productPageUrl) {
      error = true;
      $("#productPageUrl").parent().before(errMessage);
    }

    return !error;
  });

  // Delete product
  $(".delete_product_btn").on("click", function () {
    $("#delete_product_form").submit();
  });

  //Delete Product image
  $(".deleteProductImg").on("click", function (e) {
    let img = $(this).data("img");
    let id = $(this).data("id");
    let result = confirm("Are you sure! You want to perform this action?");
    if (result) {
      $.ajax(`/api/creator/product/${id}/delete-gallery-img/${img}`, {
        method: "delete",
        success: function () {
          location.reload();
        },
        error: function () {
          console.log("failed");
        },
      });
    }
  });

  // Restore product
  $('.restore_product_btn').on('click', function() {
    let productId = $(this).data('id')
    let url = `/api/creator/product/${productId}/restore-deleted-product?_method=PUT`;
    $('.restore_product_form').attr('action', url)
  })

  $(".validateNums").keypress(function (e) {
    var charCode = e.which ? e.which : e.keyCode;

    if (String.fromCharCode(charCode).match(/[^0-9]/g)) return false;
  });

  // Edit product category
  $(".edit_product_category").on("click", function () {
    const category = $(this).data("category");

    $(".edit_product_category_form #title").val(category.title);

    let url = `/api/creator/product/category/${category._id}?_method=PUT`;

    $(".edit_product_category_form").attr("action", url);
  });

  // Delete product Category
  $(".delete_product_category_btn").on("click", function () {
    const id = $(this).data("id");

    $("#delete_product_category_confirm").on("click", function () {
      $("#delete_product_category_form").attr(
        "action",
        `/api/creator/product/category/${id}?_method=DELETE`
      );
      $("#delete_product_category_form").submit();
    });
  });

  $(".add_quiz").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();
    const description = $("#description").val().trim();

    if (!title) {
      error = true;
      $("#title").before(errMessage);
    }
    if (!description) {
      error = true;
      $("#description").after(errMessage);
    }

    return !error;
  });

  $(".edit_quiz_btn").on("click", function () {
    let quiz = $(this).data("quiz");
    let courseId = $(this).data("courseid");

    let newUrl = `/api/creator/quiz/${courseId}/${quiz._id}?_method=PUT`;
    $(".quiz-edit-form").attr("action", newUrl);

    $(".quiz-edit-form #quizTitle").val(quiz.title);
    $(".quiz-edit-form #quizDescription").summernote("code", quiz.description);
  });

  $(".edit_quiz").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const quizTitle = $("#quizTitle").val().trim();
    const quizDescription = $("#quizDescription").val().trim();

    if (!quizTitle) {
      error = true;
      $("#quizTitle").before(errMessage);
    }
    if (!quizDescription) {
      error = true;
      $("#quizDescription").after(errMessage);
    }

    return !error;
  });

  $(".delete_quiz_btn").on("click", function () {
    let courseId = $(this).data("courseid");
    let quizId = $(this).data("quizid");
    let url = `/api/creator/quiz/${courseId}/${quizId}?_method=DELETE`;
    $(".delete_quiz_form").attr("action", url);
  });

  // Quiz
  $(".add_quiz_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const noOfQuestion = $("#noOfQuestion").val().trim();
    const question = $("#question").val().trim();
    const optionOne = $("#optionOne").val().trim();
    const optionTwo = $("#optionTwo").val().trim();
    const optionThree = $("#optionThree").val().trim();
    const optionFour = $("#optionFour").val().trim();
    const answer = $("#answer").val().trim();

    if (!noOfQuestion) {
      error = true;
      $("#noOfQuestion").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#question").after(errMessage);
    }
    if (!optionOne) {
      error = true;
      $("#optionOne").after(errMessage);
    }
    if (!optionTwo) {
      error = true;
      $("#optionTwo").after(errMessage);
    }
    if (!optionThree) {
      error = true;
      $("#optionThree").after(errMessage);
    }
    if (!optionFour) {
      error = true;
      $("#optionFour").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#answer").after(errMessage);
    }
    let opt = [optionOne, optionTwo, optionThree, optionFour];
    if(!opt.includes(answer)){
      error = true;
      $("#answer").after("<small class='text-danger err-message'>Answer must be exclusively from given options.</small>");
    }

    return !error;
  });

  $(".edit_question_btn").on("click", function () {
    let question = $(this).data("question");
    let quizId = $(this).data("quizid");
    let quizquestionid = $(this).data("quizquestionid");
    let questionNumber = $(this).data("questionnumber");

    const url = `/api/creator/quiz/${quizId}/question/${quizquestionid}?_method=PUT&questionNumber=${questionNumber}`;

    $(".edit_quiz_question_form").attr("action", url);

    $(".edit_quiz_question_form #noOfQuestion_edit").val(question.noOfQuestion);
    $(".edit_quiz_question_form #question_edit").val(question.question);
    $(".edit_quiz_question_form #optionOne_edit").val(question.choice[0]);
    $(".edit_quiz_question_form #optionTwo_edit").val(question.choice[1]);
    $(".edit_quiz_question_form #optionThree_edit").val(question.choice[2]);
    $(".edit_quiz_question_form #optionFour_edit").val(question.choice[3]);
    $(".edit_quiz_question_form #answer_edit").val(question.answer);
  });

  $(".edit_quiz_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const question = $("#question_edit").val().trim();
    const noOfQuestion = $("#noOfQuestion_edit").val().trim();
    const optionOne = $("#optionOne_edit").val().trim();
    const optionTwo = $("#optionTwo_edit").val().trim();
    const optionThree = $("#optionThree_edit").val().trim();
    const optionFour = $("#optionFour_edit").val().trim();
    const answer = $("#answer_edit").val().trim();

    if (!noOfQuestion) {
      error = true;
      $("#noOfQuestion_edit").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#question_edit").after(errMessage);
    }
    if (!optionOne) {
      error = true;
      $("#optionOne_edit").after(errMessage);
    }
    if (!optionTwo) {
      error = true;
      $("#optionTwo_edit").after(errMessage);
    }
    if (!optionThree) {
      error = true;
      $("#optionThree_edit").after(errMessage);
    }
    if (!optionFour) {
      error = true;
      $("#optionFour_edit").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#answer_edit").after(errMessage);
    }
     let opt = [optionOne, optionTwo, optionThree, optionFour];
    if(!opt.includes(answer)){
      error = true;
      $("#answer_edit").after("<small class='text-danger err-message'>Answer must be exclusively from given options.</small>");
    }

    return !error;
  });

  $(".quiz_question_delete_btn").on("click", function () {
    let quizId = $(this).data("quizid");
    let quizquestionid = $(this).data("quizquestionid");
    let questionId = $(this).data("questionid");

    const url = `/api/creator/quiz/${quizId}/question/${quizquestionid}?_method=DELETE&questionId=${questionId}`;
    $(".quiz_question_delete_form").attr("action", url);
  });

  $(".add_diploma").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();
    const description = $("#description").val().trim();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }

    if (!description) {
      error = true;
      $("#description").after(errMessage);
    }

    return !error;
  });

  //

  $(".diploma_edit_modal_open_btn").on("click", function () {
    const diploma = $(this).data("diploma");
    let url = `/api/creator/diploma/${diploma.courseBundle}/${diploma._id}?_method=PUT`;

    $(".diploma-edit-form").attr("action", url);
    $(".diploma-edit-form #title_edit").val(diploma.title);
    $(".diploma-edit-form #description_edit").summernote(
      "code",
      diploma.description
    );
  });

  $(".edit_diploma").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title_edit").val().trim();
    const description = $("#description_edit").val().trim();

    if (!title) {
      error = true;
      $("#title_edit").after(errMessage);
    }

    if (!description) {
      error = true;
      $("#description_edit").after(errMessage);
    }

    return !error;
  });

  // Diploma delete
  $(".diploma_delete_modal_open_btn").on("click", function () {
    const bundleId = $(this).data("bundleid");
    const diplomaId = $(this).data("diplomaid");
    let url = `/api/creator/diploma/${bundleId}/${diplomaId}?_method=DELETE`;

    $(".diploma_delete_form").attr("action", url);
  });

  // Add diploma questions
  $(".add_diploma_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const noOfQuestion = $("#noOfQuestion").val().trim();
    const question = $("#question").val().trim();
    const optionOne = $("#optionOne").val().trim();
    const optionTwo = $("#optionTwo").val().trim();
    const optionThree = $("#optionThree").val().trim();
    const optionFour = $("#optionFour").val().trim();
    const answer = $("#answer").val().trim();

    if (!noOfQuestion) {
      error = true;
      $("#noOfQuestion").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#question").after(errMessage);
    }
    if (!optionOne) {
      error = true;
      $("#optionOne").after(errMessage);
    }
    if (!optionTwo) {
      error = true;
      $("#optionTwo").after(errMessage);
    }
    if (!optionThree) {
      error = true;
      $("#optionThree").after(errMessage);
    }
    if (!optionFour) {
      error = true;
      $("#optionFour").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#answer").after(errMessage);
    }
    let ans = [optionOne, optionTwo, optionThree, optionFour]
    if(!ans.includes(answer)){
      error = true;
      $("#answer").after("<small class='text-danger err-message'>Answer must be exclusively from given options.</small>");
    }

    return !error;
  });

  // Edit diploma questions
  $(".edit_diploma_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const question = $("#diploma_question_edit").val().trim();
    const noOfQuestion = $("#diploma_noOfQuestion_edit").val().trim();
    const optionOne = $("#diploma_optionOne_edit").val().trim();
    const optionTwo = $("#diploma_optionTwo_edit").val().trim();
    const optionThree = $("#diploma_optionThree_edit").val().trim();
    const optionFour = $("#diploma_optionFour_edit").val().trim();
    const answer = $("#diploma_answer_edit").val().trim();
    if (!noOfQuestion) {
      error = true;
      $("#diploma_noOfQuestion_edit").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#diploma_question_edit").after(errMessage);
    }
    if (!optionOne) {
      error = true;
      $("#diploma_optionOne_edit").after(errMessage);
    }
    if (!optionTwo) {
      error = true;
      $("#diploma_optionTwo_edit").after(errMessage);
    }
    if (!optionThree) {
      error = true;
      $("#diploma_optionThree_edit").after(errMessage);
    }
    if (!optionFour) {
      error = true;
      $("#diploma_optionFour_edit").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#diploma_answer_edit").after(errMessage);
    }
    let ans = [optionOne, optionTwo, optionThree, optionFour]
    if(!ans.includes(answer)){
      error = true;
      $("#diploma_answer_edit").after("<small class='text-danger err-message'>Answer must be exclusively from given options.</small>");
    }

    return !error;
  });

  $(".diploma_question_edit_btn").on("click", function () {
    const question = $(this).data("question");
    $("#diploma_question_edit").attr("value", question.question);
    $("#diploma_noOfQuestion_edit").attr("value", question.noOfQuestion);
    $("#diploma_optionOne_edit").attr("value", question.choice[0]);
    $("#diploma_optionTwo_edit").attr("value", question.choice[1]);
    $("#diploma_optionThree_edit").attr("value", question.choice[2]);
    $("#diploma_optionFour_edit").attr("value", question.choice[3]);
    $("#diploma_answer_edit").attr("value", question.answer);

    const diplomaId = $(this).data("diplomaid");
    const quizQuestionId = $(this).data("quizquestionid");
    let questionNumber = $(this).data("questionnumber");

    const url = `/api/creator/diploma/${diplomaId}/question/${quizQuestionId}?_method=PUT&questionNumber=${questionNumber}`;
    $("#diploma_edit_question_form").attr("action", url);
  });

  // Delete diploma question
  $(".delete_diploma_question").on("click", function () {
    const diplomaId = $(this).data("diplomaid");
    const quizQuestionId = $(this).data("quizquestionid");
    const questionId = $(this).data("questionid");

    let url = `/api/creator/diploma/${diplomaId}/question/${quizQuestionId}?_method=DELETE&questionId=${questionId}`;
    $(".delete_diploma_question_form").attr("action", url);
  });

  $(".add_course_select_coupon").select2({
    dropdownParent: $(".coupon_form"),
  });
  $(".edit_course_select_coupon").select2({
    dropdownParent: $(".coupon_edit_form"),
  });

  // Add Coupon validation
  $(".coupon_add").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const couponType = $("#couponType").val().trim();
    const code = $("#code").val().trim();
    const couponValue = $("#couponValue").val().trim();
    const minPurchase = $("#minPurchase").val().trim();
    const discountUpto = $("#discountUpto").val().trim();
    const uses = $("#uses").val().trim();

    if (!couponType) {
      error = true;
      $("#couponType").after(errMessage);
    }
    if (!code) {
      error = true;
      $("#code").after(errMessage);
    }
    if (!couponValue) {
      error = true;
      $("#couponValue").after(errMessage);
    }
    if (!minPurchase) {
      error = true;
      $("#minPurchase").after(errMessage);
    }
    if (!discountUpto) {
      error = true;
      $("#discountUpTo").after(errMessage);
    }
    if (!uses) {
      error = true;
      $("#uses").after(errMessage);
    }

    return !error;
  });

  // Edit coupon
  $(".edit_coupon_btn").on("click", function () {
    const coupon = $(this).data("coupon");

    $(`#couponType_edit option[value='${coupon.type}']`).prop("selected", true);
    $("#code_edit").val(coupon.code);
    $(
      `#status_edit option[value='${coupon.status ? "active" : "inactive"}']`
    ).prop("selected", true);
    $("#couponValue_edit").val(coupon.couponValue);
    $("#minPurchase_edit").val(coupon.minPurchaseAmount);
    $("#discountUpto_edit").val(coupon.discountUpTo);
    $("#uses_edit").val(coupon.noOfUses);
    $("#noOfUsesPerUser_edit").val(coupon.noOfUsesPerUser);
    if (coupon.expiredAt) {
      $("#expiryDate_edit").val(
        coupon.expiredAt.toLocaleString().split("T")[0]
      );
    }
    $("#courses_edit").val(coupon.courses);
    $("#courses_edit").trigger("change");
    $("#products_edit").val(coupon.products);
    $("#products_edit").trigger("change");

    let formUrl = `/api/creator/coupon/${coupon._id}?_method=PUT`;
    $("#coupon_edit_form").attr("action", formUrl);
  });

  $(".coupon_edit").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const couponType = $("#couponType_edit").val().trim();
    const code = $("#code_edit").val().trim();
    const couponValue = $("#couponValue_edit").val().trim();
    const minPurchase = $("#minPurchase_edit").val().trim();
    const discountUpto = $("#discountUpto_edit").val().trim();
    const uses = $("#uses_edit").val().trim();

    if (!couponType) {
      error = true;
      $("#couponType_edit").after(errMessage);
    }
    if (!code) {
      error = true;
      $("#code_edit").after(errMessage);
    }
    if (!couponValue) {
      error = true;
      $("#couponValue_edit").after(errMessage);
    }
    if (!minPurchase) {
      error = true;
      $("#minPurchase_edit").after(errMessage);
    }
    if (!discountUpto) {
      error = true;
      $("#discountUpTo_edit").after(errMessage);
    }
    if (!uses) {
      error = true;
      $("#uses_edit").after(errMessage);
    }

    return !error;
  });

  // Delete Coupon
  $(".delete_coupon_btn").on("click", function () {
    let couponID = $(this).data("couponid");
    $(".delete_coupon_form").attr(
      "action",
      `/api/creator/coupon/${couponID}?_method=DELETE`
    );
  });

  $('.restore_coupon_btn').on('click', function() {
    let id = $(this).data('id');
    let url = `/api/creator/coupon/${id}/restore-deleted-coupon?_method=PUT`
    $('.restore_coupon_form').attr('action', url)
  })

  // Instructor crud
  $(".add_instructor").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    let name = $("#name").val().trim();
    let email = $("#email").val().trim();
    let designation = $("#designation").val().trim();
    let password = $("#password").val().trim();
    let confirmPassword = $("#confirmPassword").val().trim();

    if (!name) {
      error = true;
      $("#name").after(errMessage);
    }
    if (!email) {
      error = true;
      $("#email").after(errMessage);
    }
    if (!designation) {
      error = true;
      $("#designation").after(errMessage);
    }
    if (!password) {
      error = true;
      $("#password").after(errMessage);
    }
    if (!confirmPassword) {
      error = true;
      $("#confirmPassword").after(errMessage);
    }
    if (password !== confirmPassword) {
      error = true;
      $("#confirmPassword").after("<small class='text-danger err-message'>Password and confirm password does not match.</small>");
    }
    return !error;
  });

  // Edit instructor btn
  $(".edit_instructor_btn").on("click", function () {
    const instructor = $(this).data("instructor");

    let url = `/api/creator/instructor/${instructor._id}?_method=PUT`;
    $(".edit_instructor_form").attr("action", url);

    $("#edit_name").val(instructor.name);
    $("#edit_email").val(instructor.email);
    $("#edit_designation").val(instructor.designation);
    $("#edit_description").summernote("code", instructor.description);
    if(instructor.profileImg){
      setPreview(
        `/uploads/instructors/profile/${instructor.profileImg}`,
        "#edit_profileImage"
      );
    }
  });

  $(".edit_instructor").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    let name = $("#edit_name").val().trim();
    let email = $("#edit_email").val().trim();
    let designation = $("#edit_designation").val().trim();

    if (!name) {
      error = true;
      $("#edit_name").after(errMessage);
    }
    if (!email) {
      error = true;
      $("#edit_email").after(errMessage);
    }
    if (!designation) {
      error = true;
      $("#edit_designation").after(errMessage);
    }
    return !error;
  });

  $(".instructor_delete_btn").on("click", function () {
    let instructor = $(this).data("instructor");
    let url = `/api/creator/instructor/${instructor}?_method=DELETE`;
    $(".instructor_delete_form").attr("action", url);
  });

  $(".instructor_restore_btn").on("click", function () {
    let instructor = $(this).data("instructor");
    let url = `/api/creator/instructor/${instructor}/restore-deleted-instructor?_method=PUT`;
    $(".restore_instructor_form").attr("action", url);
  });

  // instructor reset password
  $(".instructor_reset_password").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/instructor/${id}/change-instructor-password?_method=PUT`;
    $(".reset_instructor_password_form").attr("action", url);
  });

  $('.instructor_edit_password').on('click', function() {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    let newPassword = $("#new_pass").val().trim();
    let confirmPassword = $("#confirm_pass").val().trim();

    if (!newPassword) {
      error = true;
      $("#new_pass").after(errMessage);
    }
    if (!confirmPassword) {
      error = true;
      $("#confirm_pass").after(errMessage);
    }

    if (newPassword !== confirmPassword) {
      error = true;
      $("#confirm_pass").after("<small class='text-danger err-message'>Password and confirm password does not match.</small>");
    }

    return !error;
  })

  // instructor update status
  $(".instructor_status_toggle_btn").on("click", function () {
    let id = $(this).data("id");
    let status = $(this).data("status");
    let url = `/api/creator/instructor/${id}/change-instructor-status?_method=PUT&status=${status}`;
    if (status) {
      $("p.status-toggle-tag").text(
        "Do you really want to inactive this instructor?"
      );
      $("span.status_toggle_btn_text").text("Inactive");
    } else {
      $("p.status-toggle-tag").text(
        "Do you really want to active this instructor?"
      );
      $("span.status_toggle_btn_text").text("Active");
    }
    $(".instructor_status_toggle_form").attr("action", url);
  });

  // Sub-Creator
  $(".add-sub-creator").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;
    let phoneRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/

    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const password = $("#password").val().trim();
    const confirmPassword = $("#confirmPassword").val().trim();

    if (!firstName) {
      error = true;
      $("#firstName").after(errMessage);
    }
    if (!lastName) {
      error = true;
      $("#lastName").after(errMessage);
    }
    if (!email) {
      error = true;
      $("#email").after(errMessage);
    }
    if (!phone) {
      error = true;
      $("#phone").after(errMessage);
    }
    if (!phoneRegex.test(phone)) {
      error = true;
      $("#phone").after("<small class='text-danger err-message'>Please enter valid phone number.</small>");
    }
    if (!password) {
      error = true;
      $("#password").after(errMessage);
    }
    if (!confirmPassword) {
      error = true;
      $("#confirmPassword").after(errMessage);
    }
    if (password !== confirmPassword) {
      error = true;
      $("#confirmPassword").after(
        "<small class='text-danger err-message'>Password and confirm password does not match.</small>"
      );
    }
    return !error;
  });

  $(".edit_sub_creator_btn").on("click", function () {
    let subCreator = $(this).data("subcreator");
    let url = `/api/creator/sub-creator/${subCreator._id}?_method=PUT`;

    $(".subcreator_edit_form").attr("action", url);

    $(".subcreator_edit_form #firstName_edit").val(subCreator.firstName);
    $(".subcreator_edit_form #lastName_edit").val(subCreator.lastName);
    $(".subcreator_edit_form #email_edit").val(subCreator.email);
    $(".subcreator_edit_form #phone_edit").val(subCreator.phone);

    let modules = $(".subcreator_edit_form input[name=modules]");

    Object.entries(modules).forEach((mod) => {
      if ($(mod.at(-1)).hasClass("custom-control-input")) {
        $(mod[1]).prop("checked", false);
        if (subCreator.modules.includes($(mod[1]).val())) {
          $(mod[1]).prop("checked", true);
        }
      }
    });
  });

  $(".edit-sub-creator").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const firstName = $("#firstName_edit").val().trim();
    const lastName = $("#lastName_edit").val().trim();
    const email = $("#email_edit").val().trim();
    const phone = $("#phone_edit").val().trim();

    if (!firstName) {
      error = true;
      $("#firstName_edit").after(errMessage);
    }
    if (!lastName) {
      error = true;
      $("#lastName_edit").after(errMessage);
    }
    if (!email) {
      error = true;
      $("#email_edit").after(errMessage);
    }
    if (!phone) {
      error = true;
      $("#phone_edit").after(errMessage);
    }

    return !error;
  });

  $(".delete_sub_creator_btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/sub-creator/${id}?_method=DELETE`;
    $(".delete_sub_creator_form").attr("action", url);
  });

  $(".subcreator_restore_btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/sub-creator/${id}/restore-deleted-subcreator?_method=PUT`;
    $(".subcreator_restore_form").attr("action", url);
  });

  $(".reset_subcreator_password_btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/sub-creator/${id}/change-subcreator-password?_method=PUT`;
    $(".reset_subcreator_password_form").attr("action", url);
  });

  $(".subcreator_status_toggle_btn").on("click", function () {
    let id = $(this).data("id");
    let status = $(this).data("status");
    let url = `/api/creator/sub-creator/${id}/change-subcreator-status?_method=PUT&status=${status}`;
    if (status) {
      $("p.status-toggle-tag").text(
        "Do you really want to inactive this sub creator?"
      );
      $("span.status_toggle_btn_text").text("Inactive");
    } else {
      $("p.status-toggle-tag").text(
        "Do you really want to active this sub creator?"
      );
      $("span.status_toggle_btn_text").text("Active");
    }
    $(".subcreator_status_toggle_form").attr("action", url);
  });

  //

  //

  //

  //
});

// changed tooltip trigger
$('[data-toggle="tooltip"]').tooltip({
  trigger: "hover"
});

// update password validation
$("#change_password_btn").on("click", function () {
  $(".err-message").remove();
  const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
  let error = false;
  
  const currentPass = $("#current_password").val();
  const newPass = $("#new_password").val();
  const confirmPass = $("#confirm_password").val();
  
  if (!currentPass && !currentPass.trim()) {
    error = true;
    $("#current_password").after(errMessage);
  }
  if (!newPass && !newPass.trim()) {
    error = true;
    $("#new_password").after(errMessage);
  }
  
  if (!confirmPass && !confirmPass.trim()) {
    error = true;
    $("#confirm_password").after(errMessage);
  }

  // if(newPass.length < 8){
  //   error = true;
  //   $('#new_password').after(`<small class='text-danger err-message'>New Password must be greater than 8 characters.</small>`)
  // }
  // if(confirmPass.length < 8){
  //   error = true;
  //   $('#confirm_password').after(`<small class='text-danger err-message'>Confirm Password must be greater than 8 characters.</small>`)
  // }
  
  //   if ( confirmPass.length > 8 && newPass.length > 8 && newPass !== confirmPass) {
    //     error = true;
    //     $('#confirm_password').after(`<small class='text-danger err-message'>Password and confirm password does not match.</small>`)
    //   }
    
    if(newPass !== confirmPass ){
      error = true;
      $('#confirm_password').after(`<small class='text-danger err-message'>Password and confirm password does not match.</small>`)
    } else {
      if( !(!confirmPass.trim()) && newPass.length < 8 ){
          error = true;
          $('#confirm_password').after(`<small class='text-danger err-message'>Password must be greater than 8 characters.</small>`)
      }
    }

  return !error;
});