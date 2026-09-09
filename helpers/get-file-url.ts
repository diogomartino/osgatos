type TFileRecord = {
  collectionId: string;
  id: string;
};

const getFileUrl = (record: TFileRecord, fileName: string | undefined) => {
  if (!fileName) return '';

  const base = (process.env.NEXT_PUBLIC_PB_URL ?? '').replace(/\/$/, '');

  return `${base}/api/files/${record.collectionId}/${record.id}/${fileName}`;
};

export { getFileUrl };
