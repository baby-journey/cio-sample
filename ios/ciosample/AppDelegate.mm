#import "AppDelegate.h"
#import "ciosample-Swift.h"

#import <Firebase.h>
#import <FirebaseCore.h>
#import <Orientation.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

// Create Object of class MyAppPushNotificationsHandler
PushNotificationsHandler *pnHandlerObj = [[PushNotificationsHandler alloc] init];

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ciosample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // Configure Firebase
  [FIRApp configure];

  // Set FCM messaging delegate
  [FIRMessaging messaging].delegate = self;
  
  // Use modifiedLaunchOptions for passing link to React Native bridge to sends users to the specified screen
  NSMutableDictionary *modifiedLaunchOptions = [NSMutableDictionary dictionaryWithDictionary:launchOptions];
  if (launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey]) {
    NSDictionary *pushContent = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    if (pushContent[@"CIO"] && pushContent[@"CIO"][@"push"] && pushContent[@"CIO"][@"push"][@"link"]) {
      NSString *initialURL = pushContent[@"CIO"][@"push"][@"link"];
      if (!launchOptions[UIApplicationLaunchOptionsURLKey]) {
        modifiedLaunchOptions[UIApplicationLaunchOptionsURLKey] = [NSURL URLWithString:initialURL];
      }
    }
  }
  
  [pnHandlerObj setupCustomerIOClickHandling];

  return [super application:application didFinishLaunchingWithOptions:modifiedLaunchOptions];
//  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}



@end
