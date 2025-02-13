//
//  NotificationServicePushHandler.swift
//  NotificationServiceExtension
//
//  Created by Sasha Koliychuk on 12.02.2025.
//

import Foundation
import UserNotifications
import CioTracking
import CioMessagingPushFCM

@objc
public class NotificationServicePushHandler : NSObject {

    public override init() {}

    @objc(didReceive:withContentHandler:)
    public func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {

      // Remember to modify the siteId, apiKey and region with your own values.
      let siteId = ProcessInfo.processInfo.environment["c_io_siteId"] ?? ""
      let apiKey = ProcessInfo.processInfo.environment["c_io_apiKey"] ?? ""
      CustomerIO.initialize(siteId: siteId, apiKey: apiKey, region: .US) { config in
        config.autoTrackDeviceAttributes = true
        config.logLevel = .debug
      }
      MessagingPush.shared.didReceive(request, withContentHandler: contentHandler)
    }

    @objc(serviceExtensionTimeWillExpire)
    public func serviceExtensionTimeWillExpire() {
        MessagingPush.shared.serviceExtensionTimeWillExpire()
    }
}
