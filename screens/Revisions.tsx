import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';

import PDFReader from './PDFReader';
interface FileObject {
  ctime: Date | undefined;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | undefined;
  name: string | null;
  path: string;
  size: number;
}
const Revisions = () => {
  const [revisionFolders, setRevisionFolders] = useState<FileObject[]>([]);
  const revisionsPath = `${RNFS.DocumentDirectoryPath}/Revisions`;
  useEffect(() => {
    RNFS.readDir(revisionsPath)
      .then(result => {
        setRevisionFolders(result);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  }, [revisionsPath]);
  const [files, setFiles] = useState<FileObject[]>([]);
  //   const [readFiles,setReadFileType] = useState('')l
  const [activePdf, setActivePdf] = useState('');

  const [filePath, setFilePath] = useState('');
  useEffect(() => {
    if (filePath) {
      //   const readFiles = () => {
      RNFS.readDir(filePath)
        .then(result => {
          setFiles(result);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
      //   };
    }
  }, [filePath]);

  //   console.log('activePdf', activePdf);
  if (activePdf) {
    return <PDFReader pdfFilePath={activePdf} />;
  }
  return (
    <View style={styles.revisionsContainer}>
      {revisionFolders.map((revision, index) => (
        <TouchableOpacity
          onPress={() => setFilePath(revision.path)}
          style={styles.revision}
          key={index}>
          <Text>{revision.name}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.revisionList}>
        {files.map((file, index) => (
          <TouchableOpacity onPress={() => setActivePdf(file.path)} key={index}>
            <Text>{file.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  revisionsContainer: {
    paddingHorizontal: 10,
  },
  revisionList: {
    borderWidth: 1,
    padding: 10,
  },
  revision: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default Revisions;