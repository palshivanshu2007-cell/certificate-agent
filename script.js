
// CERTIFICATE AGENT
// Certificate Generator Functionality

const certificateForm = document.querySelector(
    "#certificate-form"
);

const preview = document.querySelector(
    "#certificate-preview"
);

certificateForm.addEventListener("submit", function(event) {

    // Stop page from refreshing
    event.preventDefault();

    // Get student information
    const studentName = document.querySelector(
        "#student-name"
    ).value.trim();

    const courseName = document.querySelector(
        "#course-name"
    ).value.trim();

    const organization = document.querySelector(
        "#organization"
    ).value.trim();

    const issueDate = document.querySelector(
        "#issue-date"
    ).value;

    // Generate certificate ID
    const certificateID = "CA-" +
        Date.now().toString().slice(-8);

    // Format date
    const formattedDate = new Date(
        issueDate + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

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
    description.textContent =
        "For successfully completing " + courseName;

    const organizationName = document.createElement("h3");
    organizationName.textContent = organization;

    const date = document.createElement("p");
    date.textContent = "Issue Date: " + formattedDate;

    const id = document.createElement("small");
    id.textContent = "Certificate ID: " + certificateID;

    // Add all elements
    certificate.append(
        heading,
        subtitle,
        name,
        description,
        organizationName,
        date,
        id
    );

    // Display certificate
    preview.replaceChildren(certificate);
// Create download button
const downloadButton = document.createElement("button");

downloadButton.textContent = "Download Certificate";

downloadButton.className = "btn";

downloadButton.id = "download-certificate";

preview.appendChild(downloadButton);

// PDF Download Functionality

downloadButton.addEventListener("click", function() {

    const options = {
        margin: 0.3,
        filename: "My-Certificate.pdf",

        image: {
            type: "jpeg",
            quality: 0.98
        },

        html2canvas: {
            scale: 2,
            useCORS: true
        },

        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "landscape"
        }
    };

    html2pdf()
        .set(options)
        .from(certificate)
        .save();

});


    // Scroll to preview
    preview.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    console.log("Certificate generated:", certificateID);
});

