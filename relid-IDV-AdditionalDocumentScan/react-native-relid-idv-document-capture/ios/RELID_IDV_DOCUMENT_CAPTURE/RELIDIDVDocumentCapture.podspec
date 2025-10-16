
Pod::Spec.new do |spec|

  spec.platform     = :ios, "13.0"
  spec.name         = "RELIDIDVDocumentCapture"
  spec.version      = "25.08.01"
  spec.summary      = "A short description of RELID_IDV_DOCUMENT_CAPTURE."
  spec.homepage         = 'http://example.com'
  spec.license          = "A short description of RELID_IDV_DOCUMENT_CAPTURE."
  spec.author           = { 'Your Company' => 'email@example.com' }
  spec.source           = { :path => '.' }
	spec.dependency 'DocumentReader', '8.2.4934'
  spec.dependency 'DocumentReaderFullAuthRFIDNightly', '8.3.14143'
  spec.description  = "A short description of RELID_IDV_DOCUMENT_CAPTURE."
  spec.frameworks = "Foundation", "UIKit", "AVFoundation"
end
