type TFileRecord = {
  collectionId: string;
  id: string;
};

const getFileUrl = (record: TFileRecord, fileName: string | undefined) => {
  if (!fileName) return '';

  return `${process.env.NEXT_PUBLIC_PB_URL}/api/files/${record.collectionId}/${record.id}/${fileName}`;
};

export { getFileUrl };
