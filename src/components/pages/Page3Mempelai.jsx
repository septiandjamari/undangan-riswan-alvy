function PersonCard({ name, role, parents }) {
  return (
    <div className="person-card">
      {/* <div className="person-avatar" aria-hidden="true" /> */}
      <p className="script person-name">{name}</p>
      {/* <br /> */}
      <p className="meta person-role">{role}</p>
      <p className="meta person-parents" dangerouslySetInnerHTML={{ __html: parents }} />
    </div>
  );
}

export default function Page3Mempelai() {
  return (
    <article className="canvas canvas--three">
      <img src="/assets/mempelai-riswanda-alvy.jpg" alt="Riswanda dan Alvy" className="mempelai-photo" />
      <div className="mempelai-block">
        <PersonCard
          name="Riswanda, S.Kom., Gr."
          role="Putra Pertama"
          parents="Bapak Imam<br />&amp; Ibu Siti Rochmah"
        />
        <PersonCard
          name="Alvy Nurul A., S.E."
          role="Putri Pertama"
          parents="Bapak Sukarmaji<br />&amp; Ibu Putikah"
        />
      </div>
    </article>
  );
}
