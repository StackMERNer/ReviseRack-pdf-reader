import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fileColors} from '../utils/colors';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FileObject} from '../navigation/screens/HomeScreen';

const PdfFiles = ({
  onLongPress,
  onPress,
  files: folders,
}: {
  files: FileObject[];
  onLongPress: (file: FileObject) => void;
  onPress: (file: FileObject) => void;
}) => {
  return (
    <View style={styles.filesContainer}>
      <FlatList
        data={folders}
        numColumns={1}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => onPress(item)}
            onLongPress={() => onLongPress(item)}
            style={[
              styles.file,
              {borderColor: fileColors[index % fileColors.length]},
            ]}>
            <View>
              {item.isFile() ? (
                <AntDesign
                  color={fileColors[index % fileColors.length]}
                  name="pdffile1"
                  size={30}
                />
              ) : (
                <MCIcon
                  name="folder-open"
                  color={fileColors[index % fileColors.length]}
                  size={30}
                />
              )}
            </View>

            <Text style={styles.fileName}>
              {item.name.length > 40
                ? item.name.substring(0, 40) + '..'
                : item.name}
            </Text>
            {item.isDirectory() && (
              <Text>
                {item.numberOfFiles !== undefined
                  ? `${item.numberOfFiles} files`
                  : ''}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    width: '100%',
    paddingBottom: 60,
  },
  file: {
    borderRadius: 10,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    borderWidth: 0.4,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  fileName: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#23395F',
  },
});
export default PdfFiles;
