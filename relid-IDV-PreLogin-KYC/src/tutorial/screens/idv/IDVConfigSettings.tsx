/**
 * IDV Config Settings Screen
 * 
 * This screen demonstrates how to use the getIDVConfig and setIDVConfig APIs.
 * These are synchronous APIs that return results directly in the response.
 * Provides UI for managing IDV configuration settings dynamically.
 */

import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput, ScrollView, StyleSheet } from 'react-native';
import RdnaService from '../../../uniken/services/rdnaService';

const IDVConfigSettings: React.FC = () => {
  const [isWaitingForGetConfig, setIsWaitingForGetConfig] = useState(false);
  const [isWaitingForSetConfig, setIsWaitingForSetConfig] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<string>('');
  const [newConfigJson, setNewConfigJson] = useState<string>('');
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);

  // Sample IDV configuration JSON
  const sampleConfig = {
    documentTypes: ["passport", "driverLicense", "nationalId"],
    captureSettings: {
      frontScanRequired: true,
      backScanRequired: true,
      qualityThreshold: 0.85,
      timeout: 30000
    },
    validationRules: {
      enableFaceMatch: true,
      enableOCR: true,
      enableDocumentAuthenticity: true,
      confidenceThreshold: 0.9
    },
    uiSettings: {
      showGuidelines: true,
      autoCapture: false,
      retakeAllowed: true,
      maxRetries: 3
    }
  };


  const handleGetIDVConfig = async () => {
    try {
      setIsWaitingForGetConfig(true);
      console.log('IDVConfigSettings - Getting IDV configuration...');
      
      // Call the API to retrieve IDV configuration
      const response = await RdnaService.getIDVConfig();
      
      console.log('IDVConfigSettings - Get config API response:', response);
      setLastApiResponse(response);
      
      // Extract config from response if available
      if (response && (response as any).response) {
        const configData = typeof (response as any).response === 'string' 
          ? (response as any).response 
          : JSON.stringify((response as any).response);
        setCurrentConfig(configData);
      }
      
      setIsWaitingForGetConfig(false);
      Alert.alert('Success', 'IDV configuration retrieved successfully!');
      
    } catch (error) {
      console.error('IDVConfigSettings - Failed to get IDV config:', error);
      setIsWaitingForGetConfig(false);
      setLastApiResponse(error);
      Alert.alert('Error', 'Failed to get IDV configuration');
    }
  };

  const handleSetIDVConfig = async () => {
    try {
      if (!newConfigJson.trim()) {
        Alert.alert('Error', 'Please enter a valid JSON configuration');
        return;
      }

      // Validate JSON format
      try {
        JSON.parse(newConfigJson);
      } catch (e) {
        Alert.alert('Error', 'Invalid JSON format. Please check your configuration.');
        return;
      }

      setIsWaitingForSetConfig(true);
      console.log('IDVConfigSettings - Setting IDV configuration...');
      
      // Call the API to set IDV configuration
      const response = await RdnaService.setIDVConfig(newConfigJson);
      
      console.log('IDVConfigSettings - Set config API response:', response);
      setLastApiResponse(response);
      setIsWaitingForSetConfig(false);
      
      Alert.alert('Success', 'IDV configuration set successfully!');
      
    } catch (error) {
      console.error('IDVConfigSettings - Failed to set IDV config:', error);
      setIsWaitingForSetConfig(false);
      setLastApiResponse(error);
      Alert.alert('Error', 'Failed to set IDV configuration');
    }
  };

  const handleUseSampleConfig = () => {
    setNewConfigJson(JSON.stringify(sampleConfig, null, 2));
  };

  const handleClearConfig = () => {
    setNewConfigJson('');
    setCurrentConfig('');
    setLastApiResponse(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>IDV Configuration Settings</Text>
      
      <Text style={styles.description}>
        This screen demonstrates the getIDVConfig and setIDVConfig APIs for managing IDV configuration settings.
        These are synchronous APIs that return results directly and allow dynamic workflow configuration.
      </Text>
      
      {/* Get IDV Config Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get IDV Config</Text>
        <Button
          title="Get Current Config"
          onPress={handleGetIDVConfig}
          disabled={isWaitingForGetConfig}
        />
        
        {isWaitingForGetConfig && (
          <Text style={styles.waitingText}>
            Getting IDV configuration...
          </Text>
        )}
        
        {currentConfig && (
          <View style={styles.configDisplay}>
            <Text style={styles.configTitle}>Current Config:</Text>
            <TextInput
              style={styles.configText}
              value={currentConfig}
              editable={false}
              multiline
              numberOfLines={8}
            />
          </View>
        )}
      </View>

      {/* Set IDV Config Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Set IDV Config</Text>
        
        <View style={styles.buttonRow}>
          <Button
            title="Use Sample Config"
            onPress={handleUseSampleConfig}
          />
          <Button
            title="Clear"
            onPress={handleClearConfig}
            color="#ff6b6b"
          />
        </View>
        
        <TextInput
          style={styles.configInput}
          value={newConfigJson}
          onChangeText={setNewConfigJson}
          placeholder="Enter IDV configuration JSON here..."
          multiline
          numberOfLines={10}
        />
        
        <Button
          title="Set Config"
          onPress={handleSetIDVConfig}
          disabled={isWaitingForSetConfig || !newConfigJson.trim()}
        />
        
        {isWaitingForSetConfig && (
          <Text style={styles.waitingText}>
            Setting IDV configuration...
          </Text>
        )}
      </View>

      {/* API Response Display */}
      {lastApiResponse && (
        <View style={styles.eventDisplay}>
          <Text style={styles.eventTitle}>Latest API Response:</Text>
          <Text>Error Code: {lastApiResponse.error?.longErrorCode || 'N/A'}</Text>
          <Text>Error Message: {lastApiResponse.error?.errorString || 'None'}</Text>
          <Text>Response Type: {typeof lastApiResponse.response}</Text>
          {lastApiResponse.response && (
            <Text>Response Data: {JSON.stringify(lastApiResponse.response).substring(0, 100)}...</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  configDisplay: {
    marginTop: 15,
  },
  configTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  configText: {
    backgroundColor: '#e9e9e9',
    padding: 10,
    borderRadius: 5,
    fontSize: 12,
    fontFamily: 'monospace',
    minHeight: 120,
  },
  configInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 150,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  waitingText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  eventDisplay: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d9e8',
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#2c5aa0',
  },
});

export default IDVConfigSettings;