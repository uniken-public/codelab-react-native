module.exports = {
  dependencies: {
    'react-native-rdna-client': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-rdna-client/android/',
          packageImportPath: 'import com.rdnaclient.RdnaClientPackage;',
        },
      },
    },
  },
};