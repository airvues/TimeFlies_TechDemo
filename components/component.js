import React, { useState, useEffect } from "react";
import styles from "../styles/style.module.css";

const Component = () => {
  const [warrantyNumber, setWarrantyNumber] = useState("");
  const [warrantyData, setWarrantyData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  // Handles warranty code submission and Airtable fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!warrantyNumber) {
      alert("Please enter a warranty number.");
      return;
    }
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/appeE4S87yKBhZZyb/Warranty?filterByFormula={Warranty ID}='${warrantyNumber}'`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer patjuRrHGpdA3SdRb.84cf94ba5374da58c8468374d41f4cf06e2ea0a7f2f9750a0fbb8de50c94e320",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      if (data.records.length > 0) {
        const record = data.records[0].fields;
        setWarrantyData({
          thumbnailImage: record["Thumbnail Image"]?.[0]?.url || null,
          model: record["Model"],
          brand: record["Brand"],
          referenceNumber: record["Reference Number"],
          serialNumber: record["Serial Number"],
          band: record["Band"],
          dial: record["Dial"],
          purchaseDate: record["Purchase Date"],
          warrantyID: record["Warranty ID"],
          warrantyStart: record["Warranty Start"],
          warrantyEnd: record["Warranty End"],
          warrantyStatus: record["Warranty Status"],
        });
        setError(null);
      } else {
        setWarrantyData(null);
        setError("Warranty ID does not match our records");
      }
    } catch {
      setWarrantyData(null);
      setError("An error occurred while verifying warranty");
    }
  };

  // Opens embedded Airtable form with prefilled warranty ID
  const openClaimModal = () => {
    if (warrantyData?.warrantyID) {
      const claimUrl = `https://airtable.com/embed/appu9QM1QMEr1U6gP/shrArGNEXjG72Yzn5?prefill_WarrantyID=${encodeURIComponent(
        warrantyData.warrantyID
      )}`;
      setModalUrl(claimUrl);
      setIsModalOpen(true);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {warrantyData ? "Certificate of Authenticity" : "Verify Your Timepiece"}
      </h2>

      {!warrantyData ? (
        <>
          <p className={styles.instructions}>
            Enter the 16-digit warranty code including dashes found on the back of
            your warranty card to view your watch details and/or to submit a claim.
          </p>
          {error && <p className={styles.error}>{error}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Enter your warranty code (required)
            </label>
            <input
              type="text"
              className={styles.input}
              value={warrantyNumber}
              onChange={(e) => setWarrantyNumber(e.target.value)}
              placeholder=" warranty number..."
            />
            <button type="submit" className={styles.button}>
              Verify Warranty
            </button>
          </form>
        </>
      ) : (
        <div className={styles.card}>
          {warrantyData.thumbnailImage && (
            <img
              src={warrantyData.thumbnailImage}
              alt="Product Thumbnail"
              className={styles.thumbnail}
            />
          )}
          <h3 className={styles.subheading}>Warranty Details</h3>
          {Object.entries(warrantyData).map(([key, value]) =>
  key !== "thumbnailImage" && value ? (
    <p key={key} className={styles.detailLine}>
      <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
    </p>
  ) : null
)}


          <button onClick={openClaimModal} className={styles.button}>
            Submit Claim
          </button>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => (window.location.href = "https://google.com")}
              className={styles.button}
            >
              Warranty Details
            </button>
            <button
              onClick={() => window.location.reload()}
              className={styles.button}
            >
              Verify Another Warranty
            </button>
          </div>

          <p className={styles.contactText}>
            Contact us: <a href="mailto:ian@time-sublime.com" className={styles.contactLink}>ian@time-sublime.com</a>
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              onClick={() => setIsModalOpen(false)}
              className={styles.closeButton}
            >
              Close
            </button>
            <iframe src={modalUrl} className={styles.iframe} title="Submit Claim" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Component;
