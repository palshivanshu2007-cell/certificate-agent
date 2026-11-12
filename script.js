
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

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Certificate";
    downloadButton.className = "btn";

    preview.appendChild(downloadButton);

    downloadButton.addEventListener("click", async function() {
        
        const exportCertificate = certificate.cloneNode(true);

        const wrapper = document.createElement("div");
        wrapper.id = "certificate-preview";

        Object.assign(wrapper.style, {
            position: "absolute",
            left: "0",
            top: "0",
            width: "1100px",
            background: "#ffffff",
            zIndex: "99999",
            padding: "30px"
        });

        Object.assign(exportCertificate.style, {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "1000px",
            height: "700px",
            minHeight: "700px",
            padding: "50px",
            boxSizing: "border-box",
            background: "#ffffff",
            border: "7px double #c49a35",
boxShadow: "0 8px 25px rgba(0,0,0,.12)",
            color: "#172554",
            borderRadius: "4px",
            textAlign: "center",
            overflow: "visible"
        });

        Array.from(exportCertificate.children).forEach(function(element) {
            Object.assign(element.style, {
                display: "block",
                visibility: "visible",
                opacity: "1"
            });
        });

        wrapper.appendChild(exportCertificate);
        document.body.appendChild(wrapper);

        try {
            await html2pdf().set({
                margin: 0.2,
                filename: "My-Certificate.pdf",
                image: {
                    type: "jpeg",
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: {
                    unit: "in",
                    format: "a4",
                    orientation: "landscape"
                }
            }).from(exportCertificate).save();

        } catch (error) {
            console.error(error);
            alert("PDF download failed. Please try again.");
        } finally {
            wrapper.remove();
        }
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
