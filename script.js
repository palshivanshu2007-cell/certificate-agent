
const certificateForm = document.querySelector("#certificate-form");
const preview = document.querySelector("#certificate-preview");
const verifyForm = document.querySelector("#verify-form");
const verificationResult = document.querySelector("#verification-result");

// Generate Certificate
certificateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentName = document.querySelector("#student-name").value.trim();
    const courseName = document.querySelector("#course-name").value.trim();
const achievementTier =
    document.querySelector("#achievement-tier").value;

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
achievementTier,
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

const tierBadge = document.createElement("div");
tierBadge.className = "achievement-tier";
tierBadge.textContent = "★ " + achievementTier + " ★";

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
    heading,
    tierBadge,
    subtitle,
    name,
    description,
    organizationName,
    date,
    id
);

    preview.replaceChildren(certificate);

    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = `
    <span style="font-size:20px;">⬇</span>
    <span>Download Certificate</span>
`;

Object.assign(downloadButton.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    margin: "25px auto",
    padding: "15px 32px",
    background: "linear-gradient(135deg, #f5c76b, #d49a32)",
    color: "#061b17",
    border: "1px solid #f5c76b",
    borderRadius: "8px",
    fontSize: "17px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    fontFamily: "Georgia, serif",
    boxShadow: "0 5px 18px rgba(0,0,0,0.25)",
    cursor: "pointer"
});
    downloadButton.style.transition =
    "all 0.3s ease";

downloadButton.addEventListener("mouseenter", function() {
    downloadButton.style.transform = "translateY(-3px)";
    downloadButton.style.boxShadow =
        "0 9px 24px rgba(245,166,35,0.35)";
});

downloadButton.addEventListener("mouseleave", function() {
    downloadButton.style.transform = "translateY(0)";
    downloadButton.style.boxShadow =
        "0 5px 18px rgba(0,0,0,0.25)";
});
    // BUTTON PRESS ANIMATION
downloadButton.addEventListener("pointerdown", function() {
    downloadButton.style.transform = "scale(0.97)";
});

downloadButton.addEventListener("pointerup", function() {
    downloadButton.style.transform = "translateY(-3px)";
});

downloadButton.addEventListener("pointercancel", function() {
    downloadButton.style.transform = "translateY(0)";
});
    preview.appendChild(downloadButton);

    
downloadButton.addEventListener("click", async function() {

    const exportCertificate = document.createElement("div");

    Object.assign(exportCertificate.style, {
        position: "relative",
        width: "1122px",
        height: "794px",
        boxSizing: "border-box",
        overflow: "hidden",
        padding: "65px 70px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        color: "#f8edcf",
        background: "radial-gradient(ellipse at center, #252019, #11100e 60%, #050505)",
        border: "9px double #c9a34a",
        fontFamily: "Georgia, serif"
    });

    const makeText = (tag, value, styles = {}) => {
        const element = document.createElement(tag);
        element.textContent = value;
        Object.assign(element.style, styles);
        return element;
    };

    const brand = makeText("div", "H A C K I N D I A", {
        color: "#e5c77f",
        fontSize: "27px",
        fontWeight: "bold",
        letterSpacing: "8px",
        marginBottom: "28px"
    });

    const emblem = makeText("div", "★", {
        width: "64px",
        height: "64px",
        lineHeight: "64px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f5df9d, #bd9140)",
        color: "#17120a",
        fontSize: "38px",
        marginBottom: "20px",
        boxShadow: "0 0 22px rgba(201,163,74,.4)"
    });

    const heading = makeText("div", "CERTIFICATE OF ACHIEVEMENT", {
        color: "#e5c77f",
        fontSize: "34px",
        fontWeight: "bold",
        letterSpacing: "3px",
        marginBottom: "20px"
    });

    const subtitle = makeText("div",
        "This certificate is proudly presented to", {
        color: "#ded3b8",
        fontSize: "22px",
        marginBottom: "14px"
    });

    const name = makeText("div", studentName, {
        color: "#fff1c9",
        fontSize: "48px",
        fontWeight: "bold",
        marginBottom: "12px",
        borderBottom: "2px solid #c9a34a",
        padding: "0 35px 12px"
    });

    const achievement = makeText("div",
        "For successfully completing " + courseName, {
        color: "#ded3b8",
        fontSize: "21px",
        marginTop: "12px"
    });

    const tier = makeText("div",
        "★ " + achievementTier + " ★", {
        color: "#17120a",
        background: "linear-gradient(120deg, #a77b2d, #f5df9d, #bd9140)",
        border: "1px solid #ffe8a8",
        padding: "12px 32px",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "3px",
        marginTop: "22px"
    });

    const organisation = makeText("div", organization, {
        color: "#e5c77f",
        fontSize: "25px",
        fontWeight: "bold",
        marginTop: "18px"
    });

    const dateText = makeText("div",
        "Issue Date: " + formattedDate, {
        color: "#ded3b8",
        fontSize: "18px",
        marginTop: "18px"
    });

    const footer = document.createElement("div");

    Object.assign(footer.style, {
        position: "absolute",
        left: "55px",
        right: "55px",
        bottom: "35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end"
    });

    const qrSection = document.createElement("div");
    const qrBox = document.createElement("div");

    Object.assign(qrBox.style, {
        width: "90px",
        height: "90px",
        background: "#ffffff",
        padding: "4px",
        boxSizing: "border-box"
    });

    const qrLabel = makeText("div", certificateID, {
        color: "#e5c77f",
        fontSize: "12px",
        marginTop: "7px"
    });

    qrSection.append(qrBox, qrLabel);

    const signature = makeText("div",
        "AUTHORISED SIGNATORY\nHACKINDIA 2026", {
        whiteSpace: "pre-line",
        color: "#e5c77f",
        fontSize: "17px",
        lineHeight: "2",
        border: "1px solid #c9a34a",
        padding: "12px 25px"
    });

    footer.append(qrSection, signature);

    exportCertificate.append(
        brand,
        emblem,
        heading,
        subtitle,
        name,
        achievement,
        tier,
        organisation,
        dateText,
        footer
    );

    const wrapper = document.createElement("div");

    Object.assign(wrapper.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "1122px",
        background: "#050505",
        zIndex: "99999"
    });

    wrapper.appendChild(exportCertificate);
    document.body.appendChild(wrapper);

    try {

        new QRCode(qrBox, {
            text: certificateID,
            width: 82,
            height: 82,
            colorDark: "#11100e",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        await html2pdf().set({
            margin: 0,
            filename: "HackIndia-Luxury-Certificate.pdf",
            image: {
                type: "jpeg",
                quality: 1
            },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: "#050505"
            },
            jsPDF: {
                unit: "mm",
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
