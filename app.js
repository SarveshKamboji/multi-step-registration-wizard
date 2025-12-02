// --- BASIC REFERENCES ---
var form = document.getElementById("multiStepForm");
var steps = document.querySelectorAll(".form-step");
var progressSteps = document.querySelectorAll(".progress-step");
var progressBarFill = document.getElementById("progressBarFill");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var submitBtn = document.getElementById("submitBtn");
var submitSpinner = document.getElementById("submitSpinner");
var submitBtnText = document.getElementById("submitBtnText");
var stepCounter = document.getElementById("stepCounter");
var statusBanner = document.getElementById("statusBanner");
var statusText = document.getElementById("statusText");

var profilePictureInput = document.getElementById("profilePictureInput");
var profilePictureInfo = document.getElementById("profilePictureInfo");
var profilePicturePreview = document.getElementById("profilePicturePreview");
var profilePictureImg = document.getElementById("profilePictureImg");
var profilePicturePreviewText = document.getElementById("profilePicturePreviewText");

var resumeInput = document.getElementById("resumeInput");
var resumeInfo = document.getElementById("resumeInfo");

var currentStep = 0;

// --- SMALL HELPERS ---
function showStatus(type, msg) {
  if (!msg) {
    statusBanner.className = "status-banner";
    statusBanner.style.display = "none";
    return;
  }
  statusBanner.style.display = "flex";
  statusBanner.className = "status-banner show " + type;
  statusText.textContent = msg;
}

function showStep(index) {
  if (index < 0 || index >= steps.length) return;

  currentStep = index;

  for (var i = 0; i < steps.length; i++) {
    steps[i].classList.toggle("active", i === currentStep);
  }

  for (var j = 0; j < progressSteps.length; j++) {
    progressSteps[j].classList.remove("active", "completed");
    if (j < currentStep) {
      progressSteps[j].classList.add("completed");
    } else if (j === currentStep) {
      progressSteps[j].classList.add("active");
    }
  }

  var percent = (currentStep / (steps.length - 1)) * 100;
  progressBarFill.style.width = percent + "%";

  prevBtn.disabled = currentStep === 0;
  nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
  submitBtn.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";

  stepCounter.textContent = "Step " + (currentStep + 1) + " of " + steps.length;

  showStatus("", "");
}

function setError(fieldName, msg) {
  var field = document.querySelector('.field[data-field="' + fieldName + '"]');
  if (!field) return;
  var errorEl = field.querySelector(".error-message");
  field.classList.toggle("error", !!msg);
  if (errorEl) errorEl.textContent = msg || "";
}

function clearErrors(stepIndex) {
  var stepEl = steps[stepIndex];
  var fields = stepEl.querySelectorAll(".field");
  for (var i = 0; i < fields.length; i++) {
    fields[i].classList.remove("error");
    var e = fields[i].querySelector(".error-message");
    if (e) e.textContent = "";
  }
}

// --- SIMPLE VALIDATORS ---
function isAdult(dobValue) {
  if (!dobValue) return false;
  var dob = new Date(dobValue);
  var today = new Date();
  var years = today.getFullYear() - dob.getFullYear();
  if (years < 18) return false;
  if (years > 18) return true;
  var m = today.getMonth() - dob.getMonth();
  if (m < 0) return false;
  if (m > 0) return true;
  return today.getDate() >= dob.getDate();
}

function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidUsername(u) {
  var re = /^[a-zA-Z0-9_]{3,16}$/;
  return re.test(u);
}

function isValidPassword(pwd) {
  if (!pwd || pwd.length < 8) return false;
  var hasLetter = /[a-zA-Z]/.test(pwd);
  var hasNumber = /[0-9]/.test(pwd);
  return hasLetter && hasNumber;
}

function isValidFileSize(file, maxMB) {
  if (!file) return false;
  var maxBytes = maxMB * 1024 * 1024;
  return file.size <= maxBytes;
}

// --- STEP VALIDATION ---
function validateStep(stepIndex) {
  clearErrors(stepIndex);

  var data = new FormData(form);
  var ok = true;

  if (stepIndex === 0) {
    var firstName = (data.get("firstName") || "").trim();
    var lastName = (data.get("lastName") || "").trim();
    var email = (data.get("email") || "").trim();
    var phone = (data.get("phone") || "").trim();
    var country = data.get("country");
    var dob = data.get("dob");

    if (!firstName) {
      setError("firstName", "First name is required.");
      ok = false;
    }
    if (!lastName) {
      setError("lastName", "Last name is required.");
      ok = false;
    }
    if (!email) {
      setError("email", "Email is required.");
      ok = false;
    } else if (!isValidEmail(email)) {
      setError("email", "Enter a valid email.");
      ok = false;
    }
    if (!phone) {
      setError("phone", "Phone number is required.");
      ok = false;
    } else if (phone.replace(/\D/g, "").length < 10) {
      setError("phone", "Enter at least 10 digits.");
      ok = false;
    }
    if (!country) {
      setError("country", "Please select your country.");
      ok = false;
    }
    if (!dob) {
      setError("dob", "Date of birth is required.");
      ok = false;
    } else if (!isAdult(dob)) {
      setError("dob", "You must be at least 18 years old.");
      ok = false;
    }
  }

  if (stepIndex === 1) {
    var username = (data.get("username") || "").trim();
    var pwd = data.get("password") || "";
    var cpwd = data.get("confirmPassword") || "";
    var q = data.get("securityQuestion");
    var ans = (data.get("securityAnswer") || "").trim();
    var terms = data.get("terms");

    if (!username) {
      setError("username", "Username is required.");
      ok = false;
    } else if (!isValidUsername(username)) {
      setError("username", "3–16 chars, letters/numbers/underscore.");
      ok = false;
    }

    if (!pwd) {
      setError("password", "Password is required.");
      ok = false;
    } else if (!isValidPassword(pwd)) {
      setError("password", "Min 8 chars, must have letters and numbers.");
      ok = false;
    }

    if (!cpwd) {
      setError("confirmPassword", "Please confirm password.");
      ok = false;
    } else if (pwd !== cpwd) {
      setError("confirmPassword", "Passwords do not match.");
      ok = false;
    }

    if (!q) {
      setError("securityQuestion", "Select a security question.");
      ok = false;
    }
    if (!ans) {
      setError("securityAnswer", "Security answer is required.");
      ok = false;
    }
    if (!terms) {
      setError("terms", "You must accept the terms.");
      ok = false;
    }
  }

  if (stepIndex === 2) {
    var profileFile = profilePictureInput.files[0];
    var resumeFile = resumeInput.files[0];
    var bio = (data.get("bio") || "").trim();

    if (!profileFile) {
      setError("profilePicture", "Profile picture is required.");
      ok = false;
    } else {
      var allowed = ["image/jpeg", "image/png", "image/webp"];
      if (allowed.indexOf(profileFile.type) === -1) {
        setError("profilePicture", "Only JPG, PNG, or WEBP allowed.");
        ok = false;
      } else if (!isValidFileSize(profileFile, 2)) {
        setError("profilePicture", "Max size is 2 MB.");
        ok = false;
      }
    }

    if (!resumeFile) {
      setError("resume", "Resume is required.");
      ok = false;
    } else {
      if (resumeFile.type !== "application/pdf") {
        setError("resume", "Only PDF files allowed.");
        ok = false;
      } else if (!isValidFileSize(resumeFile, 3)) {
        setError("resume", "Max size is 3 MB.");
        ok = false;
      }
    }

    if (!bio) {
      setError("bio", "Please provide a short bio.");
      ok = false;
    } else if (bio.length < 30) {
      setError("bio", "Bio must be at least 30 characters.");
      ok = false;
    }
  }

  return ok;
}

function setSubmitting(submitting) {
  submitBtn.disabled = submitting;
  nextBtn.disabled = submitting;
  prevBtn.disabled = submitting && currentStep === 0;
  submitSpinner.style.display = submitting ? "inline-block" : "none";
  submitBtnText.textContent = submitting ? "Submitting..." : "Submit";
}

// --- FILE PREVIEW ---
profilePictureInput.addEventListener("change", function () {
  var file = profilePictureInput.files[0];
  if (!file) {
    profilePictureInfo.textContent = "No file chosen.";
    profilePicturePreview.style.display = "none";
    return;
  }
  profilePictureInfo.textContent = file.name + " (" + (file.size / 1024).toFixed(1) + " KB)";
  var reader = new FileReader();
  reader.onload = function (e) {
    profilePictureImg.src = e.target.result;
    profilePicturePreviewText.textContent = "Preview of selected image.";
    profilePicturePreview.style.display = "flex";
  };
  reader.readAsDataURL(file);
});

resumeInput.addEventListener("change", function () {
  var file = resumeInput.files[0];
  if (!file) {
    resumeInfo.textContent = "No file chosen.";
    return;
  }
  resumeInfo.textContent = file.name + " (" + (file.size / 1024).toFixed(1) + " KB)";
});

// --- NAVIGATION BUTTONS ---
nextBtn.addEventListener("click", function () {
  if (!validateStep(currentStep)) {
    showStatus("error", "Please fix errors before proceeding.");
    return;
  }
  showStep(currentStep + 1);
});

prevBtn.addEventListener("click", function () {
  showStep(currentStep - 1);
});

// --- FORM SUBMIT (AJAX) ---
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // validate last step
  if (!validateStep(currentStep)) {
    showStatus("error", "Please fix errors before submitting.");
    return;
  }

  // defensive: validate all steps
  for (var i = 0; i < steps.length; i++) {
    if (!validateStep(i)) {
      showStep(i);
      showStatus("error", "Please fix errors in highlighted step.");
      return;
    }
  }

  showStatus("info", "Submitting your details…");
  setSubmitting(true);

  var formData = new FormData(form);
  var params = new URLSearchParams();

  formData.forEach(function (value, key) {
    if (value instanceof File) return; // skip files (handled separately if needed)
    params.append(key, value);
  });

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "register.jsp", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      setSubmitting(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        showStatus("success", "Registration successful! Data saved.");
        // form.reset();
        // showStep(0);
      } else {
        showStatus("error", "Error while submitting. Try again.");
      }
    }
  };

  xhr.onerror = function () {
    setSubmitting(false);
    showStatus("error", "Network error while submitting.");
  };

  xhr.send(params.toString());
});

// --- INIT ---
showStep(0);
