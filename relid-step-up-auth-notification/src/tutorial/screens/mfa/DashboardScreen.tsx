/**
 * Dashboard Screen
 * 
 * Main dashboard displayed after successful user login.
 * Features drawer navigation with logout functionality and displays
 * welcome message with session information.
 * 
 * Key Features:
 * - Welcome message with user information
 * - Session details display
 * - Drawer navigation with Log Off option
 * - JWT token storage and management
 * 
 * Usage:
 * Navigation.navigate('DashboardScreen', {
 *   userID: 'username',
 *   sessionID: 'session_id',
 *   jwtToken: 'jwt_token_string'
 * });
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import rdnaService from '../../../uniken/services/rdnaService';

/**
 * Route Parameters for Dashboard Screen
 */
interface DashboardScreenParams {
  userID: string;
  sessionID: string;
  sessionType: number;
  jwtToken: string;
  loginTime?: string;
  userRole?: string;
  currentWorkFlow?: string;
}

type DashboardScreenRouteProp = RouteProp<{ DashboardScreen: DashboardScreenParams }, 'DashboardScreen'>;

/**
 * Dashboard Screen Component
 */
const DashboardScreen: React.FC = () => {
  const route = useRoute<DashboardScreenRouteProp>();
  const navigation = useNavigation();
  
  const {
    userID,
    sessionID,
    sessionType,
    jwtToken,
    loginTime = new Date().toLocaleString(),
    userRole = 'NA',
    currentWorkFlow = 'NA',
  } = route.params || {};


  /**
   * Parse JWT token for display (basic parsing for demo)
   */
  const parseJWTInfo = (token: string) => {
    try {
      const tokenData = JSON.parse(token);
      return {
        accessToken: tokenData.access_token ? 'Present' : 'Not available',
        tokenType: tokenData.token_type || 'Unknown',
        expiresIn: tokenData.expires_in || 'Unknown',
        scope: tokenData.scope || 'Unknown'
      };
    } catch {
      return {
        accessToken: 'Invalid',
        tokenType: 'Unknown',
        expiresIn: 'Unknown',
        scope: 'Unknown'
      };
    }
  };

  const jwtInfo = jwtToken ? parseJWTInfo(jwtToken) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => (navigation as any).openDrawer?.()}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome!</Text>
            <Text style={styles.welcomeSubtitle}>You have successfully logged in</Text>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoLabel}>User:</Text>
              <Text style={styles.userInfoValue}>{userID}</Text>
            </View>
          </View>

          {/* Session Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Session Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Session ID:</Text>
              <Text style={styles.infoValue}>{sessionID}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Session Type:</Text>
              <Text style={styles.infoValue}>{sessionType}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Login Time:</Text>
              <Text style={styles.infoValue}>{loginTime}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User Role:</Text>
              <Text style={styles.infoValue}>{userRole}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Workflow:</Text>
              <Text style={styles.infoValue}>{currentWorkFlow}</Text>
            </View>
          </View>

          {/* JWT Information */}
          {jwtInfo && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Authentication Tokens</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Access Token:</Text>
                <Text style={styles.infoValue}>{jwtInfo.accessToken}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Token Type:</Text>
                <Text style={styles.infoValue}>{jwtInfo.tokenType}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Expires In:</Text>
                <Text style={styles.infoValue}>{jwtInfo.expiresIn} seconds</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Scope:</Text>
                <Text style={styles.infoValue}>{jwtInfo.scope}</Text>
              </View>
            </View>
          )}

          {/* Success Message */}
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Authentication completed successfully! Your session is now active and you can access all application features.
            </Text>
          </View>

        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
  },
  userInfoValue: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  successContainer: {
    backgroundColor: '#e8f4f8',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  successText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DashboardScreen;