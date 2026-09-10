type TJsonLdProps = {
  data: Record<string, unknown>;
};

const JsonLd = ({ data }: TJsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export { JsonLd };
