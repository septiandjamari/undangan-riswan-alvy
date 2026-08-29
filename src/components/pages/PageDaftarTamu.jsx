import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

/* ── helpers ── */
const HADIR_LABEL = { hadir: "Hadir", "tidak-hadir": "Tidak Hadir", mungkin: "Mungkin" };
const HADIR_COLOR = { hadir: "#4caf7d", "tidak-hadir": "#e57373", mungkin: "#d99a34" };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Tab: Ucapan ── */
function TabUcapan() {
  const [tamu, setTamu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, "buku-tamu"), orderBy("createdAt", "desc")))
      .then((snap) => setTamu(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false));
  }, []);

  const hadir      = tamu.filter((t) => t.hadir === "hadir").length;
  const tidakHadir = tamu.filter((t) => t.hadir === "tidak-hadir").length;
  const mungkin    = tamu.filter((t) => t.hadir === "mungkin").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {!loading && (
        <div style={s.summaryRow}>
          {[
            { label: "Total",       val: tamu.length,  color: "#69755A" },
            { label: "Hadir",       val: hadir,        color: HADIR_COLOR.hadir },
            { label: "Mungkin",     val: mungkin,      color: HADIR_COLOR.mungkin },
            { label: "Tidak Hadir", val: tidakHadir,   color: HADIR_COLOR["tidak-hadir"] },
          ].map(({ label, val, color }) => (
            <div key={label} style={s.summaryCard}>
              <span style={{ ...s.summaryNum, color }}>{val}</span>
              <span style={s.summaryLabel}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p style={s.empty}>Memuat data…</p>
      ) : tamu.length === 0 ? (
        <p style={s.empty}>Belum ada ucapan.</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Nama", "Ucapan", "Kehadiran", "Waktu"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tamu.map((t, i) => (
                <tr key={t.id} style={i % 2 === 0 ? s.rowEven : s.rowOdd}>
                  <td style={s.tdNum}>{i + 1}</td>
                  <td style={s.td}>{t.nama}</td>
                  <td style={s.tdUcapan}>{t.ucapan}</td>
                  <td style={s.td}>
                    <span style={{
                      ...s.badge,
                      background: HADIR_COLOR[t.hadir] + "22",
                      color: HADIR_COLOR[t.hadir],
                      border: `1px solid ${HADIR_COLOR[t.hadir]}44`,
                    }}>
                      {HADIR_LABEL[t.hadir] ?? t.hadir}
                    </span>
                  </td>
                  <td style={s.tdDate}>{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Confirm Dialog ── */
function ConfirmDialog({ message, onOk, onCancel, labelCancel = "Batal", labelOk = "Ya" }) {
  return (
    <div style={s.dialogOverlay} onClick={onCancel}>
      <div style={s.dialogBox} onClick={(e) => e.stopPropagation()}>
        <p style={s.dialogMsg}>{message}</p>
        <div style={s.dialogActions}>
          <button style={s.dialogBtnCancel} onClick={onCancel}>{labelCancel}</button>
          <button style={s.dialogBtnOk}     onClick={onOk}>{labelOk}</button>
        </div>
      </div>
    </div>
  );
}

function toWaNumber(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return digits;
}

function buildWaMessage(nama, docId) {
  const baseUrl = window.location.origin;
  const link = `${baseUrl}/?to=${docId}`;
  return `Yth. ${nama}

Assalamualaikum Wr. Wb.

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

Riswanda, S.Kom., Gr.
&
Alvy Nurul A., S.E.

Berikut link undangan kami, untuk info lengkap dari acara bisa kunjungi :

${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.

Terima kasih banyak atas perhatiannya.

Wasaalamualaikum Wr. Wb.

Kami yang berbahagia,
Riswanda, Alvy & Keluarga`;
}

/* ── Tab: Daftar Nama Tamu ── */
function TabDaftarTamu() {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [nama, setNama]       = useState("");
  const [telepon, setTelepon] = useState("");
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState("");
  const [filter, setFilter]   = useState("semua");
  const [search, setSearch]   = useState("");
  const [dialog, setDialog]   = useState({ open: false, message: "", onOk: null, labelCancel: "Batal", labelOk: "Ya" });

  const askConfirm = (message, onOk, labelCancel = "Batal", labelOk = "Ya") =>
    setDialog({ open: true, message, onOk, labelCancel, labelOk });
  const closeDialog = () => setDialog({ open: false, message: "", onOk: null, labelCancel: "Batal", labelOk: "Ya" });

  useEffect(() => {
    getDocs(query(collection(db, "tamu-undangan"), orderBy("createdAt", "asc")))
      .then((snap) => setList(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!nama.trim()) { setErr("Nama wajib diisi."); return; }
    setSaving(true);
    try {
      const entry = {
        nama: nama.trim(),
        telepon: telepon.trim(),
        selesai: false,
        createdAt: new Date().toISOString(),
      };
      const ref = await addDoc(collection(db, "tamu-undangan"), entry);
      setNama(""); setTelepon("");
      setList((prev) => [...prev, { id: ref.id, ...entry }]);
    } catch {
      setErr("Gagal menyimpan.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tamu-undangan", id));
    setList((prev) => prev.filter((t) => t.id !== id));
  };

  const handleBlur = async (id, field, value) => {
    await updateDoc(doc(db, "tamu-undangan", id), { [field]: value });
  };

  const handleChange = (id, field, value) => {
    setList((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t));
  };

  const filtered = list.filter((t) => {
    if (filter === "selesai") return t.selesai === true;
    if (filter === "belum")   return !t.selesai;
    return true;
  }).filter((t) =>
    search.trim() === "" || t.nama.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
      {/* Form tambah tamu */}
      <form onSubmit={handleSubmit} style={s.form}>
        <div style={s.formRow}>
          <div style={s.formGroup}>
            <label style={s.label}>Nama</label>
            <input
              className="dt-input"
              style={s.input}
              placeholder="Isi Nama tamu"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>No. Telepon</label>
            <input
              className="dt-input"
              style={s.input}
              placeholder="08xxx"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              type="tel"
            />
          </div>
          <button type="submit" style={s.btnAdd} disabled={saving}>
            {saving ? "…" : "Tambah"}
          </button>
        </div>
        {err && <p style={s.errMsg}>{err}</p>}
      </form>

      {/* Tabel tamu */}
      {/* Filter */}
      <div style={s.filterRow}>
        <span style={s.filterLabel}>Filter by:</span>
        {[
          { val: "semua",  label: "Semua"         },
          { val: "selesai",label: "Selesai"        },
          { val: "belum",  label: "Belum Selesai"  },
        ].map(({ val, label }) => (
          <label key={val} style={s.filterOption}>
            <input
              type="radio"
              name="filter-tamu"
              value={val}
              checked={filter === val}
              onChange={() => setFilter(val)}
              style={{ accentColor: "#D99A34" }}
            />
            {label}
          </label>
        ))}
        <input
          className="dt-input"
          style={s.searchInput}
          placeholder="Cari nama…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={s.empty}>Memuat data…</p>
      ) : list.length === 0 ? (
        <p style={s.empty}>Belum ada tamu yang ditambahkan.</p>
      ) : filtered.length === 0 ? (
        <p style={s.empty}>Tidak ada tamu dengan filter ini.</p>
      ) : (
        <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {[
                { label: "#",           center: false, width: 44,  sticky: true,  left: 0   },
                { label: "Nama",        center: false, width: 160, sticky: true,  left: 44  },
                { label: "No. Telepon", center: false             },
                { label: "Hapus",       center: true,  width: 60  },
                { label: "Bagikan",     center: true,  width: 80  },
                { label: "Selesai",     center: true,  width: 72  },
              ].map(({ label, center, width, sticky, left }) => (
                <th key={label} style={{
                  ...s.th,
                  ...(center  ? { textAlign: "center" } : {}),
                  ...(width   ? { width, minWidth: width } : {}),
                  ...(sticky  ? { position: "sticky", left, zIndex: 2 } : {}),
                }}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const bg = i % 2 === 0 ? "#fff" : "#faf6ee";
              return (
              <tr key={t.id} style={i % 2 === 0 ? s.rowEven : s.rowOdd}>
                <td style={{ ...s.tdNum, position: "sticky", left: 0,  background: bg, zIndex: 1 }}>{i + 1}</td>
                <td style={{ ...s.td,    position: "sticky", left: 44, background: bg, zIndex: 1 }}>
                  <input
                    style={s.cellInput}
                    value={t.nama}
                    onChange={(e) => handleChange(t.id, "nama", e.target.value)}
                    onBlur={(e) => handleBlur(t.id, "nama", e.target.value)}
                  />
                </td>
                <td style={s.td}>
                  <input
                    style={s.cellInput}
                    value={t.telepon}
                    placeholder="—"
                    onChange={(e) => handleChange(t.id, "telepon", e.target.value)}
                    onBlur={(e) => handleBlur(t.id, "telepon", e.target.value)}
                    type="tel"
                  />
                </td>
                <td style={s.tdCenter}>
                  <button
                    style={s.btnDel}
                    onClick={() => askConfirm(
                      `Hapus "${t.nama}" dari daftar tamu?`,
                      () => { handleDelete(t.id); closeDialog(); }
                    )}
                    title="Hapus"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </td>
                <td style={s.tdCenter}>
                  {t.telepon ? (
                    <button
                      style={s.btnWa}
                      title={`Bagikan ke ${t.nama}`}
                      onClick={() => askConfirm(
                        `Kirim undangan WhatsApp ke ${t.nama} (${t.telepon})?`,
                        () => {
                          const msg = buildWaMessage(t.nama, t.id);
                          window.open(`https://wa.me/${toWaNumber(t.telepon)}?text=${encodeURIComponent(msg)}`, "_blank");
                          askConfirm(
                            `Tandai tamu undangan ${t.nama} sudah dikirimi pesan WhatsApp?`,
                            () => {
                              handleChange(t.id, "selesai", true);
                              handleBlur(t.id, "selesai", true);
                              closeDialog();
                            },
                            "Tidak", "Iya"
                          );
                        }
                      )}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  ) : (
                    <span style={{ opacity: .3, fontSize: 12 }}>—</span>
                  )}
                </td>
                <td style={s.tdCenter}>
                  <button
                    style={{ ...s.btnSelesai, ...(t.selesai ? s.btnSelesaiDone : {}) }}
                    onClick={() => {
                      const next = !t.selesai;
                      handleChange(t.id, "selesai", next);
                      handleBlur(t.id, "selesai", next);
                    }}
                    title={t.selesai ? "Tandai belum selesai" : "Tandai selesai"}
                  >
                    {t.selesai ? "✓" : "○"}
                  </button>
                </td>
              </tr>
            );})}
          </tbody>
        </table>
        </div>
      )}

      {dialog.open && (
        <ConfirmDialog
          message={dialog.message}
          onOk={dialog.onOk}
          onCancel={closeDialog}
          labelCancel={dialog.labelCancel}
          labelOk={dialog.labelOk}
        />
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function PageDaftarTamu() {
  const [tab, setTab] = useState("daftar-tamu");

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.title}>List Undangan</h1>
        <p style={s.subtitle}>Riswanda &amp; Alvy</p>

        {/* Tabs */}
        <div style={s.tabBar}>
          {[
            { key: "daftar-tamu", label: "Daftar Nama Tamu" },
            { key: "ucapan",      label: "Ucapan" },
          ].map(({ key, label }) => (
            <button
              key={key}
              style={{ ...s.tabBtn, ...(tab === key ? s.tabBtnActive : {}) }}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
          {tab === "ucapan"      && <TabUcapan />}
          {tab === "daftar-tamu" && <TabDaftarTamu />}
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const s = {
  page: {
    height: "100dvh",
    display: "flex", flexDirection: "column", overflow: "hidden",
    background: "#F5EAD0",
    padding: "32px 16px 16px",
    fontFamily: '"GFS Didot", "Didot", serif',
    color: "#69755A",
  },
  container: { maxWidth: 860, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 },
  title: {
    fontSize: "clamp(24px, 4vw, 36px)",
    margin: "0 0 4px",
    color: "#69755A",
    fontWeight: "normal",
    letterSpacing: "0.05em",
  },
  subtitle: {
    fontSize: 13, letterSpacing: "0.2em", color: "#D99A34",
    margin: "0 0 24px", textTransform: "uppercase",
  },
  tabBar: {
    display: "flex", gap: 8, marginBottom: 24,
    borderBottom: "1px solid rgba(184,141,63,.3)", paddingBottom: 0,
  },
  tabBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: "8px 18px 10px", fontSize: 14,
    fontFamily: '"GFS Didot", "Didot", serif',
    color: "#69755A", opacity: 0.5,
    borderBottom: "2px solid transparent", marginBottom: -1,
  },
  tabBtnActive: {
    opacity: 1, borderBottom: "2px solid #D99A34", color: "#D99A34",
  },
  summaryRow: { display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" },
  summaryCard: {
    background: "#fff", border: "1px solid rgba(184,141,63,.3)",
    borderRadius: 12, padding: "12px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", minWidth: 72,
  },
  summaryNum:   { fontSize: 28, fontWeight: "bold", color: "#69755A", lineHeight: 1 },
  summaryLabel: { fontSize: 11, letterSpacing: "0.1em", marginTop: 4, color: "#69755A", opacity: 0.7 },
  tableWrap: {
    overflowX: "auto", overflowY: "auto", flex: 1, minHeight: 0, borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,.06)",
  },
  table: {
    width: "100%", borderCollapse: "collapse",
    background: "#fff", fontSize: 14, minWidth: 520,
  },
  th: {
    padding: "12px 14px", textAlign: "left",
    background: "#69755A", color: "#F5EAD0",
    fontWeight: "normal", letterSpacing: "0.08em", fontSize: 12, whiteSpace: "nowrap",
    position: "sticky", top: 0, zIndex: 3,
  },
  rowEven: { background: "#fff" },
  rowOdd:  { background: "#faf6ee" },
  td:        { padding: "10px 14px", verticalAlign: "middle", borderBottom: "1px solid rgba(184,141,63,.15)" },
  tdNum:     { padding: "10px 14px", verticalAlign: "middle", borderBottom: "1px solid rgba(184,141,63,.15)", color: "#aaa", fontSize: 12, width: 32 },
  tdUcapan:  { padding: "10px 14px", verticalAlign: "middle", borderBottom: "1px solid rgba(184,141,63,.15)", maxWidth: 280, lineHeight: 1.6 },
  tdDate:    { padding: "10px 14px", verticalAlign: "middle", borderBottom: "1px solid rgba(184,141,63,.15)", fontSize: 12, color: "#aaa", whiteSpace: "nowrap" },
  tdCenter:  { padding: "10px 14px", verticalAlign: "middle", borderBottom: "1px solid rgba(184,141,63,.15)", textAlign: "center" },
  badge: { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: "500" },
  empty: { textAlign: "center", opacity: 0.5, marginTop: 48 },
  form: {
    background: "#fff", border: "1px solid rgba(184,141,63,.3)",
    borderRadius: 12, padding: "16px 20px", marginBottom: 24,
  },
  formRow:  { display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" },
  formGroup:{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 160 },
  label:    { fontSize: 11, letterSpacing: "0.1em", opacity: 0.7 },
  input: {
    padding: "8px 12px", border: "1px solid rgba(184,141,63,.4)",
    borderRadius: 8, fontSize: 14, background: "#faf6ee",
    fontFamily: '"GFS Didot", "Didot", serif', color: "#69755A",
    outline: "none",
  },
  btnAdd: {
    padding: "8px 20px", background: "#69755A", color: "#F5EAD0",
    border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer",
    fontFamily: '"GFS Didot", "Didot", serif', whiteSpace: "nowrap",
    alignSelf: "flex-end",
  },
  btnSelesai: {
    background: "none", border: "1px solid rgba(105,117,90,.3)", cursor: "pointer",
    color: "#69755A", fontSize: 14, width: 26, height: 26, borderRadius: "50%",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    opacity: 0.4, transition: "all .15s", padding: 0,
  },
  btnSelesaiDone: {
    background: "#4caf7d22", border: "1px solid #4caf7d66",
    color: "#4caf7d", opacity: 1,
  },
  btnDel: {
    background: "none", border: "none", cursor: "pointer",
    color: "#e57373", fontSize: 14, padding: 0,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26,
  },
  btnWa: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "3px 10px", background: "#25d36622", color: "#25d366",
    border: "1px solid #25d36644", borderRadius: 20,
    fontSize: 12, textDecoration: "none", fontWeight: "500",
  },
  cellInput: {
    width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid transparent", outline: "none",
    fontFamily: '"GFS Didot", "Didot", serif', fontSize: 14,
    color: "#69755A", padding: "2px 0",
    transition: "border-color .15s",
  },
  errMsg: { color: "#e57373", fontSize: 12, marginTop: 8, marginBottom: 0 },
  filterRow: {
    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    marginBottom: 16, fontSize: 13, color: "#69755A",
  },
  filterLabel: { opacity: 0.6, letterSpacing: "0.08em", fontSize: 11 },
  dialogOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  dialogBox: {
    background: "#fff", borderRadius: 16, padding: "28px 28px 20px",
    maxWidth: 340, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,.18)",
    fontFamily: '"GFS Didot", "Didot", serif',
  },
  dialogMsg: {
    margin: "0 0 24px", fontSize: 15, color: "#69755A",
    lineHeight: 1.6, textAlign: "center",
  },
  dialogActions: {
    display: "flex", gap: 10, justifyContent: "flex-end",
  },
  dialogBtnCancel: {
    padding: "8px 20px", background: "none",
    border: "1px solid rgba(105,117,90,.3)", borderRadius: 8,
    fontSize: 14, cursor: "pointer", color: "#69755A",
    fontFamily: '"GFS Didot", "Didot", serif',
  },
  dialogBtnOk: {
    padding: "8px 20px", background: "#69755A", color: "#F5EAD0",
    border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer",
    fontFamily: '"GFS Didot", "Didot", serif',
  },
  filterOption: {
    display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
  },
  searchInput: {
    marginLeft: "auto",
    padding: "5px 12px", border: "1px solid rgba(184,141,63,.4)",
    borderRadius: 8, fontSize: 13, background: "#faf6ee",
    fontFamily: '"GFS Didot", "Didot", serif', color: "#69755A",
    outline: "none", minWidth: 160,
  },
};
