"use strict";

$(document).ready(function () {
  // ------------ Common ------------ //

  // Set Alert messages
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

  // Alerts
  if ($(".session-alert").length) {
    setTimeout(() => {
      $(".session-alert").fadeOut();
    }, 3000);
  }

  // Set Preview
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

  // Validate email
  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  //Number input
  $(document).on("keypress", ".number", function (event) {
    if (event.keyCode < 48 || event.keyCode > 57) {
      event.preventDefault();
    }
  });

  // Summernote
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
  $("#paidDescription").summernote({
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
  // summernore
  let $editor = $("#summernote");
  $editor.summernote({
    tabsize: 2,
    height: 100,
    callbacks: {
      onImageUpload: function (files) {
        let formData = new FormData();
        formData.append("stepImage", files[0]);

        $.ajax({
          type: "POST",
          url: "/api/creator/help/add-help-file",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function (res) {
            let imgNode = $(`<img data-id="${res.filename}">`).attr(
              "src",
              `/uploads/help/stepImage/${res.filename}`
            );
            $editor.summernote("insertNode", imgNode[0]);
            $(".note-image-input").val("");
          },
          error: function () {
            return false;
          },
        });
      },
      onMediaDelete: function (target) {
        $.ajax({
          type: "DELETE",
          url: `/api/creator/help/delete-help-file/${$(target[0]).attr(
            "data-id"
          )}`,
          error: function () {
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

  // summernore
  let $editorEdit = $("#edit_summernote");
  $editorEdit.summernote({
    tabsize: 2,
    height: 100,
    callbacks: {
      onImageUpload: function (files) {
        let formData = new FormData();
        formData.append("stepImage", files[0]);

        $.ajax({
          type: "POST",
          url: "/api/creator/help/add-help-file",
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success: function (res) {
            let imgNode = $(`<img data-id="${res.filename}">`).attr(
              "src",
              `${res.backendUrl}/uploads/help/stepImage/${res.filename}`
            );
            $editor.summernote("insertNode", imgNode[0]);
            $(".note-image-input").val("");
          },
          error: function () {
            return false;
          },
        });
      },
      onMediaDelete: function (target) {
        $.ajax({
          type: "DELETE",
          url: `/api/creator/help/delete-help-file/${$(target[0]).attr(
            "data-id"
          )}`,
          error: function () {
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

  // Initiate dropify
  $(".dropify").dropify();
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
  $(".add_course_select_coupon").select2({
    dropdownParent: $(".coupon_form"),
  });
  $(".edit_course_select_coupon").select2({
    dropdownParent: $("#coupon_edit_form"),
  });
  $(".add_course_select").select2({
    dropdownParent: $("#pricing-line"),
  });
  $(".add-blog-select").select2({
    dropdownParent: $("body"),
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

  // Search params
  function insertParam(key, value, replace = false) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    // kvp looks like ['key1=value1', 'key2=value2', ...]
    let kvp;
    if (replace) {
      kvp = [];
    } else {
      kvp = document.location.search.substr(1).split("&");
    }
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
    // // can return this or...
    kvp = kvp.filter((elm) => elm);
    let params = kvp.join("&");
    // // reload page with new params
    document.location.search = params;
  }

  // Pagination
  $(".page-num").on("click", function () {
    $(".page-num").removeClass("active");
    $(this).addClass("active");
    insertParam("page", $(this).attr("data-page"));
  });

  $(".next-page").on("click", function () {
    let nextPage = parseInt($(this).attr("data-next"));
    insertParam("page", nextPage);
  });

  $(".prev-page").on("click", function () {
    let prevPage = parseInt($(this).attr("data-prev"));
    insertParam("page", prevPage);
  });

  $(".search-data").on("click", function () {
    let searchText = $(".search_input").val().trim();
    insertParam("search", searchText, true);
  });
  $(".filter_data").on("click", function () {
    let filter = $(this).data("filter");
    insertParam("filter", filter, true);
  });
  $("._sortby").on("click", function () {
    let sortQuery = $(this).data("sortby");
    insertParam("sort", sortQuery, true);
  });

  // changed tooltip trigger
  $('[data-toggle="tooltip"]').tooltip({
    trigger: "hover",
  });

  // --------------- @Auth Script Starts @.v1 ---------------- //

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
    });
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

    if (newPass !== confirmPass) {
      error = true;
      $("#confirm_password").after(
        `<small class='text-danger err-message'>Password and confirm password does not match.</small>`
      );
    } else {
      if (!!confirmPass.trim() && newPass.length < 8) {
        error = true;
        $("#confirm_password").after(
          `<small class='text-danger err-message'>Password must be greater than 8 characters.</small>`
        );
      }
    }

    return !error;
  });

  // --------------- @Auth Script End @.v1 ---------------- //

  // --------------- @Course Script Starts @.v1 ---------------- //

  // LANGUAGE
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
  $(".add_language_using_ajax").on("click", function () {
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
        language,
      },
      success: function ({ language, success }) {
        if (success) {
          let allValues = [];
          allValues.push(language);

          $("#languageModal input").val("");
          $("#languageModal").modal("hide");
          $("#language").load(location.href + " #language>*", "");
          setTimeout(() => {
            let alreadySelected;
            $("#language").each(function () {
              alreadySelected = $(this).find("option:selected");
            });
            let i = 0;
            while (i < alreadySelected.length) {
              allValues.unshift($(alreadySelected[i]).val());
              i++;
            }
            $("#language").val(allValues).trigger("change");
          }, 500);
        }
      },
    });
  });

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

  // CATEGORY
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
  $(".add_category_using_ajax").on("click", function () {
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

    if (!error) {
      let formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("categoryIcon", $("#categoryIcon")[0].files[0]);
      $.ajax({
        type: "POST",
        url: `/api/creator/course/category/add?type=autoset`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function ({ category, success }) {
          if (success) {
            $("#categoryModal #title").val("");
            $("#categoryModal #excerpt").val("");
            $("#categoryModal .dropify-clear").click();
            $("#categoryModal").modal("hide");

            $("#category").load(location.href + " #category>*", "");
            setTimeout(() => {
              $("#category option").each(function () {
                if ($(this).val() === category) {
                  $(this).prop("selected", true);
                }
              });
            }, 500);
          }
        },
      });
    }
  });

  // Edit category
  $(".edit_category_btn").on("click", function () {
    const id = $(this).data("id");
    const title = $(this).data("title");
    const excerpt = $(this).data("excerpt");
    const icon = $(this).data("category-icon");

    $("#editCategoryModal #title").val(title);
    $("#editCategoryModal #excerpt").val(excerpt);
    if (icon) {
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

  // COURSE
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
      $("#discountedPrice").after(
        "<small class='text-danger err-message'>Discounted price should be less than actual price.</small>"
      );
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
    if (category === null) {
      $("#category").before(errMessage);
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
      $("#discountedPrice").after(
        "<small class='text-danger err-message'>Discounted price must be less than actual price.</small>"
      );
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
    if (instructorName.length === 0) {
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

  // Restore Course
  $(".restore_course_btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/course/${id}/restore-deleted-course?_method=PUT`;
    $(".restore_course_form").attr("action", url);
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

  // Edit Section
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

  // Toggle practice files add
  $("#toggle-practice-file").on("click", function () {
    if ($("#resources").hasClass("show")) {
      $(this).next().addClass("d-none");
    } else {
      $(this).next().removeClass("d-none");
    }
  });

  // Toggle practice file edit
  $("#toggle-practice-file-edit").on("click", function () {
    if ($("#topic-edit-form #resources").hasClass("show")) {
      $(this).next().addClass("d-none");
    } else {
      $(this).next().removeClass("d-none");
    }
  });

  // Add practice links
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

  // edit practice links
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

  // Delete practice link
  $(document).on("click", ".delete-practice-link", function () {
    $(this).parent().parent().remove();
  });

  // Delete practice link edit
  $(document).on("click", ".delete-practice-link-edit", function () {
    $(this).parent().parent().remove();
  });

  // Add practice file
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

  // Edit practice file
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

  // Delete practice files
  $(document).on("click", ".delete-practice-file", function () {
    $(this).parent().parent().remove();
  });

  // Delete practice file edit
  $(document).on("click", ".delete-practice-file-edit", function () {
    $(this).parent().parent().remove();
  });

  // Add topic modal assign values
  $(".topic_add_modal_btn").on("click", function () {
    let primaryLink = $("#topic-add-form").attr("action");
    let topicId = $(this).data("topic-id");
    $("#topic-add-form").attr(
      "action",
      `${primaryLink}/topic/${topicId}?_method=PUT&editType=topicAdd`
    );
  });

  $(document).on("click", ".warn-for-intro-video", function () {
    $("#introVideoWarnModal").modal("show");
  });

  $(".cancel-intro-check").on("click", function () {
    $("#setAsIntro").prop("checked", false);
    $("#setAsIntroEdit").prop("checked", false);
  });

  // Add Topic
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
    const introVid = $(this).data("introvid");

    if (introVid && !topic.setAsIntro) {
      $("#setAsIntroEdit").parent().addClass("warn-for-intro-video");
    }

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
      $("#topic-edit-form #setAsIntroEdit").prop("checked", topic.setAsIntro);

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

  // --------------- @Course Script End @.v1 ---------------- //

  // --------------- @Coupon Script Starts @.v1 ---------------- //

  $("#couponType, #couponType_edit").on("change", function () {
    switch ($(this).val()) {
      case "fixed":
        $(".coupon_value").text("Fixed Amount");
        $('.discount-upto').attr('disabled', true)
        break;
        case "percentage":
          $(".coupon_value").text("Percentage Amount");
          $('.discount-upto').removeAttr('disabled')
    }
  });

  $("#uses, #uses_edit").on("change", function () {
    if ($(this).val()) {
      $("._new_user").addClass("non_editable");
    } else {
      $("._new_user").removeClass("non_editable");
    }
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
    // const uses = $("#uses").val().trim();

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
    if(couponType === "fixed"){
      if(Number(minPurchase) < Number(couponValue)) {
        error = true;
        $("#minPurchase").after("<small class='text-danger err-message'>Minimum purchase must be greater than discounted amount.</small>")
      }
    }
    // if (!discountUpto) {
    //   error = true;
    //   $("#discountUpTo").after(errMessage);
    // }
    return !error;
  });

  // Edit coupon
  $(".edit_coupon_btn").on("click", function () {
    const coupon = $(this).data("coupon");
    if (coupon.type === "percentage") {
      $(".coupon_value").text("Percentage Amount");
      $('.discount-upto').removeAttr('disabled')
    } else if (coupon.type === "fixed") {
      $(".coupon_value").text("Fixed Amount");
      $('.discount-upto').attr('disabled', true)
    }
    $(`#couponType_edit option[value='${coupon.type}']`).prop("selected", true);
    $("#code_edit").val(coupon.code);
    $(
      `#status_edit option[value='${coupon.status ? "active" : "inactive"}']`
    ).prop("selected", true);
    $("#couponValue_edit").val(coupon.couponValue);
    $("#minPurchase_edit").val(coupon.minPurchaseAmount);
    $("#discountUpto_edit").val(coupon.discountUpTo);
    $("#uses_edit").val(coupon.noOfUses);
    if(coupon.noOfUses) {
      $("._new_user").addClass("non_editable");
    }else {
      $("._new_user").removeClass("non_editable");
    }
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
    if (coupon.onlyForNewUser) {
      $("#onlyForNewUser_edit").prop("checked", true);
    }

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
    // const uses = $("#uses_edit").val().trim();

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
    if(couponType === "fixed"){
      if(Number(minPurchase) < Number(couponValue)) {
        error = true;
        $("#minPurchase_edit").after("<small class='text-danger err-message'>Minimum purchase must be greater than discounted amount.</small>")
      }
    }
    // if (!discountUpto) {
    //   error = true;
    //   $("#discountUpTo_edit").after(errMessage);
    // }
    // if (!uses) {
    //   error = true;
    //   $("#uses_edit").after(errMessage);
    // }
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

  $(".restore_coupon_btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/coupon/${id}/restore-deleted-coupon?_method=PUT`;
    $(".restore_coupon_form").attr("action", url);
  });
  // --------------- @Coupon Script End @.v1 ---------------- //

  // --------------- @Bundle Script Starts @.v1 ---------------- //
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

  $(".restore_bundle_btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/course-bundle/${id}/restore-deleted-course-bundle?_method=PUT`;
    $(".restore_bundle_form").attr("action", url);
  });
  // --------------- @Bundle Script End @.v1 ---------------- //

  // --------------- @Diploma Script Starts @.v1 ---------------- //
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
    let ans = [optionOne, optionTwo, optionThree, optionFour];
    if (!ans.includes(answer)) {
      error = true;
      $("#answer").after(
        "<small class='text-danger err-message'>Answer must be exclusively from given options.</small>"
      );
    }

    return !error;
  });

  // Edit diploma questions
  $(".edit_diploma_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const questionNumber = $("#questionNumber_edit").val().trim();
    const typeOfQuestion = $("#typeOfQuestion-edit").val();
    const question = $("#question_edit").val().trim();
    const optionOne = $("#optionOne_edit").val().trim();
    const optionTwo = $("#optionTwo_edit").val().trim();
    const optionThree = $("#optionThree_edit").val().trim();
    const optionFour = $("#optionFour_edit").val().trim();
    const answer = $("#answer_edit").val().trim();

    if (!questionNumber) {
      error = true;
      $("#questionNumber_edit").after(errMessage);
    }
    if (!typeOfQuestion) {
      error = true;
      $("#typeOfQuestion-edit").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#diploma_question_edit").after(errMessage);
    }
    if (typeOfQuestion !== "yesOrNo") {
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
    }
    if (!answer) {
      error = true;
      $("#answer_edit").after(errMessage);
    }
    return !error;
  });

  let editDiplomaOptionArray = [];
  $(".diploma_question_edit_btn").on("click", function () {
    const question = $(this).data("question");
    const diplomaId = $(this).data("diplomaid");
    const quizQuestionId = $(this).data("quizquestionid");
    let questionNumber = $(this).data("questionnumber");

    const url = `/api/creator/diploma/${diplomaId}/question/${quizQuestionId}?_method=PUT&questionNumber=${questionNumber}`;
    $(".diploma_edit_question_form").attr("action", url);

    $(".diploma_edit_question_form #questionNumber_edit").val(
      question.questionNumber
    );
    $(".diploma_edit_question_form #typeOfQuestion-edit").val(
      question.typeOfQuestion
    );
    $(".diploma_edit_question_form #question_edit").val(question.question);

    if (question.typeOfQuestion !== "yesOrNo") {
      $(".diploma_edit_question_form .option-wrap-edit").empty();
      $(".diploma_edit_question_form .option-wrap-edit").html(`
      <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionOne_edit" class="text-dark">Option 1</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionOne_edit"
                          name="optionOne"
                          placeholder="Option 1"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionTwo_edit" class="text-dark">Option 2</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionTwo_edit"
                          name="optionTwo"
                          placeholder="Option 2"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionThree_edit" class="text-dark">Option 3</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionThree_edit"
                          name="optionThree"
                          placeholder="Option 3"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionFour_edit" class="text-dark">Option 4</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionFour_edit"
                          name="optionFour"
                          placeholder="Option 4"
                        />
                      </div>
                    </div>
                  </div>
      `);

      $(".diploma_edit_question_form #optionOne_edit").val(question.choice[0]);
      $(".diploma_edit_question_form #optionTwo_edit").val(question.choice[1]);
      $(".diploma_edit_question_form #optionThree_edit").val(
        question.choice[2]
      );
      $(".diploma_edit_question_form #optionFour_edit").val(question.choice[3]);

      for (let i = 0; i < $("._option_edit").length; i++) {
        editDiplomaOptionArray.push({
          id: $($("._option_edit")[i]).attr("id"),
          value: $($("._option_edit")[i]).val().trim(),
        });
      }
      $(".diploma_edit_question_form #answer_edit").empty();

      question.choice.forEach((option) => {
        $(".diploma_edit_question_form #answer_edit").append(
          $("<option>", {
            value: option,
            text: option,
          })
        );
      });

      if (question.typeOfQuestion === "singleSelect") {
        if (
          $(".diploma_edit_question_form #answer_edit").hasClass(
            "select2-multi-select"
          )
        ) {
          $(".diploma_edit_question_form #answer_edit").removeClass(
            "select2-multi-select"
          );
          $(".diploma_edit_question_form #answer_edit").removeClass(
            "quiz-answer-select-edit"
          );
          $(".diploma_edit_question_form #answer_edit").removeAttr(
            "multiple",
            true
          );
          $(".diploma_edit_question_form #answer_edit").select2("destroy");
        }
        $(".diploma_edit_question_form #answer_edit").val(
          question.singleSelect
        );
      } else {
        $(".diploma_edit_question_form #answer_edit").addClass(
          "select2-multi-select"
        );
        $(".diploma_edit_question_form #answer_edit").addClass(
          "quiz-answer-select-edit"
        );
        $(".diploma_edit_question_form #answer_edit").attr("multiple", true);
        $(".diploma_edit_question_form #answer_edit").select2({
          dropdownParent: $(".diploma_edit_question_form"),
        });
        $(".diploma_edit_question_form #answer_edit")
          .val(question.multiSelect)
          .trigger("change");
      }
    } else {
      if (
        $(".diploma_edit_question_form #answer_edit").hasClass(
          "select2-multi-select"
        )
      ) {
        $(".diploma_edit_question_form #answer_edit").removeClass(
          "select2-multi-select"
        );
        $(".diploma_edit_question_form #answer_edit").removeClass(
          "quiz-answer-select-edit"
        );
        $(".diploma_edit_question_form #answer_edit").removeAttr(
          "multiple",
          true
        );
        $(".diploma_edit_question_form #answer_edit").select2("destroy");
      }

      $(".diploma_edit_question_form .option-wrap-edit").empty();
      $(".diploma_edit_question_form #answer_edit").empty();
      $(".diploma_edit_question_form #answer_edit").append(
        $("<option>", {
          value: "true",
          text: "Yes",
        })
      );
      $(".diploma_edit_question_form #answer_edit").append(
        $("<option>", {
          value: "false",
          text: "No",
        })
      );
      $(".diploma_edit_question_form #answer_edit").val(
        question.yesOrNo ? "true" : "false"
      );
    }
  });

  $("#typeOfQuestion-edit").on("change", function () {
    if ($(this).val() === "yesOrNo") {
      if (
        $(".diploma_edit_question_form #answer_edit").hasClass(
          "select2-multi-select"
        )
      ) {
        $(".diploma_edit_question_form #answer_edit").removeClass(
          "select2-multi-select"
        );
        $(".diploma_edit_question_form #answer_edit").removeClass(
          "quiz-answer-select-edit"
        );
        $(".diploma_edit_question_form #answer_edit").removeAttr(
          "multiple",
          true
        );
        $(".diploma_edit_question_form #answer_edit").select2("destroy");
      }

      $(".option-wrap-edit").empty();
      $(".diploma_edit_question_form #answer_edit").empty();

      $(".diploma_edit_question_form #answer_edit").append(
        $("<option>", {
          value: "true",
          text: "Yes",
        })
      );
      $(".diploma_edit_question_form #answer_edit").append(
        $("<option>", {
          value: "false",
          text: "No",
        })
      );
    } else {
      editDiplomaOptionArray = [];
      if ($(this).val() === "multiSelect") {
        $(".diploma_edit_question_form #answer_edit").addClass(
          "select2-multi-select"
        );
        $(".diploma_edit_question_form #answer_edit").addClass(
          "quiz-answer-select-edit"
        );
        $(".diploma_edit_question_form #answer_edit").attr("multiple", true);
        $(".diploma_edit_question_form #answer_edit").select2({
          dropdownParent: $(".diploma_edit_question_form"),
        });
      } else {
        if (
          $(".diploma_edit_question_form #answer_edit").hasClass(
            "select2-multi-select"
          )
        ) {
          $(".diploma_edit_question_form #answer_edit").removeClass(
            "select2-multi-select"
          );
          $(".diploma_edit_question_form #answer_edit").removeClass(
            "quiz-answer-select-edit"
          );
          $(".diploma_edit_question_form #answer_edit").removeAttr(
            "multiple",
            true
          );
          $(".diploma_edit_question_form #answer_edit").select2("destroy");
        }
      }

      $(".diploma_edit_question_form .option-wrap-edit").html(`
      <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionOne_edit" class="text-dark">Option 1</label>
                        <input
                          type="text"
                          class="form-control _option-edit"
                          id="optionOne_edit"
                          name="optionOne"
                          placeholder="Option 1"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionTwo_edit" class="text-dark">Option 2</label>
                        <input
                          type="text"
                          class="form-control _option-edit"
                          id="optionTwo_edit"
                          name="optionTwo"
                          placeholder="Option 2"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionThree_edit" class="text-dark">Option 3</label>
                        <input
                          type="text"
                          class="form-control _option-edit"
                          id="optionThree_edit"
                          name="optionThree"
                          placeholder="Option 3"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionFour_edit" class="text-dark">Option 4</label>
                        <input
                          type="text"
                          class="form-control _option-edit"
                          id="optionFour_edit"
                          name="optionFour"
                          placeholder="Option 4"
                        />
                      </div>
                    </div>
                  </div>
      `);

      let optionOne = $("#optionOne_edit").val().trim();
      let optionTwo = $("#optionTwo_edit").val().trim();
      let optionThree = $("#optionThree_edit").val().trim();
      let optionFour = $("#optionFour_edit").val().trim();

      let options = [optionOne, optionTwo, optionThree, optionFour];
      options = options.filter((op) => op);

      $(".diploma_edit_question_form #answer_edit").empty();

      options.forEach((option) => {
        $(".diploma_edit_question_form #answer_edit").append(
          $("<option>", {
            value: option,
            text: option,
          })
        );
      });
    }
  });

  $(document).on("change", "._option-edit", function () {
    if (!$(this).val().trim()) {
      editDiplomaOptionArray = editDiplomaOptionArray.filter((option) => {
        return option.id !== $(this).attr("id");
      });
    } else {
      let isPresent = editDiplomaOptionArray.find(
        (elm) => elm.id === $(this).attr("id")
      );

      if (isPresent) {
        editDiplomaOptionArray = editDiplomaOptionArray.map((opt) => {
          if (opt.id === $(this).attr("id")) {
            opt.value = $(this).val().trim();
          }
          return opt;
        });
      } else {
        editDiplomaOptionArray.push({
          id: $(this).attr("id"),
          value: $(this).val().trim(),
        });
      }
    }

    $(".diploma_edit_question_form #answer_edit").empty();
    editDiplomaOptionArray.forEach((option) => {
      $(".diploma_edit_question_form #answer_edit").append(
        $("<option>", {
          value: option.value,
          text: option.value,
        })
      );
    });
  });

  // Delete diploma question
  $(".delete_diploma_question").on("click", function () {
    const diplomaId = $(this).data("diplomaid");
    const quizQuestionId = $(this).data("quizquestionid");
    const questionId = $(this).data("questionid");

    let url = `/api/creator/diploma/${diplomaId}/question/${quizQuestionId}?_method=DELETE&questionId=${questionId}`;
    $(".delete_diploma_question_form").attr("action", url);
  });
  // --------------- @Diploma Script End @.v1 ---------------- //

  // --------------- @Instructor Script Starts @.v1 ---------------- //
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
      $("#confirmPassword").after(
        "<small class='text-danger err-message'>Password and confirm password does not match.</small>"
      );
    }
    return !error;
  });

  // Edit instructor btn
  $(".edit_instructor_btn").on("click", function () {
    const instructor = $(this).data("instructor");

    let url = `/api/creator/instructor/${instructor._id}?_method=PUT&from=listing`;
    $(".edit_instructor_form").attr("action", url);

    $("#edit_name").val(instructor.name);
    $("#edit_email").val(instructor.email);
    $("#edit_designation").val(instructor.designation);
    $("#edit_description").summernote("code", instructor.description);
    if (instructor.profileImg) {
      setPreview(
        `/uploads/instructors/profile/${instructor.profileImg}`,
        "#edit_profileImage"
      );
    }

    let modules = $(".edit_instructor_form input[name=modules]");
    Object.entries(modules).forEach((mod) => {
      if ($(mod.at(-1)).hasClass("custom-control-input")) {
        $(mod[1]).prop("checked", false);
        if (instructor.modules.includes($(mod[1]).val())) {
          $(mod[1]).prop("checked", true);
        }
      }
    });
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
    } else if (!ValidateEmail(email)) {
      error = true;
      $("#edit_email").after(
        `<small class='text-danger err-message'>Please enter valid email.</small>`
      );
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
    let url = `/api/creator/instructor/${id}/change-instructor-password?_method=PUT&from=listing`;
    $(".reset_instructor_password_form").attr("action", url);
  });

  $(".instructor_edit_password").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    let newPassword = $("#new_pass").val().trim();
    let confirmPassword = $("#confirm_pass").val().trim();

    if (!newPassword) {
      error = true;
      $("#new_pass").after(errMessage);
    } else if (newPassword.length < 8) {
      error = true;
      $("#new_pass").after(
        "<small class='text-danger err-message'>Password must be 8 or more characters.</small>"
      );
    }

    if (!confirmPassword) {
      error = true;
      $("#confirm_pass").after(errMessage);
    } else if (newPassword.length < 8) {
      error = true;
      $("#confirm_pass").after(
        "<small class='text-danger err-message'>Password must be 8 or more characters.</small>"
      );
    }

    if (newPassword !== confirmPassword) {
      error = true;
      $("#confirm_pass").after(
        "<small class='text-danger err-message'>Password and confirm password does not match.</small>"
      );
    }

    return !error;
  });

  // instructor update status
  $(".instructor_status_toggle_btn").on("click", function () {
    let id = $(this).data("id");
    let status = $(this).data("status");
    let url = `/api/creator/instructor/${id}/change-instructor-status?_method=PUT&status=${status}&from=listing`;
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
  // --------------- @Instructor Script End @.v1 ---------------- //

  // --------------- @Product Script Starts @.v1 ---------------- //
  $(".product_add").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const skuNumber = $("#skuNumber").val();
    const title = $("#title").val();
    const excerpt = $("#excerpt").val();
    const price = $("#price").val();
    const discountedPrice = $("#discountedPrice").val();
    const level = $("#level").val();
    const language = $("#language").val();
    const category = $("#category").val();

    if (!skuNumber || !skuNumber.trim()) {
      error = true;
      $("#skuNumber").after(errMessage);
    }
    if (!title || !title.trim()) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!excerpt || !excerpt.trim()) {
      error = true;
      $("#excerpt").after(errMessage);
    }
    if (!price || !price.trim()) {
      error = true;
      $("#price").after(errMessage);
    }
    if (!discountedPrice || !discountedPrice.trim()) {
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
    if (!category || !category.trim()) {
      error = true;
      $("#category").before(errMessage);
    }

    return !error;
  });

  $(".add_product_category").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const category = $("#category").val().trim();

    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }

    return !error;
  });

  $(".add_product_category_using_ajax").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const category = $("#category_product").val().trim();

    if (!category) {
      error = true;
      $("#category_product").after(errMessage);
    }

    if (!error) {
      $.ajax({
        type: "POST",
        url: `/api/creator/product/category/add?type=autoset`,
        data: {
          title: category,
        },
        success: function ({ category, success }) {
          if (success) {
            $("#categoryModal #category_product").val("");
            $("#categoryModal").modal("hide");

            $("#category").load(location.href + " #category>*", "");
            setTimeout(() => {
              $("#category option").each(function () {
                if ($(this).val() === category) {
                  $(this).prop("selected", true);
                }
              });
            }, 500);
          }
        },
      });
    }
  });

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
      });
    }
  });

  // Restore product
  $(".restore_product_btn").on("click", function () {
    let productId = $(this).data("id");
    let url = `/api/creator/product/${productId}/restore-deleted-product?_method=PUT`;
    $(".restore_product_form").attr("action", url);
  });

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
  // --------------- @Product Script End @.v1 ---------------- //

  // --------------- @Quiz Script Starts @.v1 ---------------- //
  let optionsArray = [];
  $("#typeOfQuestion").on("change", function () {
    if ($(this).val() === "yesOrNo") {
      if ($("#answer").hasClass("select2-multi-select")) {
        // Destroy select-2
        $("#answer").removeClass("select2-multi-select");
        $("#answer").removeClass("quiz-answer-select");
        $("#answer").removeAttr("multiple");
        $("#answer").select2("destroy");
      }

      $(".option-wrap").empty();
      $("#answer").empty();
      $("#answer").append(
        $("<option>", {
          value: "true",
          text: "Yes",
        })
      );
      $("#answer").append(
        $("<option>", {
          value: "false",
          text: "No",
        })
      );
    } else {
      optionsArray = [];
      if ($(this).val() === "multiSelect") {
        $("#answer").addClass("select2-multi-select");
        $("#answer").addClass("quiz-answer-select");
        $("#answer").attr("multiple", true);
        $(".quiz-answer-select").select2({
          dropdownParent: $(".quiz-add-form"),
        });
      } else {
        if ($("#answer").hasClass("select2-multi-select")) {
          $("#answer").removeClass("select2-multi-select");
          $("#answer").removeClass("quiz-answer-select");
          $("#answer").removeAttr("multiple");
          $("#answer").select2("destroy");
        }
      }
      $(".option-wrap").html(`
      <div class="row">
      <div class="col-12">
        <div class="form-group">
          <label for="optionOne" class="text-dark">Option 1</label>
          <input
            type="text"
            class="form-control _option"
            id="optionOne"
            name="optionOne"
            placeholder="Option 1"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="optionTwo" class="text-dark">Option 2</label>
          <input
            type="text"
            class="form-control _option"
            id="optionTwo"
            name="optionTwo"
            placeholder="Option 2"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="optionThree" class="text-dark">Option 3</label>
          <input
            type="text"
            class="form-control _option"
            id="optionThree"
            name="optionThree"
            placeholder="Option 3"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="optionFour" class="text-dark">Option 4</label>
          <input
            type="text"
            class="form-control _option"
            id="optionFour"
            name="optionFour"
            placeholder="Option 4"
          />
        </div>
      </div>
    </div>

      `);

      let optionOne = $("#optionOne").val().trim();
      let optionTwo = $("#optionTwo").val().trim();
      let optionThree = $("#optionThree").val().trim();
      let optionFour = $("#optionFour").val().trim();

      let options = [optionOne, optionTwo, optionThree, optionFour];
      options = options.filter((op) => op);
      $("#answer").empty();
      options.forEach((option) => {
        $("#answer").append(
          $("<option>", {
            value: option,
            text: option,
          })
        );
      });
    }
  });

  $(document).on("change", "._option", function () {
    if (!$(this).val().trim()) {
      optionsArray = optionsArray.filter((option) => {
        return option.id !== $(this).attr("id");
      });
    } else {
      optionsArray.push({
        id: $(this).attr("id"),
        value: $(this).val().trim(),
      });
    }

    $("#answer").empty();
    optionsArray.forEach((option) => {
      $("#answer").append(
        $("<option>", {
          value: option.value,
          text: option.value,
        })
      );
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
    let topic = $(this).data("topic");
    let topicValue = $(this).data("topic-name");
    console.log(topic, "topicValue")

    let newUrl = `/api/creator/quiz/${courseId}/${quiz._id}?_method=PUT`;
    $(".quiz-edit-form").attr("action", newUrl);

    $(".quiz-edit-form #quizTitle").val(quiz.title);
    // $(".quiz-edit-form #topic").val(topic);
    $(".quiz-edit-form .alert .topic-value").text(topicValue.toString().replace(/"/g, ''));
    
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

  $(".add_quiz_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const questionNumber = $("#questionNumber").val().trim();
    const typeOfQuestion = $("#typeOfQuestion").val();
    const question = $("#question").val().trim();
    const answer = $("#answer").val();

    const optionOne = $("#optionOne").val();
    const optionTwo = $("#optionTwo").val();
    const optionThree = $("#optionThree").val();
    const optionFour = $("#optionFour").val();

    if (!questionNumber) {
      error = true;
      $("#questionNumber").after(errMessage);
    }
    if (!typeOfQuestion) {
      error = true;
      $("#typeOfQuestion").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#question").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#answer").after(errMessage);
    }
    if (typeOfQuestion !== "yesOrNo") {
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
    }
    return !error;
  });

  let editQuizOptionArray = [];
  $(".edit_question_btn").on("click", function () {
    let question = $(this).data("question");
    let quizId = $(this).data("quizid");
    let quizquestionid = $(this).data("quizquestionid");
    let questionNumber = $(this).data("questionnumber");

    const url = `/api/creator/quiz/${quizId}/question/${quizquestionid}?_method=PUT&questionNumber=${questionNumber}`;

    $(".edit_quiz_question_form").attr("action", url);

    $(".edit_quiz_question_form #questionNumber_edit").val(
      question.questionNumber
    );
    $(".edit_quiz_question_form #typeOfQuestion_edit").val(
      question.typeOfQuestion
    );
    $(".edit_quiz_question_form #question_edit").val(question.question);

    if (question.typeOfQuestion !== "yesOrNo") {
      $(".edit_quiz_question_form .option-wrap-edit").empty();
      $(".edit_quiz_question_form .option-wrap-edit").html(`
      <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionOne_edit" class="text-dark">Option 1</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionOne_edit"
                          name="optionOne"
                          placeholder="Option 1"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionTwo_edit" class="text-dark">Option 2</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionTwo_edit"
                          name="optionTwo"
                          placeholder="Option 2"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionThree_edit" class="text-dark">Option 3</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionThree_edit"
                          name="optionThree"
                          placeholder="Option 3"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionFour_edit" class="text-dark">Option 4</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionFour_edit"
                          name="optionFour"
                          placeholder="Option 4"
                        />
                      </div>
                    </div>
                  </div>
      `);

      $(".edit_quiz_question_form #optionOne_edit").val(question.choice[0]);
      $(".edit_quiz_question_form #optionTwo_edit").val(question.choice[1]);
      $(".edit_quiz_question_form #optionThree_edit").val(question.choice[2]);
      $(".edit_quiz_question_form #optionFour_edit").val(question.choice[3]);

      for (let i = 0; i < $("._option_edit").length; i++) {
        editQuizOptionArray.push({
          id: $($("._option_edit")[i]).attr("id"),
          value: $($("._option_edit")[i]).val().trim(),
        });
      }
      $(".edit_quiz_question_form #answer_edit").empty();

      question.choice.forEach((option) => {
        $(".edit_quiz_question_form #answer_edit").append(
          $("<option>", {
            value: option,
            text: option,
          })
        );
      });

      if (question.typeOfQuestion === "singleSelect") {
        if (
          $(".edit_quiz_question_form #answer_edit").hasClass(
            "select2-multi-select"
          )
        ) {
          $(".edit_quiz_question_form #answer_edit").removeClass(
            "select2-multi-select"
          );
          $(".edit_quiz_question_form #answer_edit").removeClass(
            "quiz-answer-select-edit"
          );
          $(".edit_quiz_question_form #answer_edit").removeAttr(
            "multiple",
            true
          );
          $(".edit_quiz_question_form #answer_edit").select2("destroy");
        }

        $(".edit_quiz_question_form #answer_edit").val(question.singleSelect);
      } else {
        $(".edit_quiz_question_form #answer_edit").addClass(
          "select2-multi-select"
        );
        $(".edit_quiz_question_form #answer_edit").addClass(
          "quiz-answer-select-edit"
        );
        $(".edit_quiz_question_form #answer_edit").attr("multiple", true);
        $(".edit_quiz_question_form #answer_edit").select2({
          dropdownParent: $(".edit_quiz_question_form"),
        });
        $(".edit_quiz_question_form #answer_edit")
          .val(question.multiSelect)
          .trigger("change");
      }
    } else {
      if (
        $(".edit_quiz_question_form #answer_edit").hasClass(
          "select2-multi-select"
        )
      ) {
        $(".edit_quiz_question_form #answer_edit").removeClass(
          "select2-multi-select"
        );
        $(".edit_quiz_question_form #answer_edit").removeClass(
          "quiz-answer-select-edit"
        );
        $(".edit_quiz_question_form #answer_edit").removeAttr("multiple", true);
        $(".edit_quiz_question_form #answer_edit").select2("destroy");
      }

      $(".edit_quiz_question_form .option-wrap-edit").empty();
      $(".edit_quiz_question_form #answer_edit").empty();
      $(".edit_quiz_question_form #answer_edit").append(
        $("<option>", {
          value: "true",
          text: "Yes",
        })
      );
      $(".edit_quiz_question_form #answer_edit").append(
        $("<option>", {
          value: "false",
          text: "No",
        })
      );
      $(".edit_quiz_question_form #answer_edit").val(
        question.yesOrNo ? "true" : "false"
      );
    }
  });

  $("#typeOfQuestion_edit").on("change", function () {
    if ($(this).val() === "yesOrNo") {
      if (
        $(".edit_quiz_question_form #answer_edit").hasClass(
          "select2-multi-select"
        )
      ) {
        $(".edit_quiz_question_form #answer_edit").removeClass(
          "select2-multi-select"
        );
        $(".edit_quiz_question_form #answer_edit").removeClass(
          "quiz-answer-select-edit"
        );
        $(".edit_quiz_question_form #answer_edit").removeAttr("multiple", true);
        $(".edit_quiz_question_form #answer_edit").select2("destroy");
      }

      $(".option-wrap-edit").empty();
      $(".edit_quiz_question_form #answer_edit").empty();

      $(".edit_quiz_question_form #answer_edit").append(
        $("<option>", {
          value: "true",
          text: "Yes",
        })
      );
      $(".edit_quiz_question_form #answer_edit").append(
        $("<option>", {
          value: "false",
          text: "No",
        })
      );
    } else {
      editQuizOptionArray = [];
      if ($(this).val() === "multiSelect") {
        $(".edit_quiz_question_form #answer_edit").addClass(
          "select2-multi-select"
        );
        $(".edit_quiz_question_form #answer_edit").addClass(
          "quiz-answer-select-edit"
        );
        $(".edit_quiz_question_form #answer_edit").attr("multiple", true);
        $(".edit_quiz_question_form #answer_edit").select2({
          dropdownParent: $(".edit_quiz_question_form"),
        });
      } else {
        if (
          $(".edit_quiz_question_form #answer_edit").hasClass(
            "select2-multi-select"
          )
        ) {
          $(".edit_quiz_question_form #answer_edit").removeClass(
            "select2-multi-select"
          );
          $(".edit_quiz_question_form #answer_edit").removeClass(
            "quiz-answer-select-edit"
          );
          $(".edit_quiz_question_form #answer_edit").removeAttr(
            "multiple",
            true
          );
          $(".edit_quiz_question_form #answer_edit").select2("destroy");
        }
      }

      $(".edit_quiz_question_form .option-wrap-edit").html(`
      <div class="row">
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionOne_edit" class="text-dark">Option 1</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionOne_edit"
                          name="optionOne"
                          placeholder="Option 1"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionTwo_edit" class="text-dark">Option 2</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionTwo_edit"
                          name="optionTwo"
                          placeholder="Option 2"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionThree_edit" class="text-dark">Option 3</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionThree_edit"
                          name="optionThree"
                          placeholder="Option 3"
                        />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="form-group">
                        <label for="optionFour_edit" class="text-dark">Option 4</label>
                        <input
                          type="text"
                          class="form-control _option_edit"
                          id="optionFour_edit"
                          name="optionFour"
                          placeholder="Option 4"
                        />
                      </div>
                    </div>
                  </div>
      `);

      let optionOne = $("#optionOne_edit").val().trim();
      let optionTwo = $("#optionTwo_edit").val().trim();
      let optionThree = $("#optionThree_edit").val().trim();
      let optionFour = $("#optionFour_edit").val().trim();

      let options = [optionOne, optionTwo, optionThree, optionFour];
      options = options.filter((op) => op);

      $(".edit_quiz_question_form #answer_edit").empty();
      options.forEach((option) => {
        $(".edit_quiz_question_form #answer_edit").append(
          $("<option>", {
            value: option,
            text: option,
          })
        );
      });
    }
  });

  $(document).on("change", "._option_edit", function () {
    if (!$(this).val().trim()) {
      editQuizOptionArray = editQuizOptionArray.filter((option) => {
        return option.id !== $(this).attr("id");
      });
    } else {
      let isPresent = editQuizOptionArray.find(
        (elm) => elm.id === $(this).attr("id")
      );
      if (isPresent) {
        editQuizOptionArray = editQuizOptionArray.map((opt) => {
          if (opt.id === $(this).attr("id")) {
            opt.value = $(this).val().trim();
          }
          return opt;
        });
      } else {
        editQuizOptionArray.push({
          id: $(this).attr("id"),
          value: $(this).val().trim(),
        });
      }
    }
    $(".edit_quiz_question_form #answer_edit").empty();
    editQuizOptionArray.forEach((option) => {
      $(".edit_quiz_question_form #answer_edit").append(
        $("<option>", {
          value: option.value,
          text: option.value,
        })
      );
    });
  });

  $(".edit_quiz_question").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const question = $("#question_edit").val().trim();
    const noOfQuestion = $("#questionNumber_edit").val().trim();
    const typeOfQuestion = $("#typeOfQuestion_edit").val();
    const optionOne = $("#optionOne_edit").val().trim();
    const optionTwo = $("#optionTwo_edit").val().trim();
    const optionThree = $("#optionThree_edit").val().trim();
    const optionFour = $("#optionFour_edit").val().trim();
    const answer = $("#answer_edit").val();

    if (!noOfQuestion) {
      error = true;
      $("#questionNumber_edit").after(errMessage);
    }
    if (!typeOfQuestion) {
      error = true;
      $("#typeOfQuestion_edit").after(errMessage);
    }
    if (!question) {
      error = true;
      $("#question_edit").after(errMessage);
    }
    if (typeOfQuestion !== "yesOrNo") {
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
    }
    if (!answer) {
      error = true;
      $("#answer_edit").after(errMessage);
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
  // --------------- @Quiz Script End @.v1 ---------------- //

  // --------------- @Sub-Creator Script Starts @.v1 ---------------- //
  $(".add-sub-creator").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;
    let phoneRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;

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
      $("#phone").after(
        "<small class='text-danger err-message'>Please enter valid phone number.</small>"
      );
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
  // --------------- @Sub-Creator Script End @.v1 ---------------- //

  // --------------- @Announcement Script Start @.v1 ---------------- //
  // Add announcement
  $(".add_announcement").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const announcement = $("#announcement").val().trim();
    const status = $("#status").val().trim();

    if (!announcement) {
      error = true;
      $("#announcement").after(errMessage);
    }
    if (!status) {
      error = true;
      $("#status").after(errMessage);
    }

    return !error;
  });

  // Edit Announcement Assign values
  $(".edit_announcement_btn").on("click", function () {
    const { announcement, status, _id } = $(this).data("announcement");
    let url = `/api/creator/announcement/${_id}?_method=PUT`;
    $(".edit_announcement_form").attr("action", url);

    $(".edit_announcement_form #announcement_edit").val(announcement);

    $(".edit_announcement_form option:eq(0)").prop("selected", status);
    $(".edit_announcement_form option:eq(1)").prop("selected", !status);
  });

  // Edit Announcement
  $(".edit_announcement_form").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const announcement = $("#announcement_edit").val().trim();
    const status = $("#status_edit").val().trim();

    if (!announcement) {
      error = true;
      $("#announcement_edit").after(errMessage);
    }
    if (!status) {
      error = true;
      $("#status_edit").after(errMessage);
    }

    return !error;
  });

  // Delete Announcement
  $(".delete_announcement_btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/announcement/${id}?_method=DELETE`;
    $(".delete_announcement_form").attr("action", url);
  });

  // --------------- @Announcement Script End @.v1 ---------------- //

  // --------------- @Banner Script Start @.v1 ---------------- //
  // Set Offer Type
  $("#offerItem").on("change", function () {
    $("#offerItemType").val($(this).find(":selected").data("type"));
  });

  //Add banner
  $(".add_banner").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const headingOne = $("#headingOne").val().trim();
    const headingTwo = $("#headingTwo").val().trim();
    const screenType = $("#screenType").val().trim();
    const description = $("#description").val().trim();
    const bannerImage = $("#bannerImage").val().trim();

    if (!headingOne) {
      error = true;
      $("#headingOne").after(errMessage);
    }
    if (!headingTwo) {
      error = true;
      $("#headingTwo").after(errMessage);
    }
    if (!screenType) {
      error = true;
      $("#screenType").after(errMessage);
    }
    if (!description) {
      error = true;
      $("#description").next().after(errMessage);
    }
    if (!bannerImage) {
      error = true;
      $("#bannerImage").parent().after(errMessage);
    }
    return !error;
  });

  // Edit banner Assign values
  $(".edit_banner_btn").on("click", function () {
    const banner = $(this).data("banner");
    let url = `/api/creator/banner/${banner._id}?_method=PUT`;

    $(".edit-banner-form").attr("action", url);
    $(".edit-banner-form #headingOne_edit").val(banner.headingOne);
    $(".edit-banner-form #headingTwo_edit").val(banner.headingTwo);
    $(".edit-banner-form #screenType_edit").val(banner.screenType);
    if (banner.bannerLinks && banner.bannerLinks.enroll) {
      $(".edit-banner-form #enrollLink_edit").val(banner.bannerLinks.enroll);
    }
    if (banner.bannerLinks && banner.bannerLinks.trial) {
      $(".edit-banner-form #trialLink_edit").val(banner.bannerLinks.trial);
    }
    if (banner.offerItem) {
      $(".edit-banner-form #offerItem_edit").val(banner.offerItem._id);
    }
    $(".edit-banner-form #description_edit").summernote(
      "code",
      banner.description
    );
    setPreview(
      `/uploads/banners/${banner.bannerImg}`,
      ".edit-banner-form #bannerImage_edit"
    );
  });

  // Set Offer Type
  $("#offerItem_edit").on("change", function () {
    $("#offerItemType_edit").val($(this).find(":selected").data("type"));
  });

  $(".edit_banner").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const headingOne = $("#headingOne_edit").val().trim();
    const headingTwo = $("#headingTwo_edit").val().trim();
    const screenType = $("#screenType_edit").val().trim();
    const description = $("#description_edit").val().trim();

    if (!headingOne) {
      error = true;
      $("#headingOne_edit").after(errMessage);
    }
    if (!headingTwo) {
      error = true;
      $("#headingTwo_edit").after(errMessage);
    }
    if (!screenType) {
      error = true;
      $("#screenType_edit").after(errMessage);
    }
    if (!description) {
      error = true;
      $("#description_edit").next().after(errMessage);
    }
    return !error;
  });

  // video popup
  $(".banner-actions").on("click", function () {
    const videoId = $(this).data("id");

    const url = `https://www.youtube.com/embed/${videoId}`;
    $("#youtubeVideo").attr("src", url);
  });

  // delete banner
  $(".delete_banner_btn").on("click", function () {
    const bannerId = $(this).data("id");

    const url = `/api/creator/banner/${bannerId}?_method=DELETE`;
    $("#delete_banner_form").attr("action", url);
  });
  // --------------- @Banner Script End @.v1 ---------------- //

  // --------------- @Contact Script Start @.v1 ---------------- //
  // Show contact details modal
  $(".show-contact-details").on("click", function () {
    const contact = $(this).data("contact");
    $(".detail-modal h5").text(contact.name);
    $(".detail-modal h6").text(contact.subject);
    $(".detail-modal .contact-email").attr("href", `mailto:${contact.email}`);
    $(".detail-modal .contact-email").text(contact.email);
    $(".detail-modal .contact-phone").attr("href", `tel:${contact.number}`);
    $(".detail-modal .contact-phone").text(contact.number);
    $(".detail-modal .contact-description").text(contact.description);
    $(".detail-modal .contact-date").text(
      moment(contact.createdAt).format("ll")
    );
  });

  // Delete contact
  $(".delete-contact-btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/contact/${id}?_method=DELETE`;
    $(".delete-contact-form").attr("action", url);
  });
  // --------------- @Contact Script End @.v1 ---------------- //

  // --------------- @Testimonial Script Start @.v1 ---------------- //
  // Add testimonial
  $(".add_testimonial").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    let name = $("#name").val().trim();
    let designation = $("#designation").val().trim();
    let description = $("#description").val();
    let testimonialProfile = $("#testimonialProfile").val().trim();

    if (!name) {
      error = true;
      $("#name").after(errMessage);
    }
    if (!designation) {
      error = true;
      $("#designation").after(errMessage);
    }
    if (!description) {
      error = true;
      $("#description").next().after(errMessage);
    }
    if (!testimonialProfile) {
      error = true;
      $("#testimonialProfile").parent().after(errMessage);
    }

    return !error;
  });

  // Edit testimonial Assign value
  $(".edit-testimonial-btn").on("click", function () {
    const testimonial = $(this).data("testimonial");

    let url = `/api/creator/testimonial/${testimonial._id}?_method=PUT`;
    $(".edit-testimonial-form").attr("action", url);

    $(".edit-testimonial-form #edit_name").val(testimonial.name);
    $(".edit-testimonial-form #edit_designation").val(testimonial.designation);
    $(".edit-testimonial-form #edit_description").summernote(
      "code",
      testimonial.description
    );
    if (testimonial.profile) {
      setPreview(
        `/uploads/testimonials/${testimonial.profile}`,
        ".edit-testimonial-form #edit_testimonialProfile"
      );
    }
  });

  // Edit testimonial
  $(".edit_testimonial").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    let name = $("#edit_name").val().trim();
    let designation = $("#edit_designation").val().trim();
    let description = $("#edit_description").val();

    if (!name) {
      error = true;
      $("#edit_name").after(errMessage);
    }
    if (!designation) {
      error = true;
      $("#edit_designation").after(errMessage);
    }
    if (!description) {
      error = true;
      $("#edit_description").next().after(errMessage);
    }

    return !error;
  });

  // Delete testimonial
  $(".delete-testimonial-btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/testimonial/${id}?_method=DELETE`;
    $(".delete-testimonial-form").attr("action", url);
  });
  // --------------- @Testimonial Script End @.v1 ---------------- //

  // --------------- @Feedback videos Script Start @.v1 ---------------- //
  // Add video
  $(".add-feedback").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();
    const videoId = $("#videoId").val().trim();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!videoId) {
      error = true;
      $("#videoId").after(errMessage);
    }

    return !error;
  });

  // Edit feedback assign values
  $(".edit-feedback-btn").on("click", function () {
    const feedback = $(this).data("feedback");
    let url = `/api/creator/feedback/${feedback._id}?_method=PUT`;
    $(".edit-feedback-form").attr("action", url);

    $(".edit-feedback-form #title_edit").val(feedback.title);
    $(".edit-feedback-form #videoId_edit").val(feedback.videoId);
  });

  // Edit feedback
  $(".edit-feedback").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title_edit").val().trim();
    const videoId = $("#videoId_edit").val().trim();

    if (!title) {
      error = true;
      $("#title_edit").after(errMessage);
    }
    if (!videoId) {
      error = true;
      $("#videoId_edit").after(errMessage);
    }

    return !error;
  });

  // Delete Feedback Video
  $(".delete-feedback-btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/feedback/${id}?_method=DELETE`;
    $(".delete-feedback-form").attr("action", url);
  });
  // --------------- @Feedback videos Script End @.v1 ---------------- //

  // --------------- @Help Script End @.v1 ---------------- //
  // Add Help
  $(".add_help").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();
    const videoLink = $("#videoLink").val().trim();
    const posterImage = $("#posterImage").val().trim();
    const summernote = $("#summernote").val();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!videoLink) {
      error = true;
      $("#videoLink").after(errMessage);
    }
    if (!posterImage) {
      error = true;
      $("#posterImage").parent().after(errMessage);
    }
    if (!summernote) {
      error = true;
      $("#summernote").next().after(errMessage);
    }

    return !error;
  });

  // Edit help assign values
  $(".edit-help-btn").on("click", function () {
    const help = $(this).data("help");
    let url = `/api/creator/help/${help._id}?_method=PUT`;
    $(".help-edit-form").attr("action", url);

    $(".help-edit-form #edit_title").val(help.title);
    $(".help-edit-form #edit_videoLink").val(help.videoLink);
    $(".help-edit-form #edit_publishHelp").prop("checked", help.status);
    $(".help-edit-form #edit_summernote").summernote("code", help.description);
    setPreview(
      `/uploads/help/posterImage/${help.posterImage}`,
      ".help-edit-form #edit_posterImage"
    );
  });

  // Edit Help
  $(".edit_help").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#edit_title").val().trim();
    const videoLink = $("#edit_videoLink").val().trim();
    const summernote = $("#edit_summernote").val();

    if (!title) {
      error = true;
      $("#edit_title").after(errMessage);
    }
    if (!videoLink) {
      error = true;
      $("#edit_videoLink").after(errMessage);
    }
    if (!summernote) {
      error = true;
      $("#edit_summernote").next().after(errMessage);
    }

    return !error;
  });

  $(".delete-help-btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/help/${id}?_method=DELETE`;
    $(".delete-help-form").attr("action", url);
  });
  // --------------- @Help Script End @.v1 ---------------- //

  // --------------- @FAQ Script Start @.v1 ---------------- //
  // Add Language
  $(".add_faq_language").on("click", function () {
    $(".err-message").remove();
    const language = $("#faq_language").val().trim();
    if (!language) {
      $("#faq_language").after(
        "<small class='text-danger err-message'>This field is required.</small>"
      );
      return false;
    }

    return true;
  });

  $(".edit-faq-language-btn").on("click", function () {
    let title = $(this).data("name");
    let id = $(this).data("id");
    let url = `/api/creator/faq/language/${id}?_method=PUT`;

    $(".edit-faq-language-form").attr("action", url);

    $(".edit-faq-language-form #language_edit").val(title);
  });

  $(".delete-faq-language-btn").on("click", function () {
    let id = $(this).data("id");
    let url = `/api/creator/faq/language/${id}?_method=DELETE`;
    $(".delete-faq-language-form").attr("action", url);
  });

  // Add Category
  $(".add_faq_category").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#faq_category").val().trim();
    if (!title) {
      error = true;
      $("#faq_category").after(errMessage);
    }

    return !error;
  });

  $(".edit-faq-category-btn").on("click", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");
    let url = `/api/creator/faq/category/${id}?_method=PUT`;
    $(".edit-faq-category-form").attr("action", url);
    $(".edit-faq-category-form #category_edit").val(name);
  });

  $(".edit_faq_category").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#category_edit").val().trim();
    if (!title) {
      error = true;
      $("#category_edit").after(errMessage);
    }

    return !error;
  });

  $(".delete-faq-category-btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/faq/category/${id}?_method=DELETE`;
    $(".delete-faq-category-form").attr("action", url);
  });

  // Add FAQ
  $(".add_faq").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const question = $("#question").val().trim();
    const answer = $("#answer").val().trim();
    const language = $("#language").val();

    if (!question) {
      error = true;
      $("#question").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#answer").after(errMessage);
    }
    if (!language) {
      error = true;
      $("#language").after(errMessage);
    }

    return !error;
  });

  $(".edit-faq-btn").on("click", function () {
    const { _id, question, answer, language, category } = $(this).data("faq");
    let url = `/api/creator/faq/${_id}?_method=PUT`;
    $(".edit-faq-form").attr("action", url);

    $(".edit-faq-form #question_edit").val(question);
    $(".edit-faq-form #answer_edit").val(answer);
    $(".edit-faq-form #language_edit").val(language);
    $(".edit-faq-form #category_edit").val(category);
  });

  $(".edit_faq").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const question = $("#question_edit").val().trim();
    const answer = $("#answer_edit").val().trim();
    const language = $("#language_edit").val();

    if (!question) {
      error = true;
      $("#question_edit").after(errMessage);
    }
    if (!answer) {
      error = true;
      $("#answer_edit").after(errMessage);
    }
    if (!language) {
      error = true;
      $("#language_edit").after(errMessage);
    }

    return !error;
  });

  $(".delete-faq-btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/faq/${id}?_method=DELETE`;
    $(".delete-faq-form").attr("action", url);
  });

  // --------------- @FAQ Script End @.v1 ---------------- //

  // --------------- @Blog Script End @.v1 ---------------- //
  // CATEGORY
  $(".add_blog_category").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }

    return !error;
  });

  $(".add_blog_category_using_ajax").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const category = $("#categoryTitle").val().trim();
    if (!category) {
      error = true;
      $("#categoryTitle").after(errMessage);
    }

    if (!error) {
      $.ajax({
        type: "POST",
        url: `/api/creator/blog/category/add?type=autoset`,
        data: { title: category },
        success: function ({ category, success }) {
          if (success) {
            $("#addBlogCategoryModal #categoryTitle").val("");
            $("#addBlogCategoryModal").modal("hide");

            $("#category").load(location.href + " #category>*", "");
            setTimeout(() => {
              $(".blog_add_form #category option").each(function () {
                if ($(this).val() === category) {
                  $(this).prop("selected", true);
                }
              });
            }, 500);
          }
        },
      });
    }
  });

  $(".edit-blog-category-btn").on("click", function () {
    const { _id, title } = $(this).data("blogCategory");
    let url = `/api/creator/blog/category/${_id}?_method=PUT`;

    $(".edit-blog-category-form").attr("action", url);
    $(".edit-blog-category-form #title_edit").val(title);
  });

  $(".edit_blog_category").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title_edit").val().trim();

    if (!title) {
      error = true;
      $("#title_edit").after(errMessage);
    }

    return !error;
  });

  $(".delete-blog-category-btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/blog/category/${id}?_method=DELETE`;
    $(".delete-blog-category-form").attr("action", url);
  });

  // TAG
  $(".add_blog_tag").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val().trim();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }

    return !error;
  });

  $(".add_blog_tag_using_ajax").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const tag = $("#blogTag").val().trim();

    if (!tag) {
      error = true;
      $("#blogTag").after(errMessage);
    }

    if (!error) {
      $.ajax({
        type: "POST",
        url: "/api/creator/blog/tag/add?type=autoset",
        data: { title: tag },
        success: function ({ tag, success }) {
          if (success) {
            let allValues = [];
            allValues.push(tag);
            $("#addBlogTagModal #blogTag").val("");
            $("#addBlogTagModal").modal("hide");

            $("#tags").load(location.href + " #tags>*", "");
            setTimeout(() => {
              let alreadySelected;
              $("#tags").each(function () {
                alreadySelected = $(this).find("option:selected");
              });
              let i = 0;
              while (i < alreadySelected.length) {
                allValues.unshift($(alreadySelected[i]).val());
                i++;
              }
              $("#tags").val(allValues).trigger("change");
            }, 500);
          }
        },
      });
    }
  });

  $(".edit-blog-tag-btn").on("click", function () {
    const { _id, title } = $(this).data("tag");
    let url = `/api/creator/blog/tag/${_id}?_method=PUT`;
    $(".edit-blog-tag-form").attr("action", url);
    $(".edit-blog-tag-form #edit_title").val(title);
  });

  $(".edit-blog-tag").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#edit_title").val().trim();

    if (!title) {
      error = true;
      $("#edit_title").after(errMessage);
    }

    return !error;
  });

  $(".delete-blog-tag-btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/blog/tag/${id}?_method=DELETE`;
    $(".delete-blog-tag-form").attr("action", url);
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
            <input type="text" name="blogDocumentName" class="form-control documentName" />
        </div>
      </div>
     <div class="col-lg-6">
        <div class="form-group">
            <label>Document</label>
            <input type="file" name="blogDocument" class="form-control-file documentFile" " accept=".pdf,.docx,.doc">
        </div>
      </div>
      <div class="col-lg-1">
        <button class="remove-fields btn btn-info-rgba" type="button"><i class="la la-x la-minus"></i></button>
      </div>
    </div>
    `);
  });

  $(document).on("click", ".remove-fields", function () {
    $(this).parent().parent(".row").remove();
  });

  $(".delete-blog-btn").on("click", function () {
    const id = $(this).data("id");
    const url = `/api/creator/blog/${id}?_method=DELETE`;
    $(".delete-blog-form").attr("action", url);
  });

  $("#saveAsDraft").on("change", function () {
    if ($(this).is(":checked")) {
      $("#published").parent().addClass("non_editable");
    } else {
      $("#published").parent().removeClass("non_editable");
    }
  });
  $("#published").on("change", function () {
    if ($(this).is(":checked")) {
      $("#saveAsDraft").parent().addClass("non_editable");
    } else {
      $("#saveAsDraft").parent().removeClass("non_editable");
    }
  });

  // Save Blog
  $(".blog-add").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val();
    const category = $("#category").val();
    const tags = $("#tags").val();
    const blogThumbImage = $("#blogThumbImage").val();
    const quote = $("#quote").val();
    const summernote = $("#summernote").val();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }
    if (tags.length === 0) {
      error = true;
      $("#tags").next().after(errMessage);
    }
    if (!blogThumbImage) {
      error = true;
      $("#blogThumbImage").parent().after(errMessage);
    }
    if (!quote) {
      error = true;
      $("#quote").after(errMessage);
    }
    if (!summernote) {
      error = true;
      $("#summernote").next().after(errMessage);
    }

    return !error;
  });

  //Delete Blog documents
  $(".delete-doc").on("click", function () {
    const blogId = $(this).data("blogid");
    const id = $(this).data("id");
    const filename = $(this).data("doc");

    $.ajax({
      type: "DELETE",
      url: `/api/creator/blog/${blogId}/delete-document/${id}?filename=${filename}`,
      success: function (response) {
        sessionStorage.setItem("success", response);
        location.reload();
      },
      error: function () {
        sessionStorage.setItem("error", "Unable to delete document!");
        location.reload();
      },
    });
  });

  //Delete Blog images
  $(".delete-galley-img").on("click", function (e) {
    const blogId = $(this).data("id");
    const filename = $(this).data("img");

    $.ajax({
      type: "DELETE",
      url: `/api/creator/blog/${blogId}/delete-gallery/${filename}`,
      success: function (response) {
        sessionStorage.setItem("success", response);
        location.reload();
      },
      error: function () {
        sessionStorage.setItem("error", "Unable to delete document!");
        location.reload();
      },
    });
  });

  // Edit Blog
  $(".blog-edit").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const title = $("#title").val();
    const category = $("#category").val();
    const tags = $("#tags").val();
    const quote = $("#quote").val();
    const summernote = $("#summernote").val();

    if (!title) {
      error = true;
      $("#title").after(errMessage);
    }
    if (!category) {
      error = true;
      $("#category").after(errMessage);
    }
    if (tags.length === 0) {
      error = true;
      $("#tags").next().after(errMessage);
    }
    if (!quote) {
      error = true;
      $("#quote").after(errMessage);
    }
    if (!summernote) {
      error = true;
      $("#summernote").next().after(errMessage);
    }

    return !error;
  });

  // --------------- @Blog Script End @.v1 ---------------- //

  // --------------- @Newsletter Script Start @.v1 ---------------- //
  $(".newsletter_delete_btn").on("click", function () {
    const id = $(this).data("id");
    const url = `/api/creator/newsletter/${id}?_method=DELETE`;
    $("#newsletter_delete_form").attr("action", url);
  });
  // --------------- @Newsletter Script End @.v1 ---------------- //

  // --------------- @ Profile Script Start @.v1 ---------------- //
  $(".update_profile").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const phone = $("#phone").val().trim();
    const brandName = $("#brandName").val().trim();

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
    if (!brandName) {
      error = true;
      $("#brandName").after(errMessage);
    }

    return !error;
  });
  // --------------- @ Profile Script End @.v1 ---------------- //

  // --------------- @ Learner Script Start @.v1 ---------------- //
  $(".add_learner").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

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
    } else if (phone.length > 13 || phone.length < 10) {
      error = true;
      $("#phone").after(
        "<small class='text-danger err-message'>Please enter valid phone number.</small>"
      );
    }
    if (!password) {
      error = true;
      $("#password").after(errMessage);
    }
    if (password.length < 8) {
      error = true;
      $("#password").after(
        `<small class='text-danger err-message'>Password must be greater than 8 characters.</small>`
      );
    }
    if (!confirmPassword) {
      error = true;
      $("#confirmPassword").after(errMessage);
    }
    if (password !== confirmPassword) {
      error = true;
      $("#confirmPassword").after(
        `<small class='text-danger err-message'>Password and Confirm Password Does'nt Match.</small>`
      );
    }

    return !error;
  });

  $(".edit_learner_btn").on("click", function () {
    const learner = $(this).data("learner");

    let url = `/api/creator/learner/${learner._id}?_method=PUT`;

    $(".edit-learner-form").attr("action", url);

    $(".edit-learner-form #edit_firstName").val(learner.firstName);
    $(".edit-learner-form #edit_lastName").val(learner.lastName);
    $(".edit-learner-form #edit_email").val(learner.email);
    $(".edit-learner-form #edit_phone").val(learner.phone);
    $(".edit-learner-form #edit_status").prop("checked", learner.status);
    if (learner.profileImg) {
      setPreview(
        `/uploads/user/profile/${learner.profileImg}`,
        ".edit-learner-form #edit_userProfileImg"
      );
    }
  });

  $(".edit_learner").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const firstName = $("#edit_firstName").val().trim();
    const lastName = $("#edit_lastName").val().trim();
    const email = $("#edit_email").val().trim();
    const phone = $("#edit_phone").val().trim();

    if (!firstName) {
      error = true;
      $("#edit_firstName").after(errMessage);
    }
    if (!lastName) {
      error = true;
      $("#edit_lastName").after(errMessage);
    }
    if (!email) {
      error = true;
      $("#edit_email").after(errMessage);
    } else if (!ValidateEmail(email)) {
      $("#edit_email").after(
        "<small class='text-danger err-message'>Please enter valid email.</small>"
      );
    }

    if (!phone) {
      error = true;
      $("#edit_phone").after(errMessage);
    } else if (phone.length > 13 || phone.length < 10) {
      error = true;
      $("#edit_phone").after(
        "<small class='text-danger err-message'>Please enter valid phone number.</small>"
      );
    }

    return !error;
  });

  $(".delete_learner_btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/learner/${id}?_method=DELETE`;
    $(".delete_learner_form").attr("action", url);
  });

  $(".learner-change-password-btn").on("click", function () {
    const id = $(this).data("id");
    let url = `/api/creator/learner/${id}/change-password?_method=PUT`;
    $(".learner-change-password-form").attr("action", url);
  });

  $(".change_learner_password").on("click", function () {
    $(".err-message").remove();
    const errMessage = `<small class='text-danger err-message'>This field is required.</small>`;
    let error = false;

    const password = $("#change_password").val().trim();
    const confirmPassword = $("#change_confirmPassword").val().trim();

    if (password) {
      if (password.length < 8) {
        error = true;
        $("#change_password").after(
          `<small class='text-danger err-message'>Password must be 8 characters or more.</small>`
        );
      }
    } else {
      error = true;
      $("#change_password").after(errMessage);
    }
    if (confirmPassword) {
      if (confirmPassword.length < 8) {
        error = true;
        $("#change_confirmPassword").after(
          `<small class='text-danger err-message'>Password must be 8 characters or more.</small>`
        );
      }
    } else {
      error = true;
      $("#change_confirmPassword").after(errMessage);
    }

    if (password && confirmPassword && password != confirmPassword) {
      error = true;
      $("#change_confirmPassword").after(
        `<small class='text-danger err-message'>Password and confirm password doesn't match.</small>`
      );
    }

    return !error;
  });

  $(".restore_learner_btn").on("click", function () {
    const learner = $(this).data("id");
    const url = `/api/creator/learner/${learner}/restore-deleted-learner?_method=PUT`;

    $(".restore_learner_form").attr("action", url);
  });

  // --------------- @ Learner Script End @.v1 ---------------- //

  console.log("Last Line");
});
