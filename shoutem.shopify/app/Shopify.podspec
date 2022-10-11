Pod::Spec.new do |s|
  s.name         = "Shopify"
  s.author       = "Shoutem"
  s.version      = "2.2.1"
  s.summary      = "Shopify extension by Shoutem."

  s.homepage     = "http://new.shoutem.com"
  s.license      = { :type => "BSD" }

  s.source       = { :git => "https://github.com/shoutem/extensions", :branch => "master" }

  s.source_files  = "Classes", "Classes/**/*.{h,m,swift}"
  s.exclude_files = "Classes/Exclude"

  s.dependency "Mobile-Buy-SDK", '8.0.0'
  def s.post_install(target)
    target.build_configurations.each do |config|
          config.build_settings['SWIFT_VERSION'] = '4.2'
          config.build_settings['SWIFT_OBJC_BRIDGING_HEADER'] = 'Classes/Bridging-Header.h'
    end
  end
end
