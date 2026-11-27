
const API_BASE = "https://certificate-agent-api.onrender.com";

const certificateForm = document.querySelector("#certificate-form");
const preview = document.querySelector("#certificate-preview");
const verifyForm = document.querySelector("#verify-form");
const verificationResult = document.querySelector("#verification-result");

function createElement(tag, className, text = "") {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

// Create a public verification URL
function getVerificationURL(certificateID) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("verify", certificateID);
    return url.toString();
}

// Build certificate design
function buildCertificate(data) {
    const certificate = createElement("article", "certificate");

    const top = createElement("div", "certificate-top");

    top.append(
        createElement("div", "certificate-brand", "HACKINDIA"),
        createElement("div", "certificate-medal", "★")
    );

    const content = createElement("div", "certificate-content");

    content.append(
        createElement("p", "certificate-kicker", "OFFICIAL RECOGNITION"),
        createElement("h2", "certificate-title", "Certificate of Achievement"),
        createElement("p", "certificate-subtitle",
            "This certificate is proudly presented to"),
        createElement("h1", "certificate-name", data.studentName),
        createElement("p", "certificate-description",
            "For successfully completing " + data.courseName),
        createElement("div", "certificate-tier",
            "★ " + data.achievementTier + " ★"),
        createElement("h3", "certificate-organization",
            data.organization)
    );

    const footer = createElement("div", "certificate-footer");

    const date = createElement(
        "p",
        "certificate-date",
        "ISSUED ON  " + data.issueDate
    );

    const qrSection = createElement("div", "certificate-qr-section");
    const qr = createElement("div", "certificate-qr");

    const qrLabel = createElement(
        "span",
        "certificate-qr-label",
        "SCAN TO VERIFY"
    );

    const qrId = createElement(
        "span",
        "certificate-id",
        data.certificateID
    );

    qrSection.append(qr, qrLabel, qrId);

    const signature = createElement(
        "div",
        "certificate-signature",
        "AUTHORISED SIGNATORY"
    );

    signature.append(
        createElement("span", "signature-line", ""),
        createElement("small", "signature-event", "HACKINDIA 2026")
    );

    footer.append(date, qrSection, signature);
    certificate.append(top, content, footer);

    return certificate;
}

// Generate QR code containing public verification URL
function createQR(qrElement, certificateID) {
    if (typeof QRCode === "undefined") {
        qrElement.textContent = getVerificationURL(certificateID);
        return;
    }

    qrElement.innerHTML = "";

    new QRCode(qrElement, {
        text: getVerificationURL(certificateID),
        width: 100,
        height: 100,
        colorDark: "#17130d",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Display certificate and PDF download button
function displayCertificate(data) {
    const certificate = buildCertificate(data);

    preview.replaceChildren(certificate);

    createQR(
        certificate.querySelector(".certificate-qr"),
        data.certificateID
    );

    const downloadButton = createElement(
        "button",
        "certificate-download",
        "↓  Download Certificate"
    );

    downloadButton.type = "button";

    downloadButton.addEventListener("click", async function() {
        if (typeof html2pdf === "undefined") {
            alert("PDF library did not load. Please refresh the page.");
            return;
        }

        const pdfCertificate = certificate.cloneNode(true);
        const host = createElement("div", "pdf-export-host");

        host.appendChild(pdfCertificate);
        document.body.appendChild(host);

        try {
            createQR(
                pdfCertificate.querySelector(".certificate-qr"),
                data.certificateID
            );

            await html2pdf().set({
                margin: 0,
                filename: "HackIndia-" + data.certificateID + ".pdf",
                image: {
                    type: "jpeg",
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#10100e"
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "landscape"
                }
            }).from(pdfCertificate).save();

        } catch (error) {
            console.error("PDF error:", error);
            alert("PDF generation failed. Please try again.");
        } finally {
            host.remove();
        }
    });

    preview.appendChild(downloadButton);

    preview.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// Create certificate through backend
certificateForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const studentName =
        document.querySelector("#student-name").value.trim();

    const courseName =
        document.querySelector("#course-name").value.trim();

    const achievementTier =
        document.querySelector("#achievement-tier").value;

    const organization =
        document.querySelector("#organization").value.trim();

    const issueDate =
        document.querySelector("#issue-date").value;

    if (!studentName || !courseName || !organization || !issueDate) {
        alert("Please fill in all certificate details.");
        return;
    }

    const certificateID =
        "CA-" + Date.now().toString(36).toUpperCase() +
        "-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    const formattedDate = new Date(issueDate + "T00:00:00")
        .toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const button = certificateForm.querySelector(
        'button[type="submit"]'
    );

    if (button) button.disabled = true;

    try {
        const response = await fetch(
            API_BASE + "/api/certificates",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    certificateId: certificateID,
                    recipientName: studentName,
                    achievementTitle: courseName,
                    tier: achievementTier,
                    issuerName: organization,
                    description: "Achievement certificate"
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Certificate creation failed."
            );
        }

        const data = {
            studentName,
            courseName,
            achievementTier,
            organization,
            issueDate: formattedDate,
            certificateID
        };

        displayCertificate(data);

    } catch (error) {
        console.error("Certificate creation error:", error);

        alert(
            "Unable to create certificate. Please check your internet connection and try again."
        );

    } finally {
        if (button) button.disabled = false;
    }
});

// Verify certificate using backend database
async function verifyCertificate(certificateID) {
    verificationResult.textContent = "Checking certificate...";
    verificationResult.className = "";

    try {
        const response = await fetch(
            API_BASE + "/api/certificates/" +
            encodeURIComponent(certificateID)
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Certificate not found."
            );
        }

        const record = result.certificate;

        verificationResult.textContent =
            "Certificate verified! Awarded to " +
            record.recipientName +
            " for " +
            record.achievementTitle +
            " by " +
            record.issuerName +
            ". Certificate ID: " +
            record.certificateId;

        verificationResult.className = "verification-success";

    } catch (error) {
        console.error("Verification error:", error);

        verificationResult.textContent =
            error.message === "Certificate not found."
                ? "No matching certificate found. Please check the Certificate ID."
                : "Unable to verify certificate. Please try again.";

        verificationResult.className = "verification-error";
    }
}

// Verification form submission
verifyForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const enteredID = document.querySelector("#certificate-id")
        .value.trim().toUpperCase();

    if (!enteredID) {
        alert("Please enter a Certificate ID.");
        return;
    }

    await verifyCertificate(enteredID);
});

// Automatically verify when QR link is opened
const urlParams = new URLSearchParams(window.location.search);
const verificationID = urlParams.get("verify");

if (verificationID) {
    const certificateInput =
        document.querySelector("#certificate-id");

    if (certificateInput && verifyForm) {
        certificateInput.value = verificationID.toUpperCase();

        verifyCertificate(verificationID.toUpperCase());

        verifyForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}
