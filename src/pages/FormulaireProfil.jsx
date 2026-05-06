import { useState } from "react";

const experiences = [
  { id: 1, label: "Développeur Web Senior chez Tech Solutions (2020-Présent)" },
  { id: 2, label: "Ingénieur Logiciel chez Innovate Corp (2017-2020)" },
];

export default function ProfileForm() {
  const [expList, setExpList] = useState(experiences);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", tel: "" });
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);

  const removeExp = (id) => setExpList((prev) => prev.filter((e) => e.id !== id));

  const handleFile = (file) => {
    if (file) setFileName(file.name);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        padding: "48px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ width: "100%", maxWidth: "640px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Glass Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {/* Personal Info */}
          <section>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b", marginBottom: "24px" }}>
              Informations Personnelles
            </h2>
            <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
              {/* Photo */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#e2e8f0",
                  border: "3px solid #fff",
                  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <svg width="28" height="28" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>

              {/* Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", flex: 1 }}>
                {[
                  { key: "nom", placeholder: "Nom", type: "text" },
                  { key: "prenom", placeholder: "Prénom", type: "text" },
                  { key: "email", placeholder: "Email (exemple@email.com)", type: "email" },
                  { key: "tel", placeholder: "Téléphone (+216 20 000 000)", type: "tel" },
                ].map(({ key, placeholder, type }) => (
                  <input
                    key={key}
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "13.5px",
                      color: "#374151",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#93c5fd")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />

          {/* Experience */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1e293b" }}>Expérience</h2>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "4px" }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M18 12H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {expList.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.4)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <span style={{ fontSize: "13.5px", color: "#374151", fontWeight: 500 }}>{exp.label}</span>
                  <div style={{ display: "flex", gap: "14px", flexShrink: 0, marginLeft: "12px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      </svg>
                    </button>
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
                      onClick={() => removeExp(exp.id)}
                    >
                      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />

          {/* CV Upload */}
          <section>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("cv-input").click()}
              style={{
                border: `2px dashed ${dragOver ? "#60a5fa" : "#bfdbfe"}`,
                background: dragOver ? "rgba(219,234,254,0.5)" : "rgba(239,246,255,0.3)",
                borderRadius: "18px",
                padding: "40px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "#dbeafe",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <svg width="26" height="26" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                {fileName ? fileName : "Télécharger mon CV"}
              </h3>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                {fileName ? "Fichier sélectionné ✓" : "Glisser-déposer un fichier ici ou cliquer pour parcourir"}
              </p>
              <input
                id="cv-input"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          </section>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
            <button
              style={{
                background: "#8ebcf0",
                color: "#fff",
                border: "none",
                padding: "14px 48px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(142,188,240,0.4)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.target.style.filter = "brightness(1.06)")}
              onMouseLeave={(e) => (e.target.style.filter = "brightness(1)")}
              onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
            >
              postuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
