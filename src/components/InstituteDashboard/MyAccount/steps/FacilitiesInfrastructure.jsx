import React, { useState, useEffect } from "react";
import { db } from "../../../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const FacilitiesInfrastructure = ({ setStep }) => {
  const [facility, setFacility] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // If you still want to load data from a fixed doc id,
        const docRef = doc(db, "myactivity", "defaultDoc");
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setFacility(snap.data()?.facilitiesInfrastructure ?? "");
        }
      } catch (error) {
        console.error("🔥 Load Error:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // ================= SAVE =================
  const handleSave = async () => {
    // ✅ Only validate field
    if (!facility.trim()) {
      setErrors({ facility: "Please fill the field" });
      return;
    }

    try {
      setSaving(true);

      const docRef = doc(db, "myactivity", "defaultDoc"); // change if needed

      await setDoc(
        docRef,
        {
          facilitiesInfrastructure: facility,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Saved Successfully ✅");
    } catch (error) {
      console.error("🔥 Save Error:", error);
      alert("Save Failed ❌");
    }

    setSaving(false);
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setFacility("");
    setErrors({});
  };

  if (loading) {
    return <p className="text-gray-500 p-6">Loading...</p>;
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-orange-600 mb-2">
        Facilities & Infrastructure <span className="text-red-500">*</span>
      </h2>

      <textarea
        placeholder="Add Facilities & Infrastructure Details"
        value={facility}
        onChange={(e) => {
          setFacility(e.target.value);
          setErrors({});
        }}
        className="w-full h-40 p-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-1 focus:ring-orange-500
                   focus:border-orange-500 resize-none"
      />

      {errors.facility && (
        <p className="text-red-500 text-sm mt-1">
          {errors.facility}
        </p>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="text-orange-600 font-medium hover:text-orange-700 transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition shadow-sm"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default FacilitiesInfrastructure;