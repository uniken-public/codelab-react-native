/**
 * IDV Detailed Configuration Screen
 * 
 * This screen demonstrates how to use the getIDVConfig and setIDVConfig APIs
 * with detailed configuration management capabilities.
 * Replicates the exact functionality of the reference IDVDetailedConfigurations.js screen.
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RdnaService from '../../../uniken/services/rdnaService';

interface ConfigState {
  config: {
    version: string;
    saveDebugLogs: boolean;
    nfcScanEnabled: boolean;
    nfcScanTimeOut: number;
    isRawDataRequired: boolean;
    saveCroppedImages: boolean;
    supportedVersions: string[];
    useDefaultDatabase: boolean;
    authenticityChecksConfig: {
      hologram: boolean;
      securityText: boolean;
      barcodeFormat: boolean;
      geometryCheck: boolean;
      imagePatterns: boolean;
      photoEmbedding: boolean;
      blackAndWhiteCopy: boolean;
      multipleLaserImage: boolean;
      opticallyVariableInk: boolean;
      electronicDeviceDetection: boolean;
      dynaprint: boolean;
      extendedMRZ: boolean;
      extendedOCR: boolean;
      invisiblePersonalInfo: boolean;
      portraitComparison: boolean;
    };
    imageQualityChecksConfig: {
      focus: boolean;
      glare: boolean;
      bounds: boolean;
      colorness: boolean;
      occlusion: boolean;
      brightness: boolean;
      resolution: boolean;
      perspective: boolean;
      portraitPresence: boolean;
      screenCapture: boolean;
    };
    imageQualityThresholds: {
      dpiThreshold: number;
      angleThreshold: number;
      brightnessThreshold: number;
      documentPositionIndent: number;
      maxGlaringPart: number;
      imgMarginPart: number;
    };
  };
  isUpdate: boolean;
  collapsedSections: {
    basicConfig: boolean;
    authenticityChecks: boolean;
    imageQualityChecks: boolean;
    imageQualityThresholds: boolean;
  };
  selectedLanguage: string;
  selectedLanguageLabel: string;
  supportedVersionsData: Array<{ label: string; value: string }>;
  versionDropdownVisible: boolean;
  languageDropdownVisible: boolean;
  [key: string]: any; // For dynamic text state keys
}

// Language options
const arrLanguage = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' }
];

class IDVConfigSettings extends Component<any, ConfigState> {
  constructor(props: any) {
    super(props);
    this.state = {
      config: {
        version: "3.0",
        saveDebugLogs: true,
        nfcScanEnabled: true,
        nfcScanTimeOut: 45,
        isRawDataRequired: true,
        saveCroppedImages: false,
        supportedVersions: ["3.0"],
        useDefaultDatabase: true,
        authenticityChecksConfig: {
          hologram: true,
          securityText: true,
          barcodeFormat: true,
          geometryCheck: true,
          imagePatterns: true,
          photoEmbedding: true,
          blackAndWhiteCopy: true,
          multipleLaserImage: true,
          opticallyVariableInk: true,
          electronicDeviceDetection: true,
          dynaprint: true,
          extendedMRZ: true,
          extendedOCR: true,
          invisiblePersonalInfo: true,
          portraitComparison: true
        },
        imageQualityChecksConfig: {
          focus: true,
          glare: true,
          bounds: true,
          colorness: true,
          occlusion: true,
          brightness: true,
          resolution: true,
          perspective: true,
          portraitPresence: true,
          screenCapture: true
        },
        imageQualityThresholds: {
          dpiThreshold: 150,
          angleThreshold: 5,
          brightnessThreshold: 50,
          documentPositionIndent: 10,
          maxGlaringPart: 0.1,
          imgMarginPart: 0.07
        }
      },
      isUpdate: true,
      collapsedSections: {
        basicConfig: false,
        authenticityChecks: false,
        imageQualityChecks: false,
        imageQualityThresholds: false
      },
      selectedLanguage: 'en',
      selectedLanguageLabel: 'English',
      supportedVersionsData: [],
      versionDropdownVisible: false,
      languageDropdownVisible: false,
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      this.props.navigation.goBack();
      return true;
    }.bind(this));

    // Get saved language
    const userLang = await AsyncStorage.getItem('AppLanguage') || 'en';
    const selectedLangObj = arrLanguage.find(lang => lang.value === userLang) || arrLanguage[0];
    
    this.setState({
      selectedLanguage: selectedLangObj.value,
      selectedLanguageLabel: selectedLangObj.label
    });
    
    this.getConfig();
  }

  goBack() {
    this.props.navigation.goBack();
  }

  getConfig() {
    RdnaService.getIDVConfig()
      .then((response: any) => {
        console.log('IDV Config Response:', response);
        
        // Parse the response and update state with enhanced structure
        const config = {
          version: response.version || "3.0",
          saveDebugLogs: response.saveDebugLogs !== undefined ? response.saveDebugLogs : true,
          nfcScanEnabled: response.nfcScanEnabled !== undefined ? response.nfcScanEnabled : true,
          nfcScanTimeOut: response.nfcScanTimeOut || 45,
          isRawDataRequired: response.isRawDataRequired !== undefined ? response.isRawDataRequired : true,
          saveCroppedImages: response.saveCroppedImages !== undefined ? response.saveCroppedImages : false,
          supportedVersions: response.supportedVersions || ["3.0"],
          useDefaultDatabase: response.useDefaultDatabase !== undefined ? response.useDefaultDatabase : true,
          
          // Enhanced authenticity checks (merge with server response)
          authenticityChecksConfig: {
            hologram: response.authenticityChecksConfig?.hologram !== undefined ? response.authenticityChecksConfig.hologram : true,
            securityText: response.authenticityChecksConfig?.securityText !== undefined ? response.authenticityChecksConfig.securityText : true,
            barcodeFormat: response.authenticityChecksConfig?.barcodeFormat !== undefined ? response.authenticityChecksConfig.barcodeFormat : true,
            geometryCheck: response.authenticityChecksConfig?.geometryCheck !== undefined ? response.authenticityChecksConfig.geometryCheck : true,
            imagePatterns: response.authenticityChecksConfig?.imagePatterns !== undefined ? response.authenticityChecksConfig.imagePatterns : true,
            photoEmbedding: response.authenticityChecksConfig?.photoEmbedding !== undefined ? response.authenticityChecksConfig.photoEmbedding : true,
            blackAndWhiteCopy: response.authenticityChecksConfig?.blackAndWhiteCopy !== undefined ? response.authenticityChecksConfig.blackAndWhiteCopy : true,
            multipleLaserImage: response.authenticityChecksConfig?.multipleLaserImage !== undefined ? response.authenticityChecksConfig.multipleLaserImage : true,
            opticallyVariableInk: response.authenticityChecksConfig?.opticallyVariableInk !== undefined ? response.authenticityChecksConfig.opticallyVariableInk : true,
            electronicDeviceDetection: response.authenticityChecksConfig?.electronicDeviceDetection !== undefined ? response.authenticityChecksConfig.electronicDeviceDetection : true,
            dynaprint: response.authenticityChecksConfig?.dynaprint !== undefined ? response.authenticityChecksConfig.dynaprint : true,
            extendedMRZ: response.authenticityChecksConfig?.extendedMRZ !== undefined ? response.authenticityChecksConfig.extendedMRZ : true,
            extendedOCR: response.authenticityChecksConfig?.extendedOCR !== undefined ? response.authenticityChecksConfig.extendedOCR : true,
            invisiblePersonalInfo: response.authenticityChecksConfig?.invisiblePersonalInfo !== undefined ? response.authenticityChecksConfig.invisiblePersonalInfo : true,
            portraitComparison: response.authenticityChecksConfig?.portraitComparison !== undefined ? response.authenticityChecksConfig.portraitComparison : true
          },
          
          // Enhanced image quality checks
          imageQualityChecksConfig: {
            focus: response.imageQualityChecksConfig?.focus !== undefined ? response.imageQualityChecksConfig.focus : true,
            glare: response.imageQualityChecksConfig?.glare !== undefined ? response.imageQualityChecksConfig.glare : true,
            bounds: response.imageQualityChecksConfig?.bounds !== undefined ? response.imageQualityChecksConfig.bounds : true,
            colorness: response.imageQualityChecksConfig?.colorness !== undefined ? response.imageQualityChecksConfig.colorness : true,
            occlusion: response.imageQualityChecksConfig?.occlusion !== undefined ? response.imageQualityChecksConfig.occlusion : true,
            brightness: response.imageQualityChecksConfig?.brightness !== undefined ? response.imageQualityChecksConfig.brightness : true,
            resolution: response.imageQualityChecksConfig?.resolution !== undefined ? response.imageQualityChecksConfig.resolution : true,
            perspective: response.imageQualityChecksConfig?.perspective !== undefined ? response.imageQualityChecksConfig.perspective : true,
            portraitPresence: response.imageQualityChecksConfig?.portraitPresence !== undefined ? response.imageQualityChecksConfig.portraitPresence : true,
            screenCapture: response.imageQualityChecksConfig?.screenCapture !== undefined ? response.imageQualityChecksConfig.screenCapture : true
          },
          
          // Enhanced image quality thresholds
          imageQualityThresholds: {
            dpiThreshold: response.imageQualityThresholds?.dpiThreshold || 150,
            angleThreshold: response.imageQualityThresholds?.angleThreshold || 5,
            brightnessThreshold: response.imageQualityThresholds?.brightnessThreshold || 50,
            documentPositionIndent: response.imageQualityThresholds?.documentPositionIndent || 10,
            maxGlaringPart: response.imageQualityThresholds?.maxGlaringPart || 0.1,
            imgMarginPart: response.imageQualityThresholds?.imgMarginPart || 0.07
          }
        };
        
        // Prepare supported versions data for dropdown
        const supportedVersionsData = config.supportedVersions.map(version => ({
          label: `V ${version}`,
          value: version
        }));

        this.setState({
          config: config,
          isUpdate: true,
          supportedVersionsData: supportedVersionsData
        });
      })
      .catch((error: any) => {
        console.error('Error fetching IDV config:', error);
        Alert.alert('Error', 'Failed to get IDV configuration');
      });
  }

  updateConfigValue(section: string | null, key: string, value: any, subsection: string | null = null) {
    const newConfig = { ...this.state.config };
    
    if (subsection) {
      (newConfig as any)[section!][(subsection as any)][key] = value;
    } else if (section) {
      (newConfig as any)[section][key] = value;
    } else {
      (newConfig as any)[key] = value;
    }
    
    this.setState({ config: newConfig, isUpdate: true });
  }

  toggleSection(sectionKey: keyof ConfigState['collapsedSections']) {
    this.setState({
      collapsedSections: {
        ...this.state.collapsedSections,
        [sectionKey]: !this.state.collapsedSections[sectionKey]
      }
    });
  }

  saveConfiguration() {
    // Prepare the configuration object in the format expected by the API
    const configToSave = {
      idv_sdk_app_config: this.state.config
    };
    
    // Call setIDVConfig API with the configuration
    RdnaService.setIDVConfig(JSON.stringify(configToSave))
      .then((result: any) => {
        console.log('IDV Config saved successfully:', result);
        Alert.alert('Success', 'Configuration saved successfully!', [
          { text: 'OK', onPress: () => this.props.navigation.goBack() }
        ]);
      })
      .catch((error: any) => {
        console.error('Error saving IDV config:', error);
        Alert.alert('Error', 'Failed to save IDV configuration');
      });
  }

  renderSectionHeader(title: string, sectionKey: keyof ConfigState['collapsedSections']) {
    const isCollapsed = this.state.collapsedSections[sectionKey];
    return (
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => this.toggleSection(sectionKey)}
      >
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionHeaderText}>{title}</Text>
          <Text style={styles.chevronIcon}>{isCollapsed ? '▼' : '▲'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderBooleanField(label: string, section: string | null, key: string, subsection: string | null = null) {
    const value = subsection 
      ? (this.state.config as any)[section!][(subsection as any)][key]
      : (section ? (this.state.config as any)[section][key] : (this.state.config as any)[key]);

    return (
      <View>
        <View style={[styles.selectedRow, {backgroundColor:'#ffffff'}]}>
          <TouchableOpacity
            onPress={() => this.updateConfigValue(section, key, !value, subsection)}
            style={styles.fieldTouchable}>
            <Text style={styles.fieldText}>
              {label}
            </Text>
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Switch
              value={value}
              onValueChange={(newValue) => this.updateConfigValue(section, key, newValue, subsection)}
              trackColor={{ false: '#767577', true: '#3498db' }}
              thumbColor={value ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  renderNumberField(label: string, section: string | null, key: string, subsection: string | null = null, allowDecimal: boolean = false) {
    const value = subsection 
      ? (this.state.config as any)[section!][(subsection as any)][key]
      : (section ? (this.state.config as any)[section][key] : (this.state.config as any)[key]);

    // For decimal fields, we need to track the text state separately
    const stateKey = `${section}_${subsection || 'null'}_${key}_text`;
    
    return (
      <View>
        <View style={[styles.selectedRow, {backgroundColor:'#ffffff'}]}>
          <View style={styles.fieldTouchable}>
            <Text style={styles.fieldText}>
              {label}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.numberInput}
              value={this.state[stateKey] !== undefined ? this.state[stateKey] : (Math.round(value * 100) / 100).toString()}
              onChangeText={(text) => {
                if (allowDecimal) {
                  // Allow basic decimal format validation
                  const decimalCount = (text.match(/\./g) || []).length;
                  
                  if (decimalCount <= 1 && /^\d*\.?\d*$/.test(text)) {
                    // Update text state for immediate display
                    this.setState({ [stateKey]: text });
                    
                    // Normalize to 2 decimal places for the config value
                    if (text !== '' && text !== '.') {
                      const numValue = parseFloat(text);
                      if (!isNaN(numValue)) {
                        // Round to 2 decimal places
                        const normalizedValue = Math.round(numValue * 100) / 100;
                        this.updateConfigValue(section, key, normalizedValue, subsection);
                      }
                    } else {
                      this.updateConfigValue(section, key, 0, subsection);
                    }
                  }
                } else {
                  // Integer only - immediate update
                  const numValue = parseInt(text) || 0;
                  this.updateConfigValue(section, key, numValue, subsection);
                }
              }}
              onBlur={() => {
                if (allowDecimal && this.state[stateKey] !== undefined) {
                  // Normalize and clean up text state on blur
                  const numValue = parseFloat(this.state[stateKey]) || 0;
                  const normalizedValue = Math.round(numValue * 100) / 100;
                  
                  // Clear temporary text state to show normalized value
                  this.setState({ [stateKey]: undefined });
                  this.updateConfigValue(section, key, normalizedValue, subsection);
                }
              }}
              keyboardType={allowDecimal ? "decimal-pad" : "numeric"}
              returnKeyType="done"
              blurOnSubmit={true}
              selectTextOnFocus={true}
            />
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  renderVersionField() {
    const currentVersion = this.state.config.version;
    const currentVersionLabel = `V ${currentVersion}`;

    return (
      <View>
        <View style={[styles.selectedRow, {backgroundColor:'#ffffff'}]}>
          <View style={styles.fieldTouchable}>
            <Text style={styles.fieldText}>
              Version
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => this.setState({ versionDropdownVisible: true })}
            >
              <Text style={styles.dropdownText}>{currentVersionLabel}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  }

  renderSectionDivider() {
    return <View style={styles.sectionDivider} />;
  }

  renderVersionModal() {
    return (
      <Modal
        transparent={true}
        visible={this.state.versionDropdownVisible}
        animationType="fade"
        onRequestClose={() => this.setState({ versionDropdownVisible: false })}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => this.setState({ versionDropdownVisible: false })}
        >
          <View style={styles.modalContent}>
            {this.state.supportedVersionsData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  this.updateConfigValue(null, 'version', item.value);
                  this.setState({ versionDropdownVisible: false });
                }}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  renderLanguageModal() {
    return (
      <Modal
        transparent={true}
        visible={this.state.languageDropdownVisible}
        animationType="fade"
        onRequestClose={() => this.setState({ languageDropdownVisible: false })}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => this.setState({ languageDropdownVisible: false })}
        >
          <View style={styles.modalContent}>
            {arrLanguage.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  this.setState({
                    selectedLanguage: item.value,
                    selectedLanguageLabel: item.label,
                    languageDropdownVisible: false
                  });
                }}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  async setLanguage(languageCode: string) {
    try {
      await AsyncStorage.setItem('AppLanguage', languageCode);
      
      RdnaService.setApplicationLanguage(languageCode)
        .then((result: any) => {
          console.log('Language set successfully:', result);
        })
        .catch((error: any) => {
          console.error('Error setting language:', error);
        });
    } catch (error) {
      console.error('Error saving language to AsyncStorage:', error);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header - Same as Dashboard */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => this.goBack()}
          >
            <Text style={styles.menuButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>IDV Detailed Configuration</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.contentContainer}>
            {/* Basic Configuration */}
            {this.renderSectionHeader('Basic Configuration', 'basicConfig')}
            {!this.state.collapsedSections.basicConfig && (
              <View>
                {this.renderVersionField()}
                {this.renderBooleanField('Save Debug Logs', null, 'saveDebugLogs')}
                {this.renderBooleanField('NFC Scan Enabled', null, 'nfcScanEnabled')}
                {this.renderNumberField('NFC Scan Timeout', null, 'nfcScanTimeOut')}
                {this.renderBooleanField('Raw Data Required', null, 'isRawDataRequired')}
                {this.renderBooleanField('Save Cropped Images', null, 'saveCroppedImages')}
                {this.renderBooleanField('Use Default Database', null, 'useDefaultDatabase')}
                {this.renderSectionDivider()}
              </View>
            )}
        
            {/* Authenticity Checks */}
            {this.renderSectionHeader('Authenticity Checks', 'authenticityChecks')}
            {!this.state.collapsedSections.authenticityChecks && (
              <View>
                {this.renderBooleanField('Hologram', 'authenticityChecksConfig', 'hologram')}
                {this.renderBooleanField('Security Text', 'authenticityChecksConfig', 'securityText')}
                {this.renderBooleanField('Barcode Format', 'authenticityChecksConfig', 'barcodeFormat')}
                {this.renderBooleanField('Geometry Check', 'authenticityChecksConfig', 'geometryCheck')}
                {this.renderBooleanField('Image Patterns', 'authenticityChecksConfig', 'imagePatterns')}
                {this.renderBooleanField('Photo Embedding', 'authenticityChecksConfig', 'photoEmbedding')}
                {this.renderBooleanField('Black & White Copy', 'authenticityChecksConfig', 'blackAndWhiteCopy')}
                {this.renderBooleanField('Multiple Laser Image', 'authenticityChecksConfig', 'multipleLaserImage')}
                {this.renderBooleanField('Optically Variable Ink', 'authenticityChecksConfig', 'opticallyVariableInk')}
                {this.renderBooleanField('Electronic Device Detection', 'authenticityChecksConfig', 'electronicDeviceDetection')}
                {this.renderBooleanField('Dynaprint', 'authenticityChecksConfig', 'dynaprint')}
                {this.renderBooleanField('Extended MRZ', 'authenticityChecksConfig', 'extendedMRZ')}
                {this.renderBooleanField('Extended OCR', 'authenticityChecksConfig', 'extendedOCR')}
                {this.renderBooleanField('Invisible Personal Info', 'authenticityChecksConfig', 'invisiblePersonalInfo')}
                {this.renderBooleanField('Portrait Comparison', 'authenticityChecksConfig', 'portraitComparison')}
                {this.renderSectionDivider()}
              </View>
            )}
            
            {/* Image Quality Checks */}
            {this.renderSectionHeader('Image Quality Checks', 'imageQualityChecks')}
            {!this.state.collapsedSections.imageQualityChecks && (
              <View>
                {this.renderBooleanField('Focus', 'imageQualityChecksConfig', 'focus')}
                {this.renderBooleanField('Glare', 'imageQualityChecksConfig', 'glare')}
                {this.renderBooleanField('Bounds', 'imageQualityChecksConfig', 'bounds')}
                {this.renderBooleanField('Colorness', 'imageQualityChecksConfig', 'colorness')}
                {this.renderBooleanField('Occlusion', 'imageQualityChecksConfig', 'occlusion')}
                {this.renderBooleanField('Brightness', 'imageQualityChecksConfig', 'brightness')}
                {this.renderBooleanField('Resolution', 'imageQualityChecksConfig', 'resolution')}
                {this.renderBooleanField('Perspective', 'imageQualityChecksConfig', 'perspective')}
                {this.renderBooleanField('Portrait Presence', 'imageQualityChecksConfig', 'portraitPresence')}
                {this.renderBooleanField('Screen Capture', 'imageQualityChecksConfig', 'screenCapture')}
                {this.renderSectionDivider()}
              </View>
            )}
            
            {/* Image Quality Thresholds */}
            {this.renderSectionHeader('Image Quality Thresholds', 'imageQualityThresholds')}
            {!this.state.collapsedSections.imageQualityThresholds && (
              <View>
                {this.renderNumberField('DPI Threshold', 'imageQualityThresholds', 'dpiThreshold')}
                {this.renderNumberField('Angle Threshold', 'imageQualityThresholds', 'angleThreshold')}
                {this.renderNumberField('Brightness Threshold', 'imageQualityThresholds', 'brightnessThreshold')}
                {this.renderNumberField('Document Position Indent', 'imageQualityThresholds', 'documentPositionIndent')}
                {this.renderNumberField('Max Glaring Part', 'imageQualityThresholds', 'maxGlaringPart', null, true)}
                {this.renderNumberField('Image Margin Part', 'imageQualityThresholds', 'imgMarginPart', null, true)}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => this.saveConfiguration()}
          >
            <Text style={styles.saveButtonText}>Save Configuration</Text>
          </TouchableOpacity>
        </View>

        {/* Modals */}
        {this.renderVersionModal()}
        {this.renderLanguageModal()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  contentContainer: {
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  chevronIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRow: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  fieldTouchable: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  fieldText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  switchContainer: {
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
  inputContainer: {
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 80,
    textAlign: 'center',
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 16,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#e9e9e9',
    marginVertical: 4,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    minHeight: 40,
    minWidth: 120,
    borderRadius: 4,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 200,
    maxHeight: 300,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  saveButtonContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IDVConfigSettings;