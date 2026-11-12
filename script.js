
// CERTIFICATE AGENT
// Certificate Generator and Verification

const certificateForm = document.querySelector("#certificate-form");
const preview = document.querySelector("#certificate-preview");
const verifyForm = document.querySelector("#verify-form");
const verificationResult = document.querySelector("#verification-result");

// Generate Certificate
certificateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentName = document.querySelector("#student-name").value.trim();
    const courseName = document.querySelector("#course-name").value.trim();
    const organization = document.querySelector("#organization").value.trim();
    const issueDate = document.querySelector("#issue-date").value;

    const certificateID = "CA-" + Date.now().toString().slice(-8);

    const formattedDate = new Date(issueDate + "T00:00:00")
        .toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    // Save certificate in browser storage
    const records = JSON.parse(
        localStorage.getItem("certificateAgentRecords") || "{}"
    );

    records[certificateID] = {
        studentName,
        courseName,
        organization,
        issueDate: formattedDate
    };

    localStorage.setItem(
        "certificateAgentRecords",
        JSON.stringify(records)
    );

    // Create certificate
    const certificate = document.createElement("div");
    certificate.className = "certificate";

    const heading = document.createElement("h2");
    heading.textContent = "CERTIFICATE OF ACHIEVEMENT";

    const subtitle = document.createElement("p");
    subtitle.textContent = "This certificate is proudly presented to";

    const name = document.createElement("h1");
    name.textContent = studentName;

    const description = document.createElement("p");
    description.textContent = "For successfully completing " + courseName;

    const organizationName = document.createElement("h3");
    organizationName.textContent = organization;

    const date = document.createElement("p");
    date.textContent = "Issue Date: " + formattedDate;

    const id = document.createElement("small");
    id.textContent = "Certificate ID: " + certificateID;

    certificate.append(
        heading, subtitle, name, description,
        organizationName, date, id
    );

    preview.replaceChildren(certificate);

    // Download PDF button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Certificate";
    downloadButton.className = "btn";

    preview.appendChild(downloadButton);

    downloadButton.addEventListener("click", function() {
        const options = {
            margin: 0.3,
            filename: "My-Certificate.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: {
                unit: "in",
                format: "a4",
                orientation: "landscape"
            }
        };

        html2pdf().set(options).from(certificate).save();
    });

    preview.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// Verify Certificate
verifyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const enteredID = document.querySelector("#certificate-id")
        .value.trim().toUpperCase();

    const records = JSON.parse(
        localStorage.getItem("certificateAgentRecords") || "{}"
    );

    const record = records[enteredID];

    if (record) {
        verificationResult.textContent =
            "Certificate verified! Awarded to " +
            record.studentName + " for " +
            record.courseName + " by " +
            record.organization + " on " +
            record.issueDate + ".";

        verificationResult.className = "verification-success";
    } else {
        verificationResult.textContent =
            "No matching certificate found. Please check the Certificate ID.";

        verificationResult.className = "verification-error";
    }
});
