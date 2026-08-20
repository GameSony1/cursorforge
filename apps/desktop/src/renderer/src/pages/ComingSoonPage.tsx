interface Props {
  title: string;
  description: string;
}

export function ComingSoonPage({ title, description }: Props) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{description}</p>
      <div className="coming-soon-badge">Скоро</div>
    </div>
  );
}
