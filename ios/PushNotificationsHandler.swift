//
//  PushNotificationsHandler.swift
//  ciosample
//
//  Created by Sasha Koliychuk on 12.02.2025.
//

import Foundation
import CioMessagingPushFCM
import UserNotifications
import FirebaseMessaging
import CioTracking

@objc
public class PushNotificationsHandler : NSObject {

  public override init() {}

  @objc(setupCustomerIOClickHandling)
  public func setupCustomerIOClickHandling() {
    // This line of code is required in order for the Customer.io SDK to handle push notification click events.
    // We are working on removing this requirement in a future release.
    // Remember to modify the siteId and apiKey with your own values.
    let siteId = ProcessInfo.processInfo.environment["c_io_siteId"] ?? ""
    let apiKey = ProcessInfo.processInfo.environment["c_io_apiKey"] ?? ""
    
    CustomerIO.initialize(siteId: siteId, apiKey: apiKey, region: Region.US) { config in
      config.autoTrackDeviceAttributes = true
      config.logLevel = .info
    }
    MessagingPushFCM.initialize { config in
      config.autoFetchDeviceToken = true
      config.showPushAppInForeground = true
    }
  }

  // Register device on receiving a device token (FCM)
  @objc(didReceiveRegistrationToken:fcmToken:)
  public func didReceiveRegistrationToken(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    MessagingPush.shared.messaging(messaging, didReceiveRegistrationToken: fcmToken)
  }
}
