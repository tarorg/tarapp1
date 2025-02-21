import { init, InstaQLEntity } from '@instantdb/react-native';
import schema, { AppSchema } from '../../../instant.schema';
import React from 'react';
import { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type InstantFile = InstaQLEntity<AppSchema, '$files'>

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID;
const db = init({ appId: APP_ID, schema });

async function uploadImage(uri: string) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.split('/').pop() || 'image.jpg';
    
    const opts = {
      contentType: 'image/jpeg',
      contentDisposition: 'attachment',
    };
    
    await db.storage.uploadFile(filename, blob, opts);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

async function deleteImage(image: InstantFile) {
  await db.storage.delete(image.path);
}

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (selectedImage) {
      setIsUploading(true);
      await uploadImage(selectedImage);
      setSelectedImage(null);
      setIsUploading(false);
    }
  };

  return (
    <View style={[styles.uploadContainer, isDragging && styles.uploadContainerDragging]}>
      <TouchableOpacity onPress={pickImage} style={styles.dropZone}>
        <View style={styles.dropZoneInner}>
          <View style={styles.dropZoneIcon}>
            <Text style={styles.dropZoneIconText}>+</Text>
          </View>
          <Text style={styles.dropZoneTitle}>Drop files here</Text>
          <Text style={styles.dropZoneSubtitle}>or click to upload</Text>
        </View>
      </TouchableOpacity>

      {isUploading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0061FE" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      ) : selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function ImageGrid({ images }: { images: InstantFile[] }) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (image: InstantFile) => {
    setDeletingIds(prev => new Set([...prev, image.id]));
    await deleteImage(image);
    setDeletingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(image.id);
      return newSet;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {images.map((image) => {
        const isDeleting = deletingIds.has(image.id);
        return (
          <View key={image.id} style={styles.imageCard}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: image.url }} style={styles.gridImage} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity
                  onPress={() => handleDelete(image)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
              {isDeleting && (
                <View style={styles.deletingOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </View>
            <View style={styles.imageFooter}>
              <Text style={styles.imagePath} numberOfLines={1}>{image.path}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function Sales() {
  const { isLoading, error, data } = db.useQuery({
    $files: {
      $: {
        order: { serverCreatedAt: 'desc' },
      },
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0061FE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load files</Text>
      </View>
    );
  }

  const { $files: images } = data;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Files</Text>
        <Text style={styles.subtitle}>{images.length} items</Text>
      </View>
      <ImageUpload />
      {images.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No files yet</Text>
          <Text style={styles.emptyStateSubtext}>Upload your first file to get started</Text>
        </View>
      ) : (
        <ImageGrid images={images} />
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E8EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: '#1E1919',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#637381',
  },
  uploadContainer: {
    margin: 20,
    borderWidth: 2,
    borderColor: '#E6E8EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    transition: '0.3s',
  },
  uploadContainerDragging: {
    borderColor: '#0061FE',
    backgroundColor: '#F0F5FF',
  },
  dropZone: {
    padding: 40,
  },
  dropZoneInner: {
    alignItems: 'center',
  },
  dropZoneIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0061FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropZoneIconText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '300',
  },
  dropZoneTitle: {
    fontSize: 18,
    color: '#1E1919',
    fontWeight: '500',
    marginBottom: 8,
  },
  dropZoneSubtitle: {
    fontSize: 14,
    color: '#637381',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#637381',
  },
  previewContainer: {
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#0061FE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  gridContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  imageCard: {
    width: (width - 56) / 2,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6E8EB',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E6E8EB',
  },
  imagePath: {
    fontSize: 12,
    color: '#637381',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF4D4F',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    textAlign: 'center',
    color: '#FF4D4F',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#1E1919',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#637381',
    textAlign: 'center',
  },
});
