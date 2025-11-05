const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <div className="text-gray-700">{children}</div>
    </section>
  );
};

export default Section
