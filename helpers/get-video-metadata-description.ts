type TGetVideoMetadataDescriptionProps = {
  title: string;
  showTitle?: string | null;
};

const getVideoMetadataDescription = ({
  title,
  showTitle
}: TGetVideoMetadataDescriptionProps) => {
  const descriptionParts = [`Vê ${title} no arquivo Os Gatos.`];

  if (showTitle) {
    descriptionParts.push(`Sketch da série ${showTitle}.`);
  }

  return descriptionParts.join(' ');
};

export { getVideoMetadataDescription };
