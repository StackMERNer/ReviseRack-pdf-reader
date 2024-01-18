import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNFS from 'react-native-fs';
import PDFReader from './PDFReader';
import {ScrollView} from 'react-native-gesture-handler';
interface FileObject {
  ctime: Date | undefined;
  isDirectory: () => boolean;
  isFile: () => boolean;
  mtime: Date | undefined;
  name: string | null;
  path: string;
  size: number;
}
const Revisions = ({onPdfSelect}: {onPdfSelect: (pdfPath: string) => void}) => {
  const [revisionFolders, setRevisionFolders] = useState<FileObject[]>([]);
  const revisionsPath = `${RNFS.DocumentDirectoryPath}/Revisions`;
  useEffect(() => {
    RNFS.readDir(revisionsPath)
      .then(result => {
        setRevisionFolders(result);
      })
      .catch(err => {
        console.log(err.message);
        // console.log(err.message, err.code);
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
  if (activePdf) {
    return (
      <PDFReader
        onPressBackBtn={() => setActivePdf('')}
        pdfFilePath={activePdf}
      />
    );
  }
  interface Range {
    startDate: Date;
    endDate: Date;
  }
  const dateRanges: Range[] = [
    {
      startDate: new Date(), // Current date
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    },
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    },
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
    },
    // Add more ranges as needed
  ];

  useEffect(() => {
    const todaysRevision = revisionFolders[0];
    // console.log('todaysRevision', todaysRevision);

    if (todaysRevision) {
      setFilePath(todaysRevision.path);
    }
  }, [revisionFolders]);
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingBottom: 40,
        
      }}>
      <View style={styles.revisionsContainer}>
        <View>
          {files.length > 1 && (
            <Text
              style={{
                textAlign: 'center',
                paddingVertical: 10,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Todays Revisions
            </Text>
          )}
        </View>
        <FlatList
          data={files}
          // contentContainerStyle={{columnGap: 5}}
          renderItem={({item, index}) => (
            <View style={styles.revision}>
              <View>
                <Text
                  onPress={() => onPdfSelect(item.path)}
                  style={{fontSize: 18}}>
                  {index + 1}. {item.name}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#EAFFE1',
                  paddingHorizontal: 10,
                  borderRadius: 50,
                }}>
                <Text style={{color: 'green'}}>done</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  revisionsContainer: {
    marginTop: 15,
    width: '96%',
    height: 240,
    backgroundColor: 'white',
    paddingBottom:20,
    borderRadius: 10,
    gap: 2,
  },
  revisionList: {
    borderWidth: 1,
    padding: 10,
  },
  revision: {
    padding: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  calendarContainer: {
    height: '50%',
    width: '100%',
    paddingVertical: 16,
    // borderWidth: 2,
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Revisions;
