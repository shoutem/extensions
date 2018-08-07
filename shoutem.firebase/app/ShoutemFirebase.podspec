#
#  Be sure to run `pod spec lint ShoutemFirebase.podspec' to ensure this is a
#  valid spec and to remove all comments including this before submitting the spec.
#
#  To learn more about Podspec attributes see http://docs.cocoapods.org/specification.html
#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/
#

Pod::Spec.new do |s|
  s.name         = "ShoutemFirebase"
  s.version      = "0.0.1"
  s.summary      = "Native Shoutem extension used for access to Firebase SDK"

  s.homepage     = "http://www.shoutem.com"
  s.license      = { :type => "BSD" }
  s.author       = { "Vladimir Adamic" => "vladimir@shoutem.com" }

  s.source       = { :git => "https://github.com/5minutes/shoutem-extensions.git", :tag => "1.0" }

  s.source_files  = "Classes", "Classes/**/*.{h,m}"
  s.exclude_files = "Classes/Exclude"

  s.dependency "Firebase/Core", "4.9.0"
  s.dependency "Firebase/Messaging", "4.9.0"
end
