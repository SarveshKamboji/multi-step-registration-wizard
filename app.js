// === ELEMENT REFERENCES ===
const form = document.getElementById("multiStepForm");
const steps = Array.from(document.querySelectorAll(".form-step"));
const progressSteps = Array.from(document.querySelectorAll(".progress-step"));
const progressBarFill = document.getElementById("progressBarFill");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const submitSpinner = document.getElementById("submitSpinner");
const submitBtnText = document.getElementById("submitBtnText");
const stepCounter = document.getElementById("stepCounter");
const statusBanner = document.getElementById("statusBanner");
const statusText = document.getElementById("statusText");

const profilePictureInput = document.getElementById("profilePictureInput");
const profilePictureInfo = document.getElementById("profilePictureInfo");
const profilePicturePreview = document.getElementById("profilePicturePreview");
const profilePictureImg = document.getElementById("profilePictureImg");
const profilePicturePreviewText = document.getElementById("profilePicturePreviewText");

const resumeInput = document.getElementById("resumeInput");
const resumeInfo = document.getElementById("resumeInfo");

let currentStep = 0;

// === HELPER FUNCTIONS ===
function setStatus(type, message) {
  if (!message) {
    statusBanner.classList.remove("show", "info", "error", "success");
    return;
  }
  statusBanner.className = `status-banner show ${type}`;
  statusText.textContent = message;
}

function updateStepUI() {
  steps.forEach((stepEl, index) => {
    stepEl.classList.toggle("active", index === currentStep);
  });

  progressSteps.forEach((step, index) => {
    step.classList.remove("active", "completed");
    if (index < currentStep) {
      step.classList.add("completed");
    } else if (index === currentStep) {
      step.classList.add("active");
    }
  });

  const percent = (currentStep / (steps.length - 1)) * 100;
  progressBarFill.style.width = `${percent}%`;

  prevBtn.disabled = currentStep === 0;
  nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
  submitBtn.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";

  stepCounter.textContent = `Step ${currentStep + 1} of ${steps.length}`;

  // clear banner when changing step
  setStatus("", "");
}

function setFieldError(fieldName, message) {
  const field = document.querySelector(`.field[data-field="${fieldName}"]`);
  if (!field) return;
  const errorMessageEl = field.querySelector(".error-message");
  field.classList.toggle("error", !!message);
  if (errorMessageEl) {
    errorMessageEl.textContent = message || "";
  }
}

function clearAllErrorsForStep(stepIndex) {
  const stepEl = steps[stepIndex];
  const fields = stepEl.querySelectorAll(".field");
  fields.forEach((field) => {
    field.classList.remove("error");
    const msg = field.querySelector(".error-message");
    if (msg) msg.textContent = "";
  });
}

function isAdult(dobValue) {
  if (!dobValue) return false;
  const dob = new Date(dobValue);
  const today = new Date();
  const diff = today.getFullYear() - dob.getFullYear();
  if (diff < 18) return false;
  if (diff > 18) return true;

  // exactly 18, check month/day
  const mDiff = today.getMonth() - dob.getMonth();
  if (mDiff < 0) return false;
  if (mDiff > 0) return true;
  return today.getDate() >= dob.getDate();
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateUsername(username) {
  const re = /^[a-zA-Z0-9_]{3,16}$/;
  return re.test(username);
}

function validatePassword(password) {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

function validateFileSize(file, maxSizeMB) {
  if (!file) return false;
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

function validateStep(stepIndex) {
  clearAllErrorsForStep(stepIndex);

  let isValid = true;
  const formData = new FormData(form);

  if (stepIndex === 0) {
    // PERSONAL
    const firstName = formData.get("firstName")?.trim();
    const lastName = formData.get("lastName")?.trim();
    const email = formData.get("email")?.trim();
    const phone = formData.get("phone")?.trim();
    const country = formData.get("country");
    const dob = formData.get("dob");

    if (!firstName) {
      setFieldError("firstName", "First name is required.");
      isValid = false;
    }

    if (!lastName) {
      setFieldError("lastName", "Last name is required.");
      isValid = false;
    }

    if (!email) {
      setFieldError("email", "Email is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setFieldError("email", "Enter a valid email address.");
      isValid = false;
    }

    if (!phone) {
      setFieldError("phone", "Phone number is required.");
      isValid = false;
    } else if (phone.replace(/\D/g, "").length < 10) {
      setFieldError("phone", "Enter a valid phone number (at least 10 digits).");
      isValid = false;
    }

    if (!country) {
      setFieldError("country", "Please select your country.");
      isValid = false;
    }

    if (!dob) {
      setFieldError("dob", "Date of birth is required.");
      isValid = false;
    } else if (!isAdult(dob)) {
      setFieldError("dob", "You must be at least 18 years old.");
      isValid = false;
    }
  } else if (stepIndex === 1) {
    // ACCOUNT
    const username = formData.get("username")?.trim();
    const password = formData.get("password") || "";
    const confirmPassword = formData.get("confirmPassword") || "";
    const question = formData.get("securityQuestion");
    const answer = formData.get("securityAnswer")?.trim();
    const terms = formData.get("terms");

    if (!username) {
      setFieldError("username", "Username is required.");
      isValid = false;
    } else if (!validateUsername(username)) {
      setFieldError(
        "username",
        "Username must be 3–16 chars and contain only letters, numbers, and underscore."
      );
      isValid = false;
    }

    if (!password) {
      setFieldError("password", "Password is required.");
      isValid = false;
    } else if (!validatePassword(password)) {
      setFieldError(
        "password",
        "Password must be at least 8 characters and include both letters and numbers."
      );
      isValid = false;
    }

    if (!confirmPassword) {
      setFieldError("confirmPassword", "Please confirm your password.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setFieldError("confirmPassword", "Passwords do not match.");
      isValid = false;
    }

    if (!question) {
      setFieldError("securityQuestion", "Please select a security question.");
      isValid = false;
    }

    if (!answer) {
      setFieldError("securityAnswer", "Security answer is required.");
      isValid = false;
    }

    if (!terms) {
      setFieldError("terms", "You must accept the terms to continue.");
      isValid = false;
    }
  } else if (stepIndex === 2) {
    // DOCUMENTS
    const profileFile = profilePictureInput.files[0];
    const resumeFile = resumeInput.files[0];
    const bio = formData.get("bio")?.trim();

    if (!profileFile) {
      setFieldError("profilePicture", "Profile picture is required.");
      isValid = false;
    } else {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedImageTypes.includes(profileFile.type)) {
        setFieldError("profilePicture", "Only JPG, PNG, or WEBP images are allowed.");
        isValid = false;
      } else if (!validateFileSize(profileFile, 2)) {
        setFieldError("profilePicture", "Profile picture must be less than 2 MB.");
        isValid = false;
      }
    }

    if (!resumeFile) {
      setFieldError("resume", "Resume is required.");
      isValid = false;
    } else {
      if (resumeFile.type !== "application/pdf") {
        setFieldError("resume", "Only PDF files are allowed.");
        isValid = false;
      } else if (!validateFileSize(resumeFile, 3)) {
        setFieldError("resume", "Resume must be less than 3 MB.");
        isValid = false;
      }
    }

    if (!bio) {
      setFieldError("bio", "Please provide a short bio.");
      isValid = false;
    } else if (bio.length < 30) {
      setFieldError("bio", "Bio must be at least 30 characters long.");
      isValid = false;
    }
  }

  return isValid;
}

function goToStep(stepIndex) {
  if (stepIndex < 0 || stepIndex >= steps.length) return;
  currentStep = stepIndex;
  updateStepUI();
}

function setSubmitting(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  nextBtn.disabled = isSubmitting;
  prevBtn.disabled = isSubmitting && currentStep === 0;
  submitSpinner.style.display = isSubmitting ? "inline-block" : "none";
  submitBtnText.textContent = isSubmitting ? "Submitting..." : "Submit";
}

// === FILE PREVIEW HANDLERS ===
profilePictureInput.addEventListener("change", () => {
  const file = profilePictureInput.files[0];
  if (!file) {
    profilePictureInfo.textContent = "No file chosen.";
    profilePicturePreview.style.display = "none";
    return;
  }
  profilePictureInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(
    1
  )} KB)`;
  const reader = new FileReader();
  reader.onload = (e) => {
    profilePictureImg.src = e.target.result;
    profilePicturePreviewText.textContent = "Preview of selected image.";
    profilePicturePreview.style.display = "flex";
  };
  reader.readAsDataURL(file);
});

resumeInput.addEventListener("change", () => {
  const file = resumeInput.files[0];
  if (!file) {
    resumeInfo.textContent = "No file chosen.";
    return;
  }
  resumeInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
});

// === NAVIGATION BUTTONS ===
nextBtn.addEventListener("click", () => {
  const valid = validateStep(currentStep);
  if (!valid) {
    setStatus("error", "Please fix the errors before proceeding.");
    return;
  }
  goToStep(currentStep + 1);
});

prevBtn.addEventListener("click", () => {
  goToStep(currentStep - 1);
});

// === FORM SUBMISSION (AJAX via XMLHttpRequest) ===
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate last step
  const lastValid = validateStep(currentStep);
  if (!lastValid) {
    setStatus("error", "Please fix the errors before submitting.");
    return;
  }

  // Validate all steps (defensive)
  for (let i = 0; i < steps.length; i++) {
    if (!validateStep(i)) {
      goToStep(i);
      setStatus("error", "Please fix the errors in the highlighted step.");
      return;
    }
  }

  setStatus("info", "Submitting your details…");
  setSubmitting(true);

  // Build URL-encoded body (ignore files)
  const formData = new FormData(form);
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    // ignore file inputs (profilePicture, resume)
    if (value instanceof File) return;
    params.append(key, value);
  });

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "register.jsp", true);

  // IMPORTANT: tell server this is urlencoded form
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      setSubmitting(false);
      console.log("XHR status:", xhr.status);
      console.log("XHR response:", xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus("success", "Registration successful! Data saved.");
        // optional: form.reset(); goToStep(0);
      } else {
        setStatus(
          "error",
          "Something went wrong while submitting. Please try again or contact support."
        );
      }
    }
  };

  xhr.onerror = function () {
    setSubmitting(false);
    setStatus(
      "error",
      "Network error while submitting. Please check your connection and try again."
    );
  };

  // send the URL-encoded string
  xhr.send(params.toString());
});


// Initial UI state
updateStepUI();
