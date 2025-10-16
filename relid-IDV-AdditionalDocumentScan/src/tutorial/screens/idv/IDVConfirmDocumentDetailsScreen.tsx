/**
 * IDV Document Confirmation Screen V3
 * 
 * This screen displays comprehensive IDV document analysis results matching ConfirmationScreenV3 UI
 * while maintaining the current project's theme and patterns.
 * Based on ReactReferenceApp/App/Components/AuthScreens/ConfirmationScreenV3.js
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import RdnaService from '../../../uniken/services/rdnaService';
import type { RDNAIDVAdditionalDocumentScanData } from '../../../uniken/types/rdnaEvents';

interface Props {
  route: {
    params: {
      title: string;
      documentDetails:  RDNAIDVAdditionalDocumentScanData;
      isAdditionalDocScan?: boolean;
    };
  };
  navigation: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const IDVConfirmDocumentDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title, documentDetails, isAdditionalDocScan } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  
  // Collapsible states
  const [isDocumentImagesCollapsed, setIsDocumentImagesCollapsed] = useState(false);
  const [isIdentityDataCollapsed, setIsIdentityDataCollapsed] = useState(false);
  const [isChecksPerformedCollapsed, setIsChecksPerformedCollapsed] = useState(false);
  const [isErrorListCollapsed, setIsErrorListCollapsed] = useState(false);
  const [isWarningListCollapsed, setIsWarningListCollapsed] = useState(false);
  const [isNFCStatusCollapsed, setIsNFCStatusCollapsed] = useState(false);
  const [isOverallStatusCollapsed, setIsOverallStatusCollapsed] = useState(false);
  
  // Modal states
  const [selectedCheckDetail, setSelectedCheckDetail] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Individual check collapse states
  const [checksCollapseStates, setChecksCollapseStates] = useState<boolean[]>([]);

  const responseJson = isAdditionalDocScan ? 
    (documentDetails as any).idvResponse : 
    (documentDetails as any).response_data;

  useEffect(() => {
    console.log('IDVConfirmDocumentDetailsScreen - Received document details:', documentDetails);
    
    // Initialize collapse states for checks performed
    if (responseJson?.document_status?.checks_performed) {
      const initialStates = responseJson.document_status.checks_performed.map(() => true);
      setChecksCollapseStates(initialStates);
    }
  }, [documentDetails, responseJson]);

  const handleConfirm = async (isConfirm: boolean) => {
    try {
      setIsLoading(true);
      console.log('IDVConfirmDocumentDetailsScreen - Confirming document details:', isConfirm);
      console.log('IDVConfirmDocumentDetailsScreen - Document details object:', documentDetails);
      console.log('IDVConfirmDocumentDetailsScreen - Is additional doc scan:', isAdditionalDocScan);
      
      // Extract challengeMode based on data type
      const challengeMode = (documentDetails as any).challengeMode || 
                           (documentDetails as any).response_data?.challengeMode || 
                           0; // Default to 0 if not found
      
      console.log('IDVConfirmDocumentDetailsScreen - Using challengeMode:', challengeMode);
      
      
      // Navigate to Dashboard screen after successful confirmation
        console.log('IDVConfirmDocumentDetailsScreen - Document confirmed, navigating to Dashboard');
        navigation.navigate('DrawerNavigator', {
          screen: 'Dashboard'
        });
    
      
    } catch (error) {
      console.error('IDVConfirmDocumentDetailsScreen - Failed to confirm document details:', error);
      Alert.alert('Error', 'Failed to confirm document details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigation.navigate('DrawerNavigator', {
      screen: 'Dashboard'
    });
  };

  const handleRecapture = async () => {
    try {
      setIsLoading(true);
      console.log('IDVConfirmDocumentDetailsScreen - Initiating recapture for additional document scan');
      
      // Call the initiateIDVAdditionalDocumentScan API to restart the document scan process
      await RdnaService.initiateIDVAdditionalDocumentScan('Document Recapture');
      
      console.log('IDVConfirmDocumentDetailsScreen - Recapture initiated successfully');
      
    } catch (error) {
      console.error('IDVConfirmDocumentDetailsScreen - Failed to initiate recapture:', error);
      Alert.alert('Error', 'Failed to initiate document recapture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheckCollapse = (index: number) => {
    const newStates = [...checksCollapseStates];
    newStates[index] = !newStates[index];
    setChecksCollapseStates(newStates);
  };

  const showCheckDetail = (item: any, checkName: string) => {
    setSelectedCheckDetail({ item, checkName });
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedCheckDetail(null);
    setModalVisible(false);
  };

  const getOverallStatusText = (status: string) => {
    switch (status) {
      case 'OK': return 'OK';
      case 'ERROR': return 'ERROR';
      case 'WARNING': return 'WARNING';
      case 'NOT DONE': return 'NOT DONE';
      default: return status || 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return '#2196F3';
      case 'ERROR': return '#D5503F';
      case 'WARNING': return '#FFA500';
      case 'NOT DONE': return '#FFA500';
      default: return '#666666';
    }
  };

  const renderPersonalInfoHeader = () => {
    const fullName = responseJson?.identity_data?.['Surname and given names'] || 
                     `${responseJson?.identity_data?.['Given names'] || ''} ${responseJson?.identity_data?.['Surname'] || ''}`.trim();
    
    return (
      <View style={styles.personalInfoHeader}>
        <View style={styles.personalInfoContent}>
          <View style={styles.personalInfoText}>
            <Text style={styles.nameText}>{fullName}</Text>
            {responseJson?.document_info?.document_images?.signature_image && (
              <Image
                style={styles.signatureImage}
                source={{ uri: `data:image/jpg;base64,${responseJson.document_info.document_images.signature_image}` }}
              />
            )}
          </View>
          <View style={styles.portraitContainer}>
            {responseJson?.document_info?.document_images?.portrait_image && (
              <Image
                style={styles.portraitImage}
                source={{ uri: `data:image/jpg;base64,${responseJson.document_info.document_images.portrait_image}` }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderCollapsibleSection = (
    title: string,
    isCollapsed: boolean,
    onToggle: () => void,
    content: React.ReactNode,
    showContent: boolean = true
  ) => {
    if (!showContent) return null;
    
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{title}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
            <Text style={styles.toggleIcon}>{isCollapsed ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        </View>
        {!isCollapsed && (
          <View style={styles.sectionContent}>
            {content}
          </View>
        )}
      </View>
    );
  };

  const renderDocumentImages = () => {
    const images = [];
    
    if (responseJson?.document_info?.document_images?.front_page) {
      images.push({
        uri: `data:image/jpg;base64,${responseJson.document_info.document_images.front_page}`,
        name: 'Front Page'
      });
    }
    
    if (responseJson?.document_info?.document_images?.back_page) {
      images.push({
        uri: `data:image/jpg;base64,${responseJson.document_info.document_images.back_page}`,
        name: 'Back Page'
      });
    }

    if (images.length === 0) return null;

    return (
      <View>
        {images.map((image, index) => (
          <View key={index} style={styles.documentImageContainer}>
            <Image
              source={{ uri: image.uri }}
              style={styles.documentImage}
              resizeMode="contain"
            />
            <Text style={styles.documentImageName}>{image.name}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderIdentityDataTable = () => {
    if (!responseJson?.identity_data) return null;

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Field</Text>
          <Text style={styles.tableHeaderText}>Value</Text>
        </View>
        {Object.entries(responseJson.identity_data).map(([key, value]) => (
          <View key={key} style={styles.tableRow}>
            <View style={styles.tableFieldColumn}>
              <Text style={styles.tableFieldText}>{key}</Text>
            </View>
            <View style={styles.tableValueColumn}>
              <Text style={styles.tableValueSeparator}>:</Text>
              <Text style={styles.tableValueText}>{String(value)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderCheckPerformedItem = (item: any, checkName: string) => {
    const statusIcon = item.status === "OK" ? '✓' : item.status === "NOT DONE" ? '!' : '✗';
    const statusColor = getStatusColor(item.status);

    return (
      <View key={`${item.element}-${item.lcidName}`} style={styles.checkItem}>
        <View style={styles.checkItemContent}>
          <View style={styles.checkItemLeft}>
            <Text style={styles.checkItemText}>
              {item.element}
              {checkName === 'Data Compliance' && item.lcidName !== 'Latin' && (
                <Text style={styles.checkItemLcid}> ({item.lcidName})</Text>
              )}
            </Text>
            <TouchableOpacity onPress={() => showCheckDetail(item, checkName)}>
              <Text style={styles.detailButton}>ℹ</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.statusIcon, { color: statusColor }]}>{statusIcon}</Text>
        </View>
      </View>
    );
  };

  const renderChecksPerformed = () => {
    if (!responseJson?.document_status?.checks_performed) return null;

    return (
      <View>
        {responseJson.document_status.checks_performed.map((checkData: any, index: number) => (
          <View key={index} style={styles.checkGroupContainer}>
            <View style={styles.checkGroupHeader}>
              <Text style={styles.checkGroupTitle}>{checkData.check_name}</Text>
              <TouchableOpacity onPress={() => toggleCheckCollapse(index)}>
                <Text style={styles.toggleIcon}>{checksCollapseStates[index] ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            </View>
            {!checksCollapseStates[index] && checkData.check_detail && (
              <View style={styles.checkGroupContent}>
                {checkData.check_detail.map((item: any, itemIndex: number) => 
                  renderCheckPerformedItem(item, checkData.check_name)
                )}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderErrorWarningList = (items: string[], title: string) => {
    if (!items || items.length === 0) return null;

    return (
      <View>
        {items.map((item: string, index: number) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderNFCStatus = () => {
    if (!responseJson?.document_status) return null;

    return (
      <View>
        <View style={styles.nfcStatusRow}>
          <Text style={styles.nfcStatusLabel}>Is NFC Document</Text>
          <Text style={styles.nfcStatusValue}>
            : {responseJson.document_status.is_nfc_document ? 'True' : 'False'}
          </Text>
        </View>
        <View style={styles.nfcStatusRow}>
          <Text style={styles.nfcStatusLabel}>NFC Scan Status</Text>
          <Text style={styles.nfcStatusValue}>
            : {responseJson.document_status.nfc_scan_status || 'N/A'}
          </Text>
        </View>
        <View style={styles.nfcStatusRow}>
          <Text style={styles.nfcStatusLabel}>NFC Scan Status Reason</Text>
          <Text style={styles.nfcStatusValue}>
            : {responseJson.document_status.nfc_scan_status_reason || 'N/A'}
          </Text>
        </View>
      </View>
    );
  };

  const renderOverallStatus = () => {
    if (!responseJson?.document_status?.overall_document_status) return null;

    const status = responseJson.document_status.overall_document_status;
    const statusText = getOverallStatusText(status);
    const statusColor = getStatusColor(status);

    return (
      <View style={styles.overallStatusContainer}>
        <Text style={styles.overallStatusLabel}>Overall Document Status</Text>
        <Text style={[styles.overallStatusValue, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
    );
  };

  const renderDetailModal = () => {
    if (!selectedCheckDetail || !modalVisible) return null;
    
    const { item, checkName } = selectedCheckDetail;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {checkName === 'Image Quality' && item.page_index !== undefined 
                  ? `${item.element} (Page ${item.page_index})`
                  : item.element
                }
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {checkName === 'Generic Data Validation' || checkName === 'Data Consistency' ? (
                <View>
                  <Text style={styles.modalDetailText}>• Locale: {item.lcidName}</Text>
                  <Text style={styles.modalDetailText}>
                    • {item.source === undefined ? 'Comparison' : 'Source'}: {
                      item.source === undefined 
                        ? `${item.source1} vs ${item.source2}`
                        : item.source
                    }
                  </Text>
                  <Text style={styles.modalDetailText}>• Detail: {item.detail}</Text>
                </View>
              ) : (
                <Text style={styles.modalDetailText}>{item.detail}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={true}>
        {/* Personal Info Header */}
        {renderPersonalInfoHeader()}

        {/* Document Images */}
        {renderCollapsibleSection(
          'Document Details',
          isDocumentImagesCollapsed,
          () => setIsDocumentImagesCollapsed(!isDocumentImagesCollapsed),
          renderDocumentImages(),
          responseJson?.document_info?.document_images
        )}

        {/* Identity Data */}
        {renderCollapsibleSection(
          'Identity Data',
          isIdentityDataCollapsed,
          () => setIsIdentityDataCollapsed(!isIdentityDataCollapsed),
          renderIdentityDataTable(),
          responseJson?.identity_data
        )}

        {/* Checks Performed */}
        {renderCollapsibleSection(
          'Checks Performed',
          isChecksPerformedCollapsed,
          () => setIsChecksPerformedCollapsed(!isChecksPerformedCollapsed),
          renderChecksPerformed(),
          responseJson?.document_status?.checks_performed?.length > 0
        )}

        {/* Error List */}
        {renderCollapsibleSection(
          'Error List',
          isErrorListCollapsed,
          () => setIsErrorListCollapsed(!isErrorListCollapsed),
          renderErrorWarningList(responseJson?.document_status?.error_list, 'Error List'),
          responseJson?.document_status?.error_list?.length > 0
        )}

        {/* Warning List */}
        {renderCollapsibleSection(
          'Warning List',
          isWarningListCollapsed,
          () => setIsWarningListCollapsed(!isWarningListCollapsed),
          renderErrorWarningList(responseJson?.document_status?.warning_list, 'Warning List'),
          responseJson?.document_status?.warning_list?.length > 0
        )}

        {/* NFC Status */}
        {renderCollapsibleSection(
          'Overall NFC Status',
          isNFCStatusCollapsed,
          () => setIsNFCStatusCollapsed(!isNFCStatusCollapsed),
          renderNFCStatus(),
          responseJson?.document_status
        )}

        {/* Overall Status */}
        {renderCollapsibleSection(
          'Overall Status',
          isOverallStatusCollapsed,
          () => setIsOverallStatusCollapsed(!isOverallStatusCollapsed),
          renderOverallStatus(),
          responseJson?.document_status?.overall_document_status
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.recaptureButton]}
          onPress={handleRecapture}
          disabled={isLoading}
        >
          <Text style={styles.recaptureButtonText}>
            {isLoading ? 'Initiating Recapture...' : 'Recapture'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={() => handleConfirm(true)}
          disabled={isLoading}
        >
          <Text style={styles.confirmButtonText}>
            {isLoading ? 'Processing...' : 
             isAdditionalDocScan ? 'OK' :
             responseJson?.document_status?.overall_document_status === 'OK' ? 'Proceed' : 'Proceed Anyway'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Detail Modal */}
      {renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  personalInfoHeader: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  personalInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalInfoText: {
    flex: 1,
    marginRight: 20,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  signatureImage: {
    height: 45,
    width: '60%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 8,
  },
  portraitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitImage: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3,
    borderRadius: SCREEN_WIDTH / 6,
    backgroundColor: '#ffffff',
  },
  sectionContainer: {
    width: '94%',
    alignSelf: 'center',
    marginTop: 16,
  },
  sectionHeader: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  toggleButton: {
    padding: 4,
  },
  toggleIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
  },
  documentImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  documentImage: {
    width: '100%',
    height: SCREEN_WIDTH / 2,
    borderRadius: 8,
  },
  documentImageName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    borderRadius: 2,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableFieldColumn: {
    flex: 1.2,
  },
  tableFieldText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
    marginLeft: 5,
  },
  tableValueColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableValueSeparator: {
    width: 10,
    fontSize: 13,
    color: '#333333',
  },
  tableValueText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: '#333333',
  },
  checkGroupContainer: {
    marginBottom: 16,
  },
  checkGroupHeader: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkGroupTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  checkGroupContent: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  checkItem: {
    marginVertical: 4,
  },
  checkItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkItemText: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 5,
    flex: 1,
  },
  checkItemLcid: {
    fontSize: 10,
    opacity: 0.8,
  },
  detailButton: {
    color: '#2196F3',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 20,
  },
  statusIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  listBullet: {
    fontSize: 16,
    color: '#333333',
    width: 15,
    marginLeft: 8,
  },
  listText: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
    marginRight: 20,
  },
  nfcStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  nfcStatusLabel: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
  },
  nfcStatusValue: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
    textAlign: 'left',
  },
  overallStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallStatusLabel: {
    fontSize: 15,
    color: '#333333',
    fontWeight: 'bold',
  },
  overallStatusValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  recaptureButton: {
    backgroundColor: '#FF9800', // Orange color for recapture action
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recaptureButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#2196F3',
    borderWidth: 2,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2196F3',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseButton: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  modalDetailText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 8,
  },
});

export default IDVConfirmDocumentDetailsScreen;