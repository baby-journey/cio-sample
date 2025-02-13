//
//  NotificationService.m
//  NotificationServiceExtension
//
//  Created by Sasha Koliychuk on 12.02.2025.
//

#import "NotificationServiceExtension-Swift.h"
#import "NotificationService.h"
#import "FirebaseMessaging.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

// Create object of class MyAppNotificationServicePushHandler
NotificationServicePushHandler* nsHandlerObj = nil;

// Initialize the object
+ (void)initialize {
  nsHandlerObj = [[NotificationServicePushHandler alloc] init];
}

- (void)didReceiveNotificationRequest:(UNNotificationRequest*)request withContentHandler:(void (^)(UNNotificationContent* _Nonnull))contentHandler {
  [nsHandlerObj didReceive:request withContentHandler:contentHandler];
}

- (void)serviceExtensionTimeWillExpire {
  [nsHandlerObj serviceExtensionTimeWillExpire];
}

@end
