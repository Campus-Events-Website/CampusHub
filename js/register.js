// Registrations are saved with CampusHubStore (js/store.js), which must be loaded before this file.

function openRegister(eventName) {
    const dialog = document.getElementById("registerDialog");
    const selectedEvent = document.getElementById("selectedEvent");
    const eventSelect = document.getElementById("eventName");

    if (dialog) {
        dialog.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }

    if (selectedEvent) {
        selectedEvent.textContent = "Register for: " + eventName;
    }

    if (eventSelect) {
        eventSelect.value = eventName;
    }
}

function closeRegister() {
    const dialog = document.getElementById("registerDialog");
    const successScreen = document.getElementById("successScreen");

    if (dialog) {
        dialog.classList.add("hidden");
    }

    if (!successScreen || successScreen.classList.contains("hidden")) {
        document.body.classList.remove("overflow-hidden");
    }
}

function showAlert({
    icon = "info",
    title = "Notice",
    text = "",
    confirmButtonText = "OK"
}) {
    if (typeof Swal !== "undefined" && typeof Swal.fire === "function") {
        return Swal.fire({
            icon,
            title,
            text,
            confirmButtonText,
            confirmButtonColor: "#2563eb"
        });
    }

    alert(title + "\n\n" + text);
    return Promise.resolve();
}

function createSuccessScreen() {
    let successScreen = document.getElementById("successScreen");

    if (successScreen) {
        return successScreen;
    }

    successScreen = document.createElement("div");
    successScreen.id = "successScreen";
    successScreen.className =
        "fixed inset-0 z-[100] hidden overflow-y-auto bg-slate-50";

    successScreen.innerHTML = `
        <div class="flex min-h-screen items-center justify-center p-4 sm:p-6">
            <div class="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
                <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <div class="mt-6 text-center">
                    <h1 class="text-3xl font-bold text-slate-900 sm:text-4xl">
                        Registration Successful!
                    </h1>
                    <p class="mt-2 text-slate-600">
                        Your registration has been completed successfully. Please keep your registration number.
                    </p>
                </div>

                <div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <div class="grid gap-5 sm:grid-cols-2">
                        <div>
                            <p class="text-sm font-medium text-slate-500">Registration Number</p>
                            <p id="successRegistrationNumber" class="mt-1 text-lg font-bold text-blue-600"></p>
                        </div>

                        <div>
                            <p class="text-sm font-medium text-slate-500">Student Name</p>
                            <p id="successName" class="mt-1 text-lg font-semibold text-slate-900"></p>
                        </div>

                        <div>
                            <p class="text-sm font-medium text-slate-500">Email</p>
                            <p id="successEmail" class="mt-1 break-words text-lg font-semibold text-slate-900"></p>
                        </div>

                        <div>
                            <p class="text-sm font-medium text-slate-500">Event / Club</p>
                            <p id="successEvent" class="mt-1 text-lg font-semibold text-slate-900"></p>
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex flex-col gap-3 sm:flex-row print:hidden">
                    <button
                        type="button"
                        onclick="closeSuccessScreen()"
                        class="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Back to CampusHub
                    </button>

                    <button
                        type="button"
                        onclick="printRegistration()"
                        class="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Print Registration
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(successScreen);
    return successScreen;
}

function showSuccessScreen(registration) {
    const successScreen = createSuccessScreen();

    document.getElementById("successRegistrationNumber").textContent =
        registration.registrationNumber;
    document.getElementById("successName").textContent = registration.name;
    document.getElementById("successEvent").textContent = registration.event;
    document.getElementById("successEmail").textContent = registration.email;

    successScreen.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
}

function closeSuccessScreen() {
    const successScreen = document.getElementById("successScreen");

    if (successScreen) {
        successScreen.classList.add("hidden");
    }

    document.body.classList.remove("overflow-hidden");
}

function printRegistration() {
    window.print();
}

function submitRegistration(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = document.getElementById("studentName");
    const emailInput = document.getElementById("studentEmail");
    const phoneInput = document.getElementById("studentPhone");
    const eventInput = document.getElementById("eventName");

    if (!form || !nameInput || !emailInput || !phoneInput || !eventInput) {
        showAlert({
            icon: "error",
            title: "Error",
            text: "Registration form could not be found."
        });
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const selectedEvent = eventInput.value.trim();

    if (!name) {
        showAlert({
            icon: "warning",
            title: "Name Required",
            text: "Please enter your full name."
        }).then(() => nameInput.focus());
        return;
    }

    if (name.length > 100) {
        showAlert({
            icon: "warning",
            title: "Name Too Long",
            text: "Please keep your name under 100 characters."
        }).then(() => nameInput.focus());
        return;
    }

    if (!email) {
        showAlert({
            icon: "warning",
            title: "Email Required",
            text: "Please enter your email address."
        }).then(() => emailInput.focus());
        return;
    }

    // Validate the complete email format.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 254) {
        showAlert({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address, for example: student@example.com"
        }).then(() => {
            emailInput.focus();
            emailInput.select();
        });
        return;
    }

    if (!phone) {
        showAlert({
            icon: "warning",
            title: "Phone Required",
            text: "Please enter your phone number."
        }).then(() => phoneInput.focus());
        return;
    }

    // Allow spaces, dashes, brackets and a leading +, but require 6 to 15 digits.
    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^\+?[\d\s()-]+$/.test(phone) || phoneDigits.length < 6 || phoneDigits.length > 15 || phone.length > 30) {
        showAlert({
            icon: "error",
            title: "Invalid Phone Number",
            text: "Please enter a valid phone number, for example: 012 345 678"
        }).then(() => phoneInput.focus());
        return;
    }

    if (!selectedEvent) {
        showAlert({
            icon: "error",
            title: "Select an Event",
            text: "Please choose an event before registering."
        }).then(() => eventInput.focus());
        return;
    }

    try {
        const registration = CampusHubStore.addRegistration({
            name,
            email,
            phone,
            event: selectedEvent
        });

        form.reset();
        closeRegister();
        showSuccessScreen(registration);
    } catch (error) {
        if (error && error.code === "duplicate") {
            showAlert({
                icon: "info",
                title: "Already Registered",
                text: "This email is already registered for " + selectedEvent +
                    " (registration number " + error.registrationNumber + ")."
            });
        } else {
            console.error("Could not save registration:", error);
            showAlert({
                icon: "error",
                title: "Registration Failed",
                text: "Your registration could not be saved. Please check that your browser allows saving site data, then try again."
            });
        }
    }
}
